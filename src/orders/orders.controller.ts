import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Order } from './entities/order.entity';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' }) // Document the operation
  @ApiResponse({ status: 201, description: 'Order created successfully', type: Order }) // Document response
  async create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order details by ID' }) // Document the operation
  @ApiResponse({ status: 200, description: 'Successfully retrieved the order details', type: Order }) // Document response
  @ApiResponse({ status: 404, description: 'Order not found' }) // Document response for 404
  async findOrderDetails(@Param('id') id: number) {
    return this.ordersService.findOrderDetails(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders' }) // Document the operation
  @ApiResponse({ status: 200, description: 'Successfully retrieved all orders', type: [Order] }) // Document response
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' }) // Document the operation
  @ApiResponse({ status: 200, description: 'Successfully retrieved the order', type: Order }) // Document response
  @ApiResponse({ status: 404, description: 'Order not found' }) // Document response for 404
  async findOne(@Param('id') id: string) {
    const order = await this.ordersService.findOne(+id);
    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }
    return order;
  }

  @Get(':id/:status')
  @ApiOperation({ summary: 'Get orders by status and ID' }) // Document the operation
  @ApiResponse({ status: 200, description: 'Successfully retrieved orders by status', type: [Order] }) // Document response
  findByStatus(@Param('id') id: number, @Param('status') status: string) {
    return this.ordersService.findByStatus(+id, status);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an order by ID' }) // Document the operation
  @ApiResponse({ status: 200, description: 'Order updated successfully', type: Order }) // Document response
  @ApiResponse({ status: 404, description: 'Order not found' }) // Document response for 404
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an order by ID' }) // Document the operation
  @ApiResponse({ status: 200, description: 'Order deleted successfully' }) // Document response
  @ApiResponse({ status: 404, description: 'Order not found' }) // Document response for 404
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
