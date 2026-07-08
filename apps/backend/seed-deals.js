const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding PC Deals...');

  // 1. Create or ensure PC Deals Category exists
  const pcDealsCategory = await prisma.category.upsert({
    where: { slug: 'pc-deals' },
    update: {},
    create: {
      name: 'PC Deals',
      slug: 'pc-deals',
    },
  });

  console.log('Category PC Deals ensured. ID:', pcDealsCategory.id);

  // 2. Create the Deal Products
  const deal1 = await prisma.product.upsert({
    where: { sku: 'PC-2-SPX' },
    update: {},
    create: {
      sku: 'PC-2-SPX',
      slug: 'pc-deal-2-ryzen-5',
      name: 'PC Deal 2',
      brand: 'PC STEAL DEAL 2',
      basePrice: 140000,
      description: 'Ryzen 5 3600, GTX 1660TI, 16GB RAM, 256GB SSD, 1TB HDD, 650W PSU',
      imageUrl: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&q=80&w=800',
      categoryId: pcDealsCategory.id,
      specs: {
        Processor: 'AMD Ryzen 5 3600',
        GraphicsCard: 'NVIDIA GTX 1660 Ti',
        RAM: '16GB DDR4 3200MHz',
        Storage: '256GB NVMe SSD + 1TB HDD',
        PowerSupply: '650W 80+ Bronze',
      }
    }
  });

  const deal2 = await prisma.product.upsert({
    where: { sku: 'PC-3-ULTRA' },
    update: {},
    create: {
      sku: 'PC-3-ULTRA',
      slug: 'pc-deal-3-core-i5',
      name: 'PC Deal 3',
      brand: 'PC STEAL DEAL 3',
      basePrice: 185000,
      description: 'Core i5 12400F, RTX 3060, 16GB RAM, 512GB SSD, 650W PSU',
      imageUrl: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=800',
      categoryId: pcDealsCategory.id,
      specs: {
        Processor: 'Intel Core i5-12400F',
        GraphicsCard: 'NVIDIA RTX 3060 12GB',
        RAM: '16GB DDR4 3200MHz',
        Storage: '512GB NVMe Gen4 SSD',
        PowerSupply: '650W 80+ Bronze',
      }
    }
  });

  // Ensure inventory exists for these deals
  await prisma.inventory.upsert({
    where: { productId: deal1.id },
    update: { totalStock: 10 },
    create: { productId: deal1.id, totalStock: 10 }
  });

  await prisma.inventory.upsert({
    where: { productId: deal2.id },
    update: { totalStock: 5 },
    create: { productId: deal2.id, totalStock: 5 }
  });

  console.log('Deals seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
