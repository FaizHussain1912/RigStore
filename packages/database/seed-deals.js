const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // First, ensure the pc-deals category exists
  let category = await prisma.category.findUnique({ where: { slug: 'pc-deals' } });
  if (!category) {
    category = await prisma.category.create({
      data: {
        name: 'PC Deals',
        slug: 'pc-deals',
        description: 'Exclusive pre-built PC deals at unbeatable prices.',
        imageUrl: '/images/deals-banner.jpg',
        isActive: true
      }
    });
    console.log('Created PC Deals category');
  }

  const deals = [
    {
      name: 'Budget Gamer v1',
      slug: 'pc-deal-budget-v1',
      sku: 'DEAL-BUDGET-01',
      basePrice: 499.99,
      brand: 'RigStore',
      imageUrl: '/images/case.png',
      categoryId: category.id,
      specs: { CPU: 'Intel Core i3 12100F', GPU: 'GTX 1650 4GB', RAM: '8GB DDR4', Storage: '500GB NVMe SSD' },
      compatibility: { socket: 'LGA1700' }
    },
    {
      name: 'Budget Gamer Pro',
      slug: 'pc-deal-budget-pro',
      sku: 'DEAL-BUDGET-02',
      basePrice: 599.99,
      brand: 'RigStore',
      imageUrl: '/images/case.png',
      categoryId: category.id,
      specs: { CPU: 'Intel Core i5 12400F', GPU: 'RX 6500 XT', RAM: '16GB DDR4', Storage: '500GB NVMe SSD' },
      compatibility: { socket: 'LGA1700' }
    },
    {
      name: 'Entry Level Esports',
      slug: 'pc-deal-esports-1',
      sku: 'DEAL-ESPORTS-01',
      basePrice: 699.99,
      brand: 'RigStore',
      imageUrl: '/images/case.png',
      categoryId: category.id,
      specs: { CPU: 'Ryzen 5 5600', GPU: 'RTX 3050 8GB', RAM: '16GB DDR4', Storage: '1TB NVMe SSD' },
      compatibility: { socket: 'AM4' }
    },
    {
      name: 'Mid-Range Master',
      slug: 'pc-deal-mid-1',
      sku: 'DEAL-MID-01',
      basePrice: 899.99,
      brand: 'RigStore',
      imageUrl: '/images/case.png',
      categoryId: category.id,
      specs: { CPU: 'Intel Core i5 13400F', GPU: 'RTX 4060 8GB', RAM: '16GB DDR5', Storage: '1TB NVMe SSD' },
      compatibility: { socket: 'LGA1700' }
    },
    {
      name: '1440p Sweet Spot',
      slug: 'pc-deal-sweet-1440p',
      sku: 'DEAL-1440-01',
      basePrice: 1199.99,
      brand: 'RigStore',
      imageUrl: '/images/case.png',
      categoryId: category.id,
      specs: { CPU: 'Ryzen 5 7600X', GPU: 'RX 7700 XT 12GB', RAM: '32GB DDR5', Storage: '1TB Gen4 NVMe SSD' },
      compatibility: { socket: 'AM5' }
    },
    {
      name: 'High-End Creator Rig',
      slug: 'pc-deal-creator',
      sku: 'DEAL-CREATOR-01',
      basePrice: 1499.99,
      brand: 'RigStore',
      imageUrl: '/images/case.png',
      categoryId: category.id,
      specs: { CPU: 'Intel Core i7 13700K', GPU: 'RTX 4070 12GB', RAM: '32GB DDR5', Storage: '2TB Gen4 NVMe SSD' },
      compatibility: { socket: 'LGA1700' }
    },
    {
      name: '4K Ultra Beast',
      slug: 'pc-deal-ultra-4k',
      sku: 'DEAL-ULTRA-01',
      basePrice: 1899.99,
      brand: 'RigStore',
      imageUrl: '/images/case.png',
      categoryId: category.id,
      specs: { CPU: 'Ryzen 7 7800X3D', GPU: 'RX 7900 XT 20GB', RAM: '32GB DDR5', Storage: '2TB Gen4 NVMe SSD' },
      compatibility: { socket: 'AM5' }
    },
    {
      name: 'Enthusiast Dream',
      slug: 'pc-deal-dream',
      sku: 'DEAL-DREAM-01',
      basePrice: 2499.99,
      brand: 'RigStore',
      imageUrl: '/images/case.png',
      categoryId: category.id,
      specs: { CPU: 'Intel Core i9 14900K', GPU: 'RTX 4080 Super 16GB', RAM: '64GB DDR5', Storage: '4TB Gen4 NVMe SSD' },
      compatibility: { socket: 'LGA1700' }
    },
    {
      name: 'The Ultimate Titan',
      slug: 'pc-deal-titan',
      sku: 'DEAL-TITAN-01',
      basePrice: 3499.99,
      brand: 'RigStore',
      imageUrl: '/images/case.png',
      categoryId: category.id,
      specs: { CPU: 'Ryzen 9 7950X3D', GPU: 'RTX 4090 24GB', RAM: '64GB DDR5', Storage: '4TB Gen4 NVMe SSD' },
      compatibility: { socket: 'AM5' }
    },
    {
      name: 'Streamer Edition Pro',
      slug: 'pc-deal-streamer',
      sku: 'DEAL-STREAMER-01',
      basePrice: 1299.99,
      brand: 'RigStore',
      imageUrl: '/images/case.png',
      categoryId: category.id,
      specs: { CPU: 'Intel Core i5 14600K', GPU: 'RTX 4060 Ti 16GB', RAM: '32GB DDR5', Storage: '2TB NVMe SSD' },
      compatibility: { socket: 'LGA1700' }
    }
  ];

  for (const deal of deals) {
    const exists = await prisma.product.findUnique({ where: { slug: deal.slug } });
    if (!exists) {
      const created = await prisma.product.create({ data: deal });
      
      // Add inventory record
      await prisma.inventory.create({
        data: {
          productId: created.id,
          totalStock: 10,
          lockedStock: 0,
          salesVelocity7Days: 0,
          salesVelocity30Days: 0,
          lastRestockedAt: new Date()
        }
      });
      console.log(`Created deal: ${deal.name}`);
    } else {
      console.log(`Deal already exists: ${deal.name}`);
    }
  }

  console.log('Seed completed.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
