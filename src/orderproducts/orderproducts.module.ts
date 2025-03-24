import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderProduct } from 'src/orderproducts/entities/orderproduct.entity';
import { OrderproductsService } from './orderproducts.service';
import { OrderproductsController } from './orderproducts.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OrderProduct])],
  controllers: [OrderproductsController],
  providers: [OrderproductsService],
})
export class OrderproductsModule {}
