import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcryptjs';
import { Keypair } from '@stellar/stellar-sdk';
import { users } from './data/users.data';
import { vendors } from './data/vendor.data';
import { categories } from './data/categories.data';
import { foods } from './data/foods.data';

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
      this.logger.log('User seeding completed!');
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
          const username = user.email.split('@')[0];

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

          if (createdUser.role == 'vendor') {
            // await this.seedVendors(createdUser.uuid);
            this.logger.log('Vendor seeding completed!');
          }
        }
      },
      {
        timeout: 86400000,
      },
    );
  }

  private async seedVendors(userUuid?) {
    return await this.databaseService.$transaction(
      async (prisma) => {
        for (const vendor of vendors) {
          const createVendor = await prisma.vendor.upsert({
            where: {
              uuid: vendor.uuid,
            },
            update: { ...vendor, user_uuid: userUuid },
            create: { ...vendor, user_uuid: userUuid },
          });
          await this.seedCategories(createVendor.uuid);
          this.logger.log('Category seeding completed!');
        }
      },
      {
        timeout: 86400000,
      },
    );
  }

  private async seedCategories(vendorUuid?) {
    return await this.databaseService.$transaction(
      async (prisma) => {
        for (const category of categories) {
          await prisma.category.upsert({
            where: {
              uuid: category.uuid,
              name: category.name,
            },
            update: { ...category, vendor_uuid: vendorUuid },
            create: { ...category, vendor_uuid: vendorUuid },
          });
          await this.seedFoods(vendorUuid);
          this.logger.log('Food seeding completed!');
        }
      },
      {
        timeout: 86400000,
      },
    );
  }

  private async seedFoods(vendorUuid?) {
    return await this.databaseService.$transaction(
      async (prisma) => {
        for (const food of foods) {
          await prisma.food.upsert({
            where: {
              uuid: food.uuid,
            },
            update: { ...food, vendor_uuid: vendorUuid },
            create: { ...food, vendor_uuid: vendorUuid },
          });
        }
      },
      {
        timeout: 86400000,
      },
    );
  }
}
