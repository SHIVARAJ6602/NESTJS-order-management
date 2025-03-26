import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { SkipAuth } from '../auth/skip-auth.decorator';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Customer } from './entities/customer.entity';

@ApiTags('customers')
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @SkipAuth()
  @ApiOperation({ summary: 'Create a new customer' }) // Document the operation
  @ApiResponse({ status: 201, description: 'Customer created successfully', type: Customer }) // Document response
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all customers' }) // Document the operation
  @ApiResponse({ status: 200, description: 'Successfully retrieved all customers', type: [Customer] }) // Document response
  async findAll() {
    return this.customersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a customer by ID' }) // Document the operation
  @ApiResponse({ status: 200, description: 'Successfully retrieved the customer', type: Customer }) // Document response
  @ApiResponse({ status: 404, description: 'Customer not found' }) // Document response for 404
  async findOne(@Param('id') id: string) {
    return this.customersService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a customer by ID' }) // Document the operation
  @ApiResponse({ status: 200, description: 'Customer updated successfully', type: Customer }) // Document response
  @ApiResponse({ status: 404, description: 'Customer not found' }) // Document response for 404
  async update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customersService.update(+id, updateCustomerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a customer by ID' }) // Document the operation
  @ApiResponse({ status: 200, description: 'Customer deleted successfully' }) // Document response
  @ApiResponse({ status: 404, description: 'Customer not found' }) // Document response for 404
  async remove(@Param('id') id: string) {
    return this.customersService.remove(+id);
  }
}
