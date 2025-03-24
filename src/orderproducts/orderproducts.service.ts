import { Injectable } from '@nestjs/common';
import { CreateOrderproductDto } from './dto/create-orderproduct.dto';
import { UpdateOrderproductDto } from './dto/update-orderproduct.dto';

@Injectable()
export class OrderproductsService {
  /*
  create(createOrderproductDto: CreateOrderproductDto) {
    return 'This action adds a new orderproduct';
  }

  findAll() {
    return `This action returns all orderproducts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} orderproduct`;
  }

  update(id: number, updateOrderproductDto: UpdateOrderproductDto) {
    return `This action updates a #${id} orderproduct`;
  }

  remove(id: number) {
    return `This action removes a #${id} orderproduct`;
  }
    */
}
