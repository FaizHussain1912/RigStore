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

    // Calculate total
    const totalAmount = cart.items.reduce((sum, item) => {
      return sum + (item.product.basePrice * item.quantity);
    }, 0);

    // Format full address
    const fullAddress = shippingAddress 
      ? `${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.zipCode}, ${shippingAddress.country}`
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

export default router;
