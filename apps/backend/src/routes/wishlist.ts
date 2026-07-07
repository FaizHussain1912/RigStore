import express from 'express';
import { PrismaClient } from '@rigstore/database';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get wishlist
router.get('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    let wishlist = await prisma.wishlist.findUnique({
      where: { userId: req.user!.userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: { userId: req.user!.userId },
        include: { items: { include: { product: true } } }
      });
    }

    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
});

// Add to wishlist
router.post('/items', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { productId } = req.body;

    let wishlist = await prisma.wishlist.findUnique({ where: { userId: req.user!.userId } });
    if (!wishlist) {
      wishlist = await prisma.wishlist.create({ data: { userId: req.user!.userId } });
    }

    const existingItem = await prisma.wishlistItem.findUnique({
      where: {
        wishlistId_productId: {
          wishlistId: wishlist.id,
          productId
        }
      }
    });

    if (!existingItem) {
      await prisma.wishlistItem.create({
        data: {
          wishlistId: wishlist.id,
          productId
        }
      });
    }

    const updatedWishlist = await prisma.wishlist.findUnique({
      where: { id: wishlist.id },
      include: { items: { include: { product: true } } }
    });

    res.json(updatedWishlist);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add item to wishlist' });
  }
});

// Remove from wishlist
router.delete('/items/:productId', requireAuth, async (req: AuthRequest, res) => {
  try {
    const wishlist = await prisma.wishlist.findUnique({ where: { userId: req.user!.userId } });
    if (!wishlist) return res.status(404).json({ error: 'Wishlist not found' });

    await prisma.wishlistItem.deleteMany({
      where: {
        wishlistId: wishlist.id,
        productId: req.params.productId
      }
    });

    const updatedWishlist = await prisma.wishlist.findUnique({
      where: { id: wishlist.id },
      include: { items: { include: { product: true } } }
    });

    res.json(updatedWishlist);
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove item' });
  }
});

export default router;
