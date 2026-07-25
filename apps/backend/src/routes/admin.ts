import express from 'express';
import { PrismaClient } from '@rigstore/database';
import { requireAuth, requireAdmin, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// All admin routes require authentication AND admin role
router.use(requireAuth, requireAdmin);

// Get Dashboard Stats
router.get('/stats', async (req: AuthRequest, res) => {
  try {
    const { filter = 'ALL', year, month } = req.query as { filter?: string, year?: string, month?: string };

    let dateFilter: any = undefined;
    
    if (filter === 'YEARLY' && year) {
      dateFilter = {
        gte: new Date(`${year}-01-01T00:00:00.000Z`),
        lte: new Date(`${year}-12-31T23:59:59.999Z`)
      };
    } else if (filter === 'MONTHLY' && year && month) {
      // month is 1-12
      const startDate = new Date(`${year}-${month.padStart(2, '0')}-01T00:00:00.000Z`);
      const nextMonthDate = new Date(startDate);
      nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
      
      dateFilter = {
        gte: startDate,
        lt: nextMonthDate
      };
    }

    const baseWhere = dateFilter ? { createdAt: dateFilter } : {};

    const totalUsers = await prisma.user.count({ where: baseWhere });
    const totalOrders = await prisma.order.count({ where: baseWhere });
    const pendingOrders = await prisma.order.count({ where: { ...baseWhere, status: 'PENDING' } });
    
    // Total Revenue and Profit
    const orders = await prisma.order.findMany({
      where: { ...baseWhere, status: { notIn: ['CANCELLED'] } },
      select: { 
        totalAmount: true,
        items: {
          select: {
            quantity: true,
            priceAtSale: true,
            originalPriceAtSale: true
          }
        }
      }
    });

    let totalRevenue = 0;
    let totalProfit = 0;

    for (const order of orders) {
      totalRevenue += order.totalAmount;
      for (const item of order.items) {
        totalProfit += (item.priceAtSale - item.originalPriceAtSale) * item.quantity;
      }
    }

    res.json({
      totalUsers,
      totalOrders,
      pendingOrders,
      totalRevenue,
      totalProfit
    });
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Get Users
router.get('/users', async (req: AuthRequest, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: { orders: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get Orders
router.get('/orders', async (req: AuthRequest, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { product: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Update Order Status
router.patch('/orders/:id/status', async (req: AuthRequest, res) => {
  try {
    const { status } = req.body;
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status }
    });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Delete Order
router.delete('/orders/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    
    // First delete order items
    await prisma.orderItem.deleteMany({
      where: { orderId: id }
    });
    
    // Then delete the order itself
    await prisma.order.delete({
      where: { id }
    });
    
    res.json({ success: true, message: 'Order deleted successfully' });
  } catch (error: any) {
    console.error("Failed to delete order:", error);
    res.status(500).json({ error: 'Failed to delete order', details: error.message });
  }
});

// Get Inventory
router.get('/inventory', async (req: AuthRequest, res) => {
  try {
    const inventory = await prisma.inventory.findMany({
      include: {
        product: { select: { name: true, sku: true, brand: true, basePrice: true } }
      },
      orderBy: { totalStock: 'asc' }
    });
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
});

// Update Inventory Stock
router.patch('/inventory/:id/stock', async (req: AuthRequest, res) => {
  try {
    const { totalStock } = req.body;
    const inventory = await prisma.inventory.update({
      where: { id: req.params.id },
      data: { totalStock }
    });
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update inventory' });
  }
});

// --- PRODUCT MANAGEMENT ROUTES ---

// Get all categories for dropdowns
router.get('/categories', async (req: AuthRequest, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get all products (admin view)
router.get('/products', async (req: AuthRequest, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        inventory: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Create a new product
router.post('/products', async (req: AuthRequest, res) => {
  try {
    const { 
      name, sku, slug, brand, basePrice, originalPrice, categoryId, description, imageUrl, 
      totalStock, specs, compatibility 
    } = req.body;

    const newProduct = await prisma.product.create({
      data: {
        name,
        sku,
        slug,
        brand,
        basePrice: parseFloat(basePrice),
        originalPrice: parseFloat(originalPrice) || parseFloat(basePrice),
        categoryId,
        description,
        imageUrl,
        specs: specs || {},
        compatibility: compatibility || {},
        inventory: {
          create: {
            totalStock: parseInt(totalStock) || 0
          }
        }
      },
      include: {
        category: true,
        inventory: true
      }
    });

    res.json(newProduct);
  } catch (error: any) {
    console.error("Failed to create product:", error);
    res.status(500).json({ error: 'Failed to create product', details: error.message });
  }
});

// Update an existing product
router.put('/products/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { 
      name, sku, slug, brand, basePrice, originalPrice, categoryId, description, imageUrl, 
      totalStock, specs, compatibility 
    } = req.body;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        sku,
        slug,
        brand,
        basePrice: parseFloat(basePrice),
        originalPrice: parseFloat(originalPrice) || parseFloat(basePrice),
        categoryId,
        description,
        imageUrl,
        specs: specs || {},
        compatibility: compatibility || {},
        inventory: {
          update: {
            totalStock: parseInt(totalStock) || 0
          }
        }
      },
      include: {
        category: true,
        inventory: true
      }
    });

    res.json(updatedProduct);
  } catch (error: any) {
    console.error("Failed to update product:", error);
    res.status(500).json({ error: 'Failed to update product', details: error.message });
  }
});

// Delete a product
router.delete('/products/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    
    // Perform cleanup for related records lacking cascade deletes
    await prisma.$transaction([
      prisma.cartItem.deleteMany({ where: { productId: id } }),
      prisma.wishlistItem.deleteMany({ where: { productId: id } }),
      // Note: We might not want to delete OrderItems as it corrupts past order history.
      // A soft delete is generally better, but for simplicity here we assume
      // it's okay to delete products that have no orders, or we delete order items too (dangerous).
      // Since order items don't have cascade delete, deleting the product will fail if it's in an order.
      // Let's just catch the error if it's referenced in an order and inform the user.
    ]);

    await prisma.product.delete({
      where: { id }
    });

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error: any) {
    console.error("Failed to delete product:", error);
    // Prisma code for Foreign Key constraint failed
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Cannot delete product because it is referenced in past orders.' });
    }
    res.status(500).json({ error: 'Failed to delete product', details: error.message });
  }
});
// --- SETTINGS MANAGEMENT ROUTES ---

// Get all store settings
router.get('/settings', async (req: AuthRequest, res) => {
  try {
    const settings = await prisma.storeSetting.findMany();
    const settingsMap: Record<string, any> = {};
    settings.forEach(s => {
      settingsMap[s.key] = s.value;
    });
    res.json(settingsMap);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Update store settings (bulk)
router.put('/settings', async (req: AuthRequest, res) => {
  try {
    const settingsData = req.body; 
    const promises = Object.keys(settingsData).map(key => 
      prisma.storeSetting.upsert({
        where: { key },
        update: { value: settingsData[key] },
        create: { key, value: settingsData[key] }
      })
    );
    await Promise.all(promises);
    res.json({ success: true, message: 'Settings updated successfully' });
  } catch (error: any) {
    console.error('Failed to update settings:', error);
    res.status(500).json({ error: 'Failed to update settings', details: error.message });
  }
});

// Update User Name
router.put('/users/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const user = await prisma.user.update({
      where: { id },
      data: { name },
      select: { id: true, name: true, email: true, role: true }
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete User Account
router.delete('/users/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    
    if (id === req.user?.userId) {
       return res.status(400).json({ error: 'Cannot delete your own admin account from here' });
    }

    const userOrders = await prisma.order.findMany({ where: { userId: id } });
    const orderIds = userOrders.map((o: any) => o.id);
    
    if (orderIds.length > 0) {
      await prisma.orderItem.deleteMany({ where: { orderId: { in: orderIds } } });
      await prisma.order.deleteMany({ where: { userId: id } });
    }

    await prisma.user.delete({ where: { id } });

    res.json({ success: true });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user account' });
  }
});

export default router;
