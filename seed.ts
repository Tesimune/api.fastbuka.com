import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { SeederService } from './src/seeder/seeder.service';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const logger = new Logger('Seeder');
  const seeder = app.get(SeederService);

  try {
    logger.log('Starting database seeding...');
    await seeder.seed();
    logger.log('Seeding completed!');
  } catch (error) {
    logger.error('Seeding failed!', error);
  } finally {
    await app.close();
  }
}

bootstrap();
