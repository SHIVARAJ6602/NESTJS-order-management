import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrderproductsService } from './orderproducts.service';
import { CreateOrderproductDto } from './dto/create-orderproduct.dto';
import { UpdateOrderproductDto } from './dto/update-orderproduct.dto';

@Controller('orderproducts')
export class OrderproductsController {
  constructor(private readonly orderproductsService: OrderproductsService) {}
  /*
  @Post()
  create(@Body() createOrderproductDto: CreateOrderproductDto) {
    return this.orderproductsService.create(createOrderproductDto);
  }

  @Get()
  findAll() {
    return this.orderproductsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderproductsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderproductDto: UpdateOrderproductDto) {
    return this.orderproductsService.update(+id, updateOrderproductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderproductsService.remove(+id);
  }
  */
}
