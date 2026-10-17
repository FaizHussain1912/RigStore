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
import reviewsRouter from './routes/reviews';
import couponsRouter from './routes/coupons';
import builderRouter from './routes/builder';
import contactRouter from './routes/contact';

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

// --- API ROUTES ---
app.use('/api/auth', authRouter);
app.use('/api/cart', cartRouter);
app.use('/api/wishlist', wishlistRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/admin', adminRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/coupons', couponsRouter);
app.use('/api/builder', builderRouter);
app.use('/api/contact', contactRouter);

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

// --- SEARCH PRODUCTS API ---
const categorySynonyms: Record<string, string[]> = {
  'laptops': ['laptop', 'laptops', 'notebook', 'notebooks'],
  'mice': ['mouse', 'mice'],
  'keyboards': ['keyboard', 'keyboards'],
  'monitors': ['monitor', 'monitors', 'display', 'screen', 'screens'],
  'gpus': ['gpu', 'gpus', 'graphic card', 'graphic cards', 'graphics card', 'graphics cards', 'vga', 'video card'],
  'processors': ['processor', 'processors', 'cpu', 'cpus'],
  'storage': ['storage', 'ssd', 'ssds', 'hdd', 'hard drive', 'hard disk', 'nvme'],
  'memory': ['ram', 'memory', 'ddr4', 'ddr5'],
  'coolers': ['cooler', 'coolers', 'aio', 'cooling', 'heatsink', 'fan'],
  'cases': ['case', 'cases', 'chassis', 'casing', 'cabinet'],
  'psus': ['psu', 'psus', 'power supply', 'power supplies'],
  'headphones': ['headphone', 'headphones', 'headset', 'headsets', 'earphone', 'earphones'],
  'desktops': ['desktop', 'desktops', 'prebuilt', 'pc', 'gaming pc'],
};

app.get('/api/products/search', async (req, res) => {
  try {
    const q = req.query.q as string;
    if (!q || !q.trim()) {
      return res.json([]);
    }

    const cleanQ = q.trim();
    const lowerQ = cleanQ.toLowerCase();
    const tokens = lowerQ.split(/\s+/).filter(Boolean);

    // 1. Identify category intent
    const categories = await prisma.category.findMany();
    let targetCategoryIds: string[] = [];
    let isCategoryIntent = false;

    for (const cat of categories) {
      const synonyms = categorySynonyms[cat.slug] || [cat.slug, cat.name.toLowerCase()];
      const isMatch = synonyms.some(syn => lowerQ === syn || tokens.includes(syn));
      if (isMatch) {
        targetCategoryIds.push(cat.id);
        isCategoryIntent = true;
      }
    }

    // Check if it's a pure category search (e.g. 'laptop', 'laptops', 'mouse', 'gpus')
    const isPureCategory = targetCategoryIds.length > 0 && categories.some(c => {
      const syns = categorySynonyms[c.slug] || [c.slug, c.name.toLowerCase()];
      return syns.includes(lowerQ);
    });

    let whereClause: any;

    if (isPureCategory) {
      // Pure category search: strictly match products belonging to this category or with the term in their title
      whereClause = {
        OR: [
          { categoryId: { in: targetCategoryIds } },
          { name: { contains: cleanQ, mode: 'insensitive' } }
        ]
      };
    } else if (isCategoryIntent) {
      // Compound search (e.g. 'gaming laptop', 'logitech mouse', 'samsung ssd')
      const nonCategoryTokens = tokens.filter(t => {
        for (const list of Object.values(categorySynonyms)) {
          if (list.includes(t)) return false;
        }
        return true;
      });

      const andConditions: any[] = [];
      if (targetCategoryIds.length > 0) {
        andConditions.push({
          OR: [
            { categoryId: { in: targetCategoryIds } },
            { name: { contains: cleanQ, mode: 'insensitive' } }
          ]
        });
      }

      if (nonCategoryTokens.length > 0) {
        nonCategoryTokens.forEach(token => {
          andConditions.push({
            OR: [
              { name: { contains: token, mode: 'insensitive' } },
              { brand: { contains: token, mode: 'insensitive' } },
              { description: { contains: token, mode: 'insensitive' } }
            ]
          });
        });
      }

      whereClause = andConditions.length > 0 ? { AND: andConditions } : {};
    } else {
      // Keyword/brand search (e.g. 'ThinkPad', 'RTX 4070', 'Corsair', 'White')
      whereClause = {
        OR: [
          { name: { contains: cleanQ, mode: 'insensitive' } },
          { brand: { contains: cleanQ, mode: 'insensitive' } },
          { description: { contains: cleanQ, mode: 'insensitive' } }
        ]
      };
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        category: true,
        inventory: true
      },
      take: 100
    });

    // 2. Score and rank by relevance
    const ranked = products.map(product => {
      let score = 0;
      const pName = product.name.toLowerCase();
      const pBrand = (product.brand || '').toLowerCase();
      const pDesc = (product.description || '').toLowerCase();
      const pCat = (product.category?.name || '').toLowerCase();

      // Full exact name match
      if (pName === lowerQ) score += 200;
      else if (pName.startsWith(lowerQ)) score += 120;
      else if (pName.includes(lowerQ)) score += 100;

      // Category match
      if (targetCategoryIds.includes(product.categoryId)) score += 80;
      else if (pCat.includes(lowerQ)) score += 70;

      // Brand match
      if (pBrand === lowerQ) score += 60;
      else if (pBrand.includes(lowerQ)) score += 40;

      // Keyword token matches
      tokens.forEach(tok => {
        if (pName.includes(tok)) score += 25;
        if (pBrand.includes(tok)) score += 15;
      });

      if (!isCategoryIntent && pDesc.includes(lowerQ)) score += 10;

      return {
        ...product,
        specs: product.specs,
        compatibility: product.compatibility,
        _searchScore: score
      };
    });

    ranked.sort((a, b) => b._searchScore - a._searchScore);

    res.json(ranked);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to search products' });
  }
});

// --- CATALOG API ---
app.get('/api/products', async (req, res) => {
  try {
    const { sort, minPrice, maxPrice, search } = req.query;
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

    if (search && typeof search === 'string' && search.trim()) {
      const s = search.trim();
      whereClause.OR = [
        { name: { contains: s, mode: 'insensitive' } },
        { brand: { contains: s, mode: 'insensitive' } },
        { category: { name: { contains: s, mode: 'insensitive' } } }
      ];
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
    let slug = req.params.slug;
    if (slug === 'accessories') slug = 'peripherals';

    const { sort, minPrice, maxPrice, brand, ...filters } = req.query;
    let orderBy: any = undefined;

    if (sort === 'price_asc') {
      orderBy = { basePrice: 'asc' };
    } else if (sort === 'price_desc') {
      orderBy = { basePrice: 'desc' };
    } else if (sort === 'popularity') {
      orderBy = { inventory: { salesVelocity7Days: 'desc' } };
    }

    const whereClause: any = {};

    // If slug is NOT 'all', filter by category slug
    if (slug !== 'all') {
      whereClause.category = { slug };
    }

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
