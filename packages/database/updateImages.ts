import { PrismaClient } from '@prisma/client';
import google from 'googlethis';

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    include: { category: true }
  });

  console.log(`Updating images for ${products.length} products...`);

  for (const product of products) {
    try {
      const query = `site:amazon.com ${product.name}`;
      const images = await google.image(query, { safe: false });
      
      if (images && images.length > 0) {
        // Use the actual high-res URL instead of the blurry preview thumbnail
        const imageUrl = images[0].url;
        
        await prisma.product.update({
          where: { id: product.id },
          data: { imageUrl }
        });
        console.log(`✅ Updated ${product.name} -> ${imageUrl.substring(0, 50)}...`);
      } else {
        console.log(`❌ No images found for ${product.name}`);
      }
    } catch (e: any) {
      console.log(`❌ Error searching for ${product.name}:`, e.message);
    }
    
    // Tiny delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 500));
  }

  console.log('Finished updating all product images!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
