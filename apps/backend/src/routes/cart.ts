import express from 'express';
import { PrismaClient } from '@rigstore/database';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get cart
router.get('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    let cart = await prisma.cart.findUnique({
      where: { userId: req.user!.userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: req.user!.userId },
        include: { items: { include: { product: true } } }
      });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// Add to cart
router.post('/items', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { productId, quantity } = req.body;

    let cart = await prisma.cart.findUnique({ where: { userId: req.user!.userId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId: req.user!.userId } });
    }

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId
        }
      }
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity }
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity
        }
      });
    }

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: { items: { include: { product: true } } }
    });

    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

// Remove from cart
router.delete('/items/:productId', requireAuth, async (req: AuthRequest, res) => {
  try {
    const cart = await prisma.cart.findUnique({ where: { userId: req.user!.userId } });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
        productId: req.params.productId
      }
    });

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: { items: { include: { product: true } } }
    });

    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove item' });
  }
});

// Clear cart
router.delete('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const cart = await prisma.cart.findUnique({ where: { userId: req.user!.userId } });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

// Sync cart (merge local cart to server)
router.post('/sync', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { localItems } = req.body; // Array of { productId, quantity }

    let cart = await prisma.cart.findUnique({ where: { userId: req.user!.userId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId: req.user!.userId } });
    }

    if (Array.isArray(localItems)) {
      for (const item of localItems) {
        const existingItem = await prisma.cartItem.findUnique({
          where: { cartId_productId: { cartId: cart.id, productId: item.productId } }
        });

        if (existingItem) {
          await prisma.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity: Math.max(existingItem.quantity, item.quantity) }
          });
        } else {
          await prisma.cartItem.create({
            data: { cartId: cart.id, productId: item.productId, quantity: item.quantity }
          });
        }
      }
    }

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: { items: { include: { product: true } } }
    });

    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: 'Failed to sync cart' });
  }
});

export default router;
