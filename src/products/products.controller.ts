import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Product } from './entities/product.entity';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' }) // Document the operation
  @ApiResponse({ status: 201, description: 'Product created successfully', type: Product }) // Document response
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products' }) // Document the operation
  @ApiResponse({ status: 200, description: 'Successfully retrieved all products', type: [Product] }) // Document response
  async findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' }) // Document the operation
  @ApiResponse({ status: 200, description: 'Successfully retrieved the product', type: Product }) // Document response
  @ApiResponse({ status: 404, description: 'Product not found' }) // Document response for 404
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product by ID' }) // Document the operation
  @ApiResponse({ status: 200, description: 'Product updated successfully', type: Product }) // Document response
  @ApiResponse({ status: 404, description: 'Product not found' }) // Document response for 404
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product by ID' }) // Document the operation
  @ApiResponse({ status: 200, description: 'Product deleted successfully' }) // Document response
  @ApiResponse({ status: 404, description: 'Product not found' }) // Document response for 404
  async remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
