import express from 'express';
import { PrismaClient } from '@rigstore/database';

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/coupons/validate - Validate a coupon code and return discount
router.post('/validate', async (req, res) => {
  try {
    const { code, orderAmount } = req.body;
    if (!code) {
      return res.status(400).json({ error: 'Coupon code is required' });
    }

    const cleanCode = String(code).trim().toUpperCase();

    // Find coupon
    let coupon = await prisma.coupon.findUnique({
      where: { code: cleanCode }
    });

    // Auto-seed default promo codes if none exist
    if (!coupon && (cleanCode === 'RIG10' || cleanCode === 'WELCOME500')) {
      if (cleanCode === 'RIG10') {
        coupon = await prisma.coupon.create({
          data: {
            code: 'RIG10',
            discountType: 'PERCENTAGE',
            discountValue: 10,
            minOrderAmount: 1000,
            maxDiscount: 10000,
            isActive: true
          }
        });
      } else if (cleanCode === 'WELCOME500') {
        coupon = await prisma.coupon.create({
          data: {
            code: 'WELCOME500',
            discountType: 'FIXED',
            discountValue: 500,
            minOrderAmount: 5000,
            isActive: true
          }
        });
      }
    }

    if (!coupon) {
      return res.status(404).json({ error: 'Invalid coupon code' });
    }

    if (!coupon.isActive) {
      return res.status(400).json({ error: 'This coupon is no longer active' });
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return res.status(400).json({ error: 'This coupon has expired' });
    }

    const subtotal = parseFloat(orderAmount) || 0;
    if (subtotal < coupon.minOrderAmount) {
      return res.status(400).json({ 
        error: `Minimum order amount of Rs ${coupon.minOrderAmount.toLocaleString()} required for this coupon` 
      });
    }

    let discount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      discount = (subtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }

    discount = Math.min(discount, subtotal);

    res.json({
      valid: true,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount: Math.round(discount),
      message: `Coupon '${coupon.code}' applied successfully!`
    });
  } catch (error: any) {
    console.error('Validate coupon error:', error);
    res.status(500).json({ error: 'Failed to validate coupon' });
  }
});

export default router;
