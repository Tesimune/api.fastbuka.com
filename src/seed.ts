import { PrismaClient } from '@prisma/client';
import { FoodData } from './food/food.data';

const prisma = new PrismaClient();

async function seed() {
  try {
    for (const food of FoodData) {
      const category = await prisma.category.findUnique({
        where: { uuid: food.category },
      });

      if (!category) {
        console.error(
          `Category "${food.category}" not found for food item: "${food.name}". Skipping this entry.`,
        );
        continue;
      }

      const vendor = await prisma.vendor.findUnique({
        where: { uuid: food.vendor_uuid },
      });

      if (!vendor) {
        console.error(
          `Vendor "${food.vendor_uuid}" not found for food item: "${food.name}". Skipping this entry.`,
        );
        continue;
      }

      await prisma.food.create({
        data: {
          name: food.name,
          description: food.description,
          price: food.price,
          image: food.imageUrl,
          vendor: {
            connect: { uuid: vendor.uuid },
          },
          category: {
            connect: { uuid: category.uuid },
          },
          discount: 0,
          processing_time: '30 mins',
          ready_made: false,
        },
      });
    }
    console.log('Database seeded successfully.');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
