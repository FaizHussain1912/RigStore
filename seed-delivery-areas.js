const { PrismaClient } = require('@rigstore/database');
const prisma = new PrismaClient();

async function seedDeliveryAreas() {
  const deliveryAreas = [
    {
      city: 'Karachi',
      areas: [
        'North Nazimabad',
        'Clifton',
        'Malir',
        'DHA',
        'Shah Faisal Colony',
        'PECHS',
        'Gulshan-e-Iqbal',
        'Model Colony',
        'Saddar',
        'FB Area',
        'Tariq Road',
        'Gulistan-e-Johar',
        'Landhi',
        'Korangi',
        'Nazimabad',
        'OTHER'
      ]
    },
    {
      city: 'Lahore',
      areas: []
    },
    {
      city: 'Islamabad',
      areas: []
    },
    {
      city: 'Rawalpindi',
      areas: []
    }
  ];

  await prisma.storeSetting.upsert({
    where: { key: 'DELIVERY_AREAS_SETTINGS' },
    update: { value: deliveryAreas },
    create: { key: 'DELIVERY_AREAS_SETTINGS', value: deliveryAreas }
  });

  console.log('Delivery areas seeded successfully.');
}

seedDeliveryAreas()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
