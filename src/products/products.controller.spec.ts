import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Repository } from 'typeorm';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;
  let mockProductRepository: Partial<Repository<Product>>; // Explicitly type mock repository

  beforeEach(async () => {
    // Mock the product repository methods
    mockProductRepository = {
      save: jest.fn().mockResolvedValue({
        id: 1,
        name: 'Product 1',
        price: 100,
        quantity: 50,
        orders: [],
      }),
      findOne: jest.fn().mockResolvedValue({
        id: 1,
        name: 'Product 1',
        price: 100,
        quantity: 50,
        orders: [],
      }),
    };

    // Create the TestingModule and inject the mocked repository
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product), // Mock the repository token for the Product entity
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Product 1',
        price: 100,
        quantity: 50,
      };

      const result = {
        id: 1,
        ...createProductDto,
        orders: [], // Add a mock orders array
      };

      // Use the mock to simulate the service behavior
      jest.spyOn(service, 'create').mockResolvedValue(result);

      // Call the controller's create method
      expect(await controller.create(createProductDto)).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      const result = { id: 1, name: 'Product 1', price: 100, quantity: 50, orders: [] };
      
      // Simulate findOne method
      (mockProductRepository.findOne as jest.Mock).mockResolvedValue(result);
  
      expect(await controller.findOne('1')).toEqual(result);
    });
  
    it('should throw an error if product not found', async () => {
      // Simulate findOne method returning null
      (mockProductRepository.findOne as jest.Mock).mockResolvedValue(null);
  
      // Expect the error message to include the product ID
      await expect(controller.findOne('999')).rejects.toThrowError('Product #999 not found');
    });
  });
  
});
