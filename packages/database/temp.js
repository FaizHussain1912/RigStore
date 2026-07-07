const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

prisma.product.findMany({ include: { category: true } })
  .then(ps => {
    // Exclude graphics cards and map to an array of objects
    const nonGpu = ps.filter(p => p.category.name !== 'Graphics Cards');
    const items = nonGpu.map(p => p.name);
    
    // Write chunks to files for the subagents
    const fs = require('fs');
    const chunkSize = Math.ceil(items.length / 3);
    for (let i = 0; i < 3; i++) {
      const chunk = items.slice(i * chunkSize, (i + 1) * chunkSize);
      fs.writeFileSync(`chunk_${i}.json`, JSON.stringify(chunk, null, 2));
    }
    console.log(`Created 3 chunks with ${chunkSize} items each.`);
  })
  .finally(() => prisma.$disconnect());
