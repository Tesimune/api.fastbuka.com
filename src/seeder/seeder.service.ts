import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcryptjs';
import { Keypair } from '@stellar/stellar-sdk';
import { users } from './data/users.data';
import { vendors } from './data/vendors.data';
import { riders } from './data/riders.data';
import { categories } from './data/categories.data';
import { foods } from './data/foods.data';
import { orders } from './data/orders.data';

@Injectable()
export class SeederService {
  constructor(private readonly databaseService: DatabaseService) {}

  private readonly logger = new Logger(SeederService.name);

  private generateRandomWallet(): { publicKey: string; secret: string } {
    const keypair = Keypair.random();
    return {
      publicKey: keypair.publicKey(),
      secret: keypair.secret(),
    };
  }

  async seed() {
    try {
      await this.seedUsers();
      await this.seedRiders();
      await this.seedVendors();
      await this.seedCategories();
      await this.seedFoods();
      await this.seedOrders();
      this.logger.log('Database seeding completed!');
    } catch (error) {
      this.logger.error('Error seeding database:', error);
    }
  }

  private async seedUsers() {
    return await this.databaseService.$transaction(
      async (prisma) => {
        for (const user of users) {
          const hashedPassword = await bcrypt.hash(user.password, 10);
          const { publicKey, secret } = this.generateRandomWallet();
          const hashedSecret = await bcrypt.hash(secret, 10);
          let username = user.email.split('@')[0];

          const createdUser = await prisma.user.upsert({
            where: { email: user.email },
            update: {
              email: user.email,
              username,
              role: user.role,
              password: hashedPassword,
              walletAddress: publicKey,
              secretKey: hashedSecret,
            },
            create: {
              email: user.email,
              username,
              role: user.role,
              password: hashedPassword,
              walletAddress: publicKey,
              secretKey: hashedSecret,
            },
          });

          const [firstName, lastName] = user.name.split(' ');

          await prisma.userProfile.upsert({
            where: { user_uuid: createdUser.uuid },
            update: {
              user_uuid: createdUser.uuid,
              first_name: firstName,
              last_name: lastName,
            },
            create: {
              user_uuid: createdUser.uuid,
              first_name: firstName,
              last_name: lastName,
            },
          });
        }
        this.logger.log('User seeding completed!');
      },
      {
        timeout: 86400000,
      },
    );
  }

  private async seedRiders() {
    const user = await this.databaseService.user.findFirst({
      where: {
        email: 'rider@fastbuka.com',
      },
    });
    return await this.databaseService.$transaction(
      async (prisma) => {
        for (const rider of riders) {
          await prisma.rider.upsert({
            where: {
              uuid: rider.uuid,
            },
            update: { ...rider, user_uuid: user.uuid },
            create: { ...rider, user_uuid: user.uuid },
          });
        }
        this.logger.log('Riders seeding completed!');
      },
      {
        timeout: 86400000,
      },
    );
  }

  private async seedVendors() {
    const user = await this.databaseService.user.findFirst({
      where: {
        email: 'vendor@fastbuka.com',
      },
    });

    return await this.databaseService.$transaction(
      async (prisma) => {
        for (const vendor of vendors) {
          await prisma.vendor.upsert({
            where: {
              uuid: vendor.uuid,
            },
            update: { ...vendor, user_uuid: user.uuid },
            create: { ...vendor, user_uuid: user.uuid },
          });
        }
        this.logger.log('Vendors seeding completed!');
      },
      {
        timeout: 86400000,
      },
    );
  }

  private async seedCategories() {
    return await this.databaseService.$transaction(
      async (prisma) => {
        for (const category of categories) {
          await prisma.category.upsert({
            where: {
              uuid: category.uuid,
              name: category.name,
            },
            update: { ...category, uuid: category.uuid },
            create: { ...category, uuid: category.uuid },
          });
        }
        this.logger.log('Categories seeding completed!');
      },
      {
        timeout: 86400000,
      },
    );
  }

  private async seedFoods() {
    const vendor = await this.databaseService.vendor.findFirst();
    return await this.databaseService.$transaction(
      async (prisma) => {
        for (const food of foods) {
          await prisma.food.upsert({
            where: {
              uuid: food.uuid,
            },
            update: { ...food, vendor_uuid: vendor.uuid },
            create: { ...food, vendor_uuid: vendor.uuid },
          });
        }
        this.logger.log('Foods seeding completed!');
      },
      {
        timeout: 86400000,
      },
    );
  }

  private async seedOrders() {
    const user = await this.databaseService.user.findFirst({
      where: {
        email: 'user@fastbuka.com',
      },
      include: {
        profile: true,
      },
    });
    let newOrder = null;
    let totalAmount = 0;
    return await this.databaseService.$transaction(async (prisma) => {
      for (const order of orders) {
        const food = await this.databaseService.food.findUnique({
          where: {
            uuid: order.food_uuid,
          },
        });

        totalAmount += food.price * order.quantity;
        newOrder = await this.databaseService.order.findFirst({
          where: {
            vendor_uuid: food.vendor_uuid,
            user_uuid: user.uuid,
            order_status: 'pending',
          },
        });

        if (newOrder) {
          newOrder = await this.databaseService.order.update({
            where: {
              uuid: newOrder.uuid,
            },
            data: {
              total_amount: ++totalAmount,
            },
          });
        } else {
          const orderNumber = `${user.username.slice(0, 2).toUpperCase()}${food.vendor_uuid.slice(0, 2).toUpperCase()}${Math.floor(10000 + Math.random() * 90000)}`;
          newOrder = await this.databaseService.order.create({
            data: {
              user_uuid: user.uuid,
              vendor_uuid: food.vendor_uuid,
              order_number: orderNumber,
              total_amount: totalAmount,
              delivery_name: user.profile.first_name,
              delivery_email: user.email,
              delivery_contact: user.contact,
              delivery_address: user.profile.address,
            },
          });
        }

        await this.databaseService.orderItem.create({
          data: {
            order_uuid: newOrder.uuid,
            food_uuid: food.uuid,
            price: food.price,
            quantity: order.quantity,
          },
        });
      }
      this.logger.log('Orders seeding completed!');
    });
  }
}
