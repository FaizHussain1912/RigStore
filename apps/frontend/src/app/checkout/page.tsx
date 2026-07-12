import { PrismaClient } from '@rigstore/database';
import CheckoutClient from './CheckoutClient';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export default async function CheckoutPage() {
  const settings = await prisma.storeSetting.findUnique({
    where: { key: 'GENERAL_SETTINGS' }
  });
  
  let shippingRate = 0;
  if (settings && settings.value) {
    const val = settings.value as Record<string, any>;
    shippingRate = val.shippingRate ? parseInt(val.shippingRate) : 0;
  }

  return <CheckoutClient shippingRate={shippingRate} />;
}
