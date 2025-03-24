import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity'; 
import { ProductsModule } from 'src/products/products.module';
import { Product } from 'src/products/entities/product.entity';
import { OrderProduct } from 'src/orderproducts/entities/orderproduct.entity';
import { OrderproductsModule } from 'src/orderproducts/orderproducts.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Product,OrderProduct]), 
    ProductsModule,OrderproductsModule,
  ],
  providers: [OrdersService],
  controllers: [OrdersController], 
})
export class OrdersModule {}
