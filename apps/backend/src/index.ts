import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { PrismaClient } from '@rigstore/database';
import authRouter from './routes/auth';
import cartRouter from './routes/cart';
import wishlistRouter from './routes/wishlist';
import ordersRouter from './routes/orders';
import adminRouter from './routes/admin';

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 6767;

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' }
});

const activeUsers = new Map<string, any>();

io.on('connection', (socket) => {
  socket.on('tracking_update', (data) => {
    let clientIp = socket.handshake.headers['x-forwarded-for'] || socket.handshake.address;
    if (clientIp === '::1' || clientIp === '::ffff:127.0.0.1') clientIp = '127.0.0.1';
    
    // Convert array of IPs if multiple proxies exist
    if (Array.isArray(clientIp)) clientIp = clientIp[0];
    else if (typeof clientIp === 'string' && clientIp.includes(',')) clientIp = clientIp.split(',')[0];

    const isLocal = clientIp === '127.0.0.1' || String(clientIp).startsWith('192.168.') || String(clientIp).startsWith('10.');
    const location = data.location || (isLocal ? 'Local, Pakistan' : 'Global Visitor');

    activeUsers.set(socket.id, {
      id: socket.id,
      path: data.path,
      device: data.device || 'Desktop',
      browser: data.browser || 'Unknown',
      location: location,
      ip: clientIp,
      lastActive: Date.now(),
      sessionStarted: data.sessionStarted || Date.now()
    });
    
    io.to('admins').emit('active_users', Array.from(activeUsers.values()));
  });

  socket.on('join_admin', () => {
    socket.join('admins');
    socket.emit('active_users', Array.from(activeUsers.values()));
  });

  socket.on('disconnect', () => {
    activeUsers.delete(socket.id);
    io.to('admins').emit('active_users', Array.from(activeUsers.values()));
  });
});

setInterval(() => {
  const now = Date.now();
  let changed = false;
  activeUsers.forEach((user, id) => {
    if (now - user.lastActive > 15000) {
      activeUsers.delete(id);
      changed = true;
    }
  });
  if (changed) {
    io.to('admins').emit('active_users', Array.from(activeUsers.values()));
  }
}, 5000);

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'RigStore Backend API is running!' });
});

// --- AUTH API ---
app.use('/api/auth', authRouter);
app.use('/api/cart', cartRouter);
app.use('/api/wishlist', wishlistRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/admin', adminRouter);

// --- PUBLIC SETTINGS API ---
app.get('/api/settings/public', async (req, res) => {
  try {
    const settings = await prisma.storeSetting.findMany({
      where: {
        key: {
          in: ['GENERAL_SETTINGS', 'DELIVERY_AREAS_SETTINGS'] // Extend as needed
        }
      }
    });
    const settingsMap: Record<string, any> = {};
    settings.forEach(s => {
      settingsMap[s.key] = s.value;
    });
    res.json(settingsMap);
  } catch (error) {
    console.error("Error fetching public settings:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- CATALOG API ---
app.get('/api/products', async (req, res) => {
  try {
    const { sort, minPrice, maxPrice } = req.query;
    let orderBy: any = undefined;

    if (sort === 'price_asc') {
      orderBy = { basePrice: 'asc' };
    } else if (sort === 'price_desc') {
      orderBy = { basePrice: 'desc' };
    } else if (sort === 'popularity') {
      orderBy = { inventory: { salesVelocity7Days: 'desc' } };
    }

    const whereClause: any = {};
    if (minPrice || maxPrice) {
      whereClause.basePrice = {};
      if (minPrice && !isNaN(Number(minPrice))) whereClause.basePrice.gte = Number(minPrice);
      if (maxPrice && !isNaN(Number(maxPrice))) whereClause.basePrice.lte = Number(maxPrice);
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        category: true,
        inventory: true
      },
      orderBy
    });

    // In PostgreSQL, JSONB fields are natively returned as objects, no need to parse
    const parsedProducts = products.map((p) => ({
      ...p,
      specs: p.specs,
      compatibility: p.compatibility
    }));

    res.json(parsedProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- SINGLE PRODUCT API ---
app.get('/api/product/:slug', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug },
      include: {
        category: true,
        inventory: true
      }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const parsedProduct = {
      ...product,
      specs: product.specs,
      compatibility: product.compatibility
    };

    res.json(parsedProduct);
  } catch (error) {
    console.error("Error fetching single product:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- CATEGORY API ---
app.get('/api/category/:slug', async (req, res) => {
  try {
    const { sort, minPrice, maxPrice, brand, ...filters } = req.query;
    let orderBy: any = undefined;

    if (sort === 'price_asc') {
      orderBy = { basePrice: 'asc' };
    } else if (sort === 'price_desc') {
      orderBy = { basePrice: 'desc' };
    } else if (sort === 'popularity') {
      orderBy = { inventory: { salesVelocity7Days: 'desc' } };
    }

    const whereClause: any = {
      category: { slug: req.params.slug }
    };

    if (minPrice || maxPrice) {
      whereClause.basePrice = {};
      if (minPrice && !isNaN(Number(minPrice))) whereClause.basePrice.gte = Number(minPrice);
      if (maxPrice && !isNaN(Number(maxPrice))) whereClause.basePrice.lte = Number(maxPrice);
    }

    if (brand && typeof brand === 'string') {
      whereClause.brand = brand;
    }

    // Apply JSONB filtering for any remaining query params
    const specFilters = Object.entries(filters).filter(([key, val]) => typeof val === 'string' && val !== '');
    if (specFilters.length > 0) {
      whereClause.AND = specFilters.map(([key, val]) => ({
        specs: {
          path: [key],
          equals: val
        }
      }));
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        category: true,
        inventory: true
      },
      orderBy
    });

    const parsedProducts = products.map((p) => ({
      ...p,
      specs: p.specs,
      compatibility: p.compatibility
    }));

    res.json(parsedProducts);
  } catch (error) {
    console.error("Error fetching category products:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- INVENTORY / B2B API ---
app.get('/api/inventory', async (req, res) => {
  try {
    const inventoryItems = await prisma.inventory.findMany({
      include: {
        product: {
          select: { name: true, sku: true, brand: true }
        }
      },
      orderBy: {
        salesVelocity7Days: 'desc'
      }
    });
    res.json(inventoryItems);
  } catch (error) {
    console.error("Error fetching inventory:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

httpServer.listen(PORT, () => {
  console.log(`🚀 RigStore Backend is running on http://localhost:${PORT}`);
});
