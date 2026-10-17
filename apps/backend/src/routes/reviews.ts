import express from 'express';
import { PrismaClient } from '@rigstore/database';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/reviews/product/:productId - Get reviews for a product
router.get('/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true } }
      }
    });

    const total = reviews.length;
    const avgRating = total > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / total) : 5;

    res.json({
      reviews,
      total,
      avgRating: Number(avgRating.toFixed(1))
    });
  } catch (error: any) {
    console.error('Fetch reviews error:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// POST /api/reviews/product/:productId - Add a review
router.post('/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { userName, rating, comment, userId } = req.body;

    if (!comment || !rating) {
      return res.status(400).json({ error: 'Rating and comment are required' });
    }

    const numRating = Math.max(1, Math.min(5, parseInt(rating) || 5));

    const newReview = await prisma.review.create({
      data: {
        productId,
        userName: userName || 'Customer',
        rating: numRating,
        comment,
        userId: userId || null
      }
    });

    res.status(201).json(newReview);
  } catch (error: any) {
    console.error('Create review error:', error);
    res.status(500).json({ error: 'Failed to submit review' });
  }
});

export default router;
