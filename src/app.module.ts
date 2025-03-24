import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersModule } from './orders/orders.module';
import { CustomersModule } from './customers/customers.module';
import { ProductsModule } from './products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';  // Import TypeOrmModule
import { Customer } from './customers/entities/customer.entity';
import { Order } from './orders/entities/order.entity';
import { Product } from './products/entities/product.entity';
import { OrderproductsModule } from './orderproducts/orderproducts.module';
import { OrderProduct } from './orderproducts/entities/orderproduct.entity';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      //host: 'localhost',
      host: 'host.docker.internal',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'order-management',
      entities: [Customer, Order, OrderProduct, Product],
      synchronize: true,
    }),
    OrdersModule,
    CustomersModule,
    ProductsModule,
    OrderproductsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,  // Apply JwtAuthGuard globally
    },
    AppService
  ],
})
export class AppModule {}
