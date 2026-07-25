import express from 'express';
import { PrismaClient } from '@rigstore/database';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get user orders
router.get('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user!.userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Checkout (create order from cart)
router.post('/checkout', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    const cart = await prisma.cart.findUnique({
      where: { userId: req.user!.userId },
      include: { items: { include: { product: true } } }
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const settings = await prisma.storeSetting.findUnique({ where: { key: 'GENERAL_SETTINGS' } });
    let shippingRate = 0;
    if (settings && settings.value) {
      const val = settings.value as Record<string, any>;
      shippingRate = val.shippingRate ? parseInt(val.shippingRate) : 0;
    }

    // Calculate total
    const itemsTotal = cart.items.reduce((sum, item) => {
      return sum + (item.product.basePrice * item.quantity);
    }, 0);
    const totalAmount = itemsTotal + shippingRate;

    // Format full address as "Address, Area, City, ZipCode, Country"
    const fullAddress = shippingAddress 
      ? [shippingAddress.address, shippingAddress.area, shippingAddress.city, shippingAddress.zipCode, shippingAddress.country].filter(Boolean).join(', ')
      : undefined;

    // Create Order
    const order = await prisma.order.create({
      data: {
        userId: req.user!.userId,
        status: 'PENDING',
        totalAmount,
        phone: shippingAddress?.phone,
        address: fullAddress,
        paymentMethod: paymentMethod || 'Cash on Delivery',
        items: {
          create: cart.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            priceAtSale: item.product.basePrice
          }))
        }
      },
      include: {
        items: { include: { product: true } }
      }
    });

    // Clear cart after checkout
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id }
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Failed to process checkout' });
  }
});
// Request Order Cancellation
router.post('/:id/cancel-request', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const order = await prisma.order.findUnique({
      where: { id }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.userId !== req.user!.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (order.status !== 'PENDING') {
      return res.status(400).json({ error: 'Only pending orders can be cancelled' });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        cancelRequested: true,
        cancelReason: reason || null
      }
    });

    res.json(updatedOrder);
  } catch (error: any) {
    console.error('Cancel request error:', error);
    res.status(500).json({ error: error.message || 'Failed to request cancellation' });
  }
});

// Guest Checkout (No auth required)
router.post('/guest-checkout', async (req, res) => {
  try {
    const { shippingAddress, paymentMethod, items, guestName, guestEmail } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    if (!guestName || !guestEmail) {
      return res.status(400).json({ error: 'Name and email are required for guest checkout' });
    }

    const settings = await prisma.storeSetting.findUnique({ where: { key: 'GENERAL_SETTINGS' } });
    let shippingRate = 0;
    if (settings && settings.value) {
      const val = settings.value as Record<string, any>;
      shippingRate = val.shippingRate ? parseInt(val.shippingRate) : 0;
    }

    // Fetch actual prices from DB to prevent tampering
    let itemsTotal = 0;
    const orderItemsData = [];
    
    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) {
        return res.status(400).json({ error: `Product ${item.productId} not found` });
      }
      itemsTotal += product.basePrice * item.quantity;
      orderItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        priceAtSale: product.basePrice,
        originalPriceAtSale: product.originalPrice
      });
    }

    const totalAmount = itemsTotal + shippingRate;

    // Format full address as "Address, Area, City, ZipCode, Country"
    const fullAddress = shippingAddress 
      ? [shippingAddress.address, shippingAddress.area, shippingAddress.city, shippingAddress.zipCode, shippingAddress.country].filter(Boolean).join(', ')
      : undefined;

    // Create Order
    const order = await prisma.order.create({
      data: {
        guestName,
        guestEmail,
        status: 'PENDING',
        totalAmount,
        phone: shippingAddress?.phone,
        address: fullAddress,
        paymentMethod: paymentMethod || 'Cash on Delivery',
        items: {
          create: orderItemsData
        }
      },
      include: {
        items: { include: { product: true } }
      }
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Guest checkout error:', error);
    res.status(500).json({ error: 'Failed to process checkout' });
  }
});

// Track Order (Public by UUID)
router.get('/track/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findFirst({
      where: { id: { startsWith: id.toLowerCase() } },
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { product: true } }
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to track order' });
  }
});

// Cancel Order (Public by UUID, only if PENDING)
router.post('/track/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const order = await prisma.order.findFirst({
      where: { id: { startsWith: id.toLowerCase() } }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.status !== 'PENDING') {
      return res.status(400).json({ error: 'Only pending orders can be cancelled' });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        cancelRequested: true,
        cancelReason: reason || null
      }
    });

    res.json(updatedOrder);
  } catch (error: any) {
    console.error('Cancel request error:', error);
    res.status(500).json({ error: error.message || 'Failed to request cancellation' });
  }
});

export default router;
