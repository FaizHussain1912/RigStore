const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function chk() {
  const p = await prisma.product.findUnique({ where: { slug: 'pc-deal-budget-v1' } });
  console.log(p.basePrice);
}

chk().finally(() => prisma.$disconnect());
