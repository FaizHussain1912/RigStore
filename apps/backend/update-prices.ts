import { PrismaClient } from '@rigstore/database';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting price update script (85% of base price)...');

  // 1. Update all products
  const products = await prisma.product.findMany();
  for (const product of products) {
    if (product.originalPrice === 0) { // Only update if not already set or 0
      const newOriginalPrice = product.basePrice * 0.85;
      await prisma.product.update({
        where: { id: product.id },
        data: { originalPrice: newOriginalPrice }
      });
    }
  }
  console.log(`Updated original prices for ${products.length} products.`);

  // 2. Update all order items
  const orderItems = await prisma.orderItem.findMany();
  for (const item of orderItems) {
    if (item.originalPriceAtSale === 0) {
      const newOriginalPriceAtSale = item.priceAtSale * 0.85;
      await prisma.orderItem.update({
        where: { id: item.id },
        data: { originalPriceAtSale: newOriginalPriceAtSale }
      });
    }
  }
  console.log(`Updated original prices for ${orderItems.length} order items.`);

  console.log('Finished updating prices!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
