import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('ProductsService', () => {
  let service: ProductsService;

  // Mock Product repository
  const mockProductRepository = {
    find: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });


  // Test for the create method
  it('should call save method of Product repository', async () => {
    const createProductDto = { name: 'Test Product', price: 100, quantity: 10 };
    
    const product = new Product();
    product.name = createProductDto.name;
    product.price = createProductDto.price;
    product.quantity = createProductDto.quantity;

    mockProductRepository.save.mockResolvedValue({ ...product, id: 1 });

    await service.create(createProductDto);

    expect(mockProductRepository.save).toHaveBeenCalledWith(expect.objectContaining({
      name: createProductDto.name,
      price: createProductDto.price,
      quantity: createProductDto.quantity,
    }));
  });

  // Test for findAll method
  it('should call find method of Product repository', async () => {
    const products = [
      { id: 1, name: 'Test Product 1', price: 100, quantity: 10 },
      { id: 2, name: 'Test Product 2', price: 200, quantity: 5 },
    ];
    
    mockProductRepository.find.mockResolvedValue(products);

    const result = await service.findAll();
    expect(result).toEqual(products);
    expect(mockProductRepository.find).toHaveBeenCalled();
  });

  // Test for findOne method with existing product
  it('should return product when findOne is called with existing id', async () => {
    const product = { id: 1, name: 'Test Product', price: 100, quantity: 10 };
    
    mockProductRepository.findOne.mockResolvedValue(product);

    const result = await service.findOne(1);
    expect(result).toEqual(product);
    expect(mockProductRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  // Test for findOne method with non-existing product
  it('should throw NotFoundException when product not found', async () => {
    mockProductRepository.findOne.mockResolvedValue(null);

    try {
      await service.findOne(999);
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
      expect(e.message).toBe('Product #999 not found');
    }
  });

  // Test for update method with existing product
  it('should update the product when valid data is provided', async () => {
    const existingProduct = { id: 1, name: 'Old Product', price: 100, quantity: 10 };
    const updateProductDto = { name: 'Updated Product', price: 120, quantity: 15 };

    mockProductRepository.findOne.mockResolvedValue(existingProduct);
    mockProductRepository.save.mockResolvedValue({ ...existingProduct, ...updateProductDto });

    const result = await service.update(1, updateProductDto);

    expect(result.name).toBe(updateProductDto.name);
    expect(result.price).toBe(updateProductDto.price);
    expect(result.quantity).toBe(updateProductDto.quantity);
    expect(mockProductRepository.save).toHaveBeenCalledWith(expect.objectContaining(updateProductDto));
  });

  // Test for update method with non-existing product
  it('should throw NotFoundException when updating non-existing product', async () => {
    const updateProductDto = { name: 'Updated Product', price: 120, quantity: 15 };

    mockProductRepository.findOne.mockResolvedValue(null);

    try {
      await service.update(999, updateProductDto);
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
      expect(e.message).toBe('Product #999 not found');
    }
  });

  // Test for remove method with existing product
  it('should remove product when valid id is provided', async () => {
    const product = { id: 1, name: 'Test Product', price: 100, quantity: 10 };

    mockProductRepository.findOne.mockResolvedValue(product);
    mockProductRepository.remove.mockResolvedValue(true);

    const result = await service.remove(1);

    expect(result).toBe(true);
    expect(mockProductRepository.remove).toHaveBeenCalledWith(product);
  });

  // Test for remove method with non-existing product
  it('should throw NotFoundException when product to remove is not found', async () => {
    mockProductRepository.findOne.mockResolvedValue(null);

    try {
      await service.remove(999);
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
      expect(e.message).toBe('Product #999 not found');
    }
  });
});
