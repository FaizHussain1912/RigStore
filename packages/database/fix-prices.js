const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fix() {
  await prisma.product.update({ where: { slug: 'pc-deal-budget-v1' }, data: { basePrice: 140000 } });
  await prisma.product.update({ where: { slug: 'pc-deal-budget-pro' }, data: { basePrice: 168000 } });
  await prisma.product.update({ where: { slug: 'pc-deal-esports-1' }, data: { basePrice: 196000 } });
  await prisma.product.update({ where: { slug: 'pc-deal-mid-1' }, data: { basePrice: 252000 } });
  await prisma.product.update({ where: { slug: 'pc-deal-sweet-1440p' }, data: { basePrice: 336000 } });
  await prisma.product.update({ where: { slug: 'pc-deal-creator' }, data: { basePrice: 420000 } });
  await prisma.product.update({ where: { slug: 'pc-deal-ultra-4k' }, data: { basePrice: 532000 } });
  await prisma.product.update({ where: { slug: 'pc-deal-dream' }, data: { basePrice: 700000 } });
  await prisma.product.update({ where: { slug: 'pc-deal-titan' }, data: { basePrice: 980000 } });
  await prisma.product.update({ where: { slug: 'pc-deal-streamer' }, data: { basePrice: 364000 } });
  console.log('Prices fixed!');
}

fix().finally(() => prisma.$disconnect());
