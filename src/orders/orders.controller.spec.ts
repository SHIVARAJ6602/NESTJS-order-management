import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: OrdersService;
  
  // Mock the OrdersService methods
  const mockOrdersService = {
    create: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    findOrderDetails: jest.fn(),
    findByStatus: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: mockOrdersService, // Mock the OrdersService
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new order', async () => {
      const createOrderDto: CreateOrderDto = {
        customerId: 1,
        shippingAddress: '123 Main St',
        status: 'pending',
        products: [], // Assuming products are handled elsewhere
      };

      const result = {
        id: 1,
        ...createOrderDto,
        createdAt: new Date(),
      };

      // Mock the create method in OrdersService
      mockOrdersService.create.mockResolvedValue(result);

      // Call the controller's create method
      expect(await controller.create(createOrderDto)).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return an order by id', async () => {
      const result = {
        id: 1,
        customerId: 1,
        shippingAddress: '123 Main St',
        totalPrice: 150,
        status: 'pending',
        createdAt: new Date(),
        products: [],
      };
  
      // Mock the findOne method in OrdersService
      mockOrdersService.findOne.mockResolvedValue(result);
  
      // Call the controller's findOne method
      expect(await controller.findOne('1')).toEqual(result);
    });
    /*
    it('should throw an error if order not found', async () => {
      // Mock the findOne method in OrdersService to return null
      mockOrdersService.findOne.mockResolvedValue(result);
  
      // Expect an error to be thrown
      await expect(controller.findOne('999')).rejects.toThrowError(
        new NotFoundException('Order with id 999 not found'),
      );
    });
    */
  });  
});
