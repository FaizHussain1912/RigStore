import express from 'express';
import { PrismaClient } from '@rigstore/database';
import { requireAuth, AuthRequest } from '../middleware/auth';
import crypto from 'crypto';

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/builder/save - Save or share a PC build
router.post('/save', async (req, res) => {
  try {
    const { title, components, totalPrice, totalWatts, userId } = req.body;

    if (!components || typeof components !== 'object') {
      return res.status(400).json({ error: 'Components are required' });
    }

    const shareId = crypto.randomBytes(4).toString('hex'); // 8-char short code

    const savedBuild = await prisma.savedBuild.create({
      data: {
        shareId,
        title: title || 'Custom PC Build',
        userId: userId || null,
        components,
        totalPrice: parseFloat(totalPrice) || 0,
        totalWatts: parseInt(totalWatts) || 0
      }
    });

    res.status(201).json(savedBuild);
  } catch (error: any) {
    console.error('Save build error:', error);
    res.status(500).json({ error: 'Failed to save build' });
  }
});

// GET /api/builder/share/:shareId - Get build by share code
router.get('/share/:shareId', async (req, res) => {
  try {
    const { shareId } = req.params;
    const build = await prisma.savedBuild.findUnique({
      where: { shareId },
      include: {
        user: { select: { name: true } }
      }
    });

    if (!build) {
      return res.status(404).json({ error: 'Build not found' });
    }

    res.json(build);
  } catch (error: any) {
    console.error('Get shared build error:', error);
    res.status(500).json({ error: 'Failed to load build' });
  }
});

// GET /api/builder/my-builds - Get user's saved builds
router.get('/my-builds', requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.userId;
    const builds = await prisma.savedBuild.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    res.json(builds);
  } catch (error: any) {
    console.error('Get my builds error:', error);
    res.status(500).json({ error: 'Failed to fetch saved builds' });
  }
});

// DELETE /api/builder/:id - Delete a saved build
router.delete('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const build = await prisma.savedBuild.findUnique({ where: { id } });
    if (!build) return res.status(404).json({ error: 'Build not found' });

    if (build.userId !== userId && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await prisma.savedBuild.delete({ where: { id } });
    res.json({ success: true, message: 'Build removed' });
  } catch (error: any) {
    console.error('Delete build error:', error);
    res.status(500).json({ error: 'Failed to delete build' });
  }
});

export default router;
