import express from 'express';
import { PrismaClient } from '@rigstore/database';
import { requireAuth, requireAdmin } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/contact - Submit a contact message
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    const contactMsg = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject: subject || 'General Inquiry',
        message
      }
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been received. Our team will get back to you shortly.',
      id: contactMsg.id
    });
  } catch (error: any) {
    console.error('Contact submit error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// GET /api/contact - Admin view all messages
router.get('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(messages);
  } catch (error: any) {
    console.error('Fetch contact messages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

export default router;
