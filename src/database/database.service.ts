import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(DatabaseService.name);

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('Connected to the database');
    } catch (error) {
      console.error('Database connection error:', error);
      throw error;
    }
  }
}
