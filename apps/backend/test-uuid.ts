import { PrismaClient } from '@rigstore/database';
const prisma = new PrismaClient();

async function main() {
  const order = await prisma.order.findFirst({
    where: { id: { startsWith: '123' } }
  });
  console.log('Worked!');
}
main().catch(console.error);
