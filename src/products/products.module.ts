import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';  // Import TypeOrmModule
import { Product } from './entities/product.entity';  // Import the Product entity
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],  // Register Product entity with TypeORM
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}


