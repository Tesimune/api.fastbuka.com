import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
  // async onModuleInit() {
  //   await this.$connect();
  // }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('Connected to the database');
      // console.log('Connecting to database at:', process.env.DATABASE_URL);
    } catch (error) {
      console.error('Database connection error:', error);
      throw error;
    }
  }
}
