import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { Product } from 'src/products/entities/product.entity';
import { OrderProduct } from 'src/orderproducts/entities/orderproduct.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { OrderStatus } from 'src/orders/entities/order.entity'; 

describe('OrdersService', () => {
  let service: OrdersService;

  // Mock repositories
  const mockOrdersRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    create: jest.fn(),
  };

  const mockProductsRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockOrderProductRepository = {
    save: jest.fn(),
    create: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(Order),
          useValue: mockOrdersRepository,
        },
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductsRepository,
        },
        {
          provide: getRepositoryToken(OrderProduct),
          useValue: mockOrderProductRepository,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });


  // Test create method
  it('should create a new order', async () => {
    const createOrderDto = {
      customerId: 1,
      shippingAddress: '123 Main St',
      products: [{ productId: 1, quantity: 2 }],
      status: 'pending', // Add the status property
    };
  
    const product = { id: 1, price: 100, quantity: 10, name: 'Test Product' };
    mockProductsRepository.findOne.mockResolvedValue(product);
    mockProductsRepository.save.mockResolvedValue({ ...product, quantity: 8 });
    
    // Mock the order creation process to return a structure that matches the expected save parameters
    mockOrdersRepository.create.mockReturnValue({
      customer: { id: createOrderDto.customerId },  // Ensure customer is an object with id
      shippingAddress: createOrderDto.shippingAddress,
      status: createOrderDto.status,
    });
  
    mockOrdersRepository.save.mockResolvedValue({
      id: 1,
      ...createOrderDto,
      totalPrice: 200,
      customer: { id: createOrderDto.customerId }, // Mock the saved order structure
    });
  
    const result = await service.create(createOrderDto);
  
    // Ensure that findOne was called with the correct parameters
    expect(mockProductsRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  
    // Check if save was called with the expected object structure (matching customer object)
    expect(mockOrdersRepository.save).toHaveBeenCalledWith(expect.objectContaining({
      customer: { id: 1 },  // Ensure that the customer is passed as an object
      shippingAddress: '123 Main St',
      totalPrice: 200,
      status: 'pending',
    }));
  
    expect(result).toHaveProperty('id');  // Ensure result has the 'id' property
  });
  
  

  it('should throw an error if product is not found during order creation', async () => {
    const createOrderDto = {
      customerId: 1,
      shippingAddress: '123 Main St',
      products: [{ productId: 999, quantity: 2 }],
      status: 'pending',
    };

    mockProductsRepository.findOne.mockResolvedValue(null);

    await expect(service.create(createOrderDto)).rejects.toThrow(NotFoundException);
  });

  it('should throw an error if there is insufficient stock', async () => {
    const createOrderDto = {
      customerId: 1,
      shippingAddress: '123 Main St',
      products: [{ productId: 1, quantity: 15 }],
      status: 'pending',
    };

    const product = { id: 1, price: 100, quantity: 10, name: 'Test Product' };
    mockProductsRepository.findOne.mockResolvedValue(product);

    await expect(service.create(createOrderDto)).rejects.toThrow(ConflictException);
  });

  // Test findAll method
  it('should return all orders', async () => {
    const orders = [{ id: 1, status: 'pending', totalPrice: 200 }];
    mockOrdersRepository.find.mockResolvedValue(orders);

    const result = await service.findAll();
    expect(result).toEqual(orders);
    expect(mockOrdersRepository.find).toHaveBeenCalled();
  });

  // Test findOne method
  it('should return a single order by id', async () => {
    const order = { id: 1, status: 'pending', totalPrice: 200 };
    mockOrdersRepository.findOne.mockResolvedValue(order);

    const result = await service.findOne(1);
    expect(result).toEqual(order);
    expect(mockOrdersRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should throw an error if order not found', async () => {
    mockOrdersRepository.findOne.mockResolvedValue(null);

    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  // Test findOrderDetails method
  it('should return order details with products', async () => {
    const mockCreatedAt = new Date();
    
    const order = {
      id: 1,
      status: 'pending',
      totalPrice: 200,
      shippingAddress: '123 Main St',
      products: [
        { product: { id: 1, name: 'Test Product', price: 100 }, quantity: 2 },
      ],
      createdAt: mockCreatedAt, // Mock the createdAt property
    };
  
    mockOrdersRepository.findOne.mockResolvedValue(order);
  
    const result = await service.findOrderDetails(1);
  
    // Mocked createdAt matches expected value
    expect(result).toEqual({
      id: 1,
      shippingAddress: '123 Main St',
      status: 'pending',
      totalPrice: 200,
      products: [
        {
          product: { id: 1, name: 'Test Product', price: 100 },
          quantity: 2,
        },
      ],
      createdAt: mockCreatedAt,  // Compare the mocked createdAt value
    });
  });
  

  it('should throw an error if order details not found', async () => {
    mockOrdersRepository.findOne.mockResolvedValue(null);

    await expect(service.findOrderDetails(999)).rejects.toThrow(NotFoundException);
  });

  // Test update method
  it('should update an existing order', async () => {
    const updateOrderDto = { status: OrderStatus.SHIPPED };  // Use enum value
    const order = { id: 1, status: OrderStatus.PENDING, totalPrice: 200 };
  
    mockOrdersRepository.findOne.mockResolvedValue(order);
    mockOrdersRepository.save.mockResolvedValue({ ...order, ...updateOrderDto });
  
    const result = await service.update(1, updateOrderDto);
  
    expect(result.status).toBe(OrderStatus.SHIPPED);  // Compare with the enum value
    expect(mockOrdersRepository.save).toHaveBeenCalledWith(expect.objectContaining(updateOrderDto));
  });

  it('should throw an error if order to update is not found', async () => {
    const updateOrderDto = { status: OrderStatus.SHIPPED };
    mockOrdersRepository.findOne.mockResolvedValue(null);

    await expect(service.update(999, updateOrderDto)).rejects.toThrow(NotFoundException);
  });

  // Test remove method
  it('should remove an order', async () => {
    const order = { id: 1, status: 'pending', totalPrice: 200, products: [] };
    mockOrdersRepository.findOne.mockResolvedValue(order);
    mockOrdersRepository.remove.mockResolvedValue(undefined);

    await service.remove(1);
    expect(mockOrdersRepository.remove).toHaveBeenCalledWith(order);
  });

  it('should throw an error if order to remove is not found', async () => {
    mockOrdersRepository.findOne.mockResolvedValue(null);

    await expect(service.remove(999)).rejects.toThrow(NotFoundException);
  });
});
