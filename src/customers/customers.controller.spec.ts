import { Test, TestingModule } from '@nestjs/testing';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';

describe('CustomersController', () => {
  let controller: CustomersController;
  let customersService: CustomersService;

  // Mock the CustomersService
  const mockCustomersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomersController],
      providers: [
        {
          provide: CustomersService,
          useValue: mockCustomersService, // Use the mocked CustomersService
        },
      ],
    }).compile();

    controller = module.get<CustomersController>(CustomersController);
    customersService = module.get<CustomersService>(CustomersService);
  });

  it('should call CustomersService.create and return customer', async () => {
    const createCustomerDto = { name: 'John Doe', email: 'john.doe@example.com', pswd: 'password123' };
    const mockCustomer = { id: 1, ...createCustomerDto };

    // Mock the create method of CustomersService
    mockCustomersService.create.mockResolvedValue(mockCustomer);

    const result = await controller.create(createCustomerDto);

    expect(result).toEqual(mockCustomer);
    expect(mockCustomersService.create).toHaveBeenCalledWith(createCustomerDto);
  });

  it('should call CustomersService.findAll and return customers', async () => {
    const mockCustomers = [
      { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com' },
    ];

    // Mock the findAll method of CustomersService
    mockCustomersService.findAll.mockResolvedValue(mockCustomers);

    const result = await controller.findAll();

    expect(result).toEqual(mockCustomers);
    expect(mockCustomersService.findAll).toHaveBeenCalled();
  });

  it('should call CustomersService.findOne and return a customer', async () => {
    const mockCustomer = { id: 1, name: 'John Doe', email: 'john.doe@example.com' };

    // Mock the findOne method of CustomersService
    mockCustomersService.findOne.mockResolvedValue(mockCustomer);

    const result = await controller.findOne('1');

    expect(result).toEqual(mockCustomer);
    expect(mockCustomersService.findOne).toHaveBeenCalledWith(1);
  });

  it('should call CustomersService.update and return updated customer', async () => {
    const updateCustomerDto = { name: 'Updated Name' };
    const mockUpdatedCustomer = { id: 1, name: 'Updated Name', email: 'john.doe@example.com' };

    // Mock the update method of CustomersService
    mockCustomersService.update.mockResolvedValue(mockUpdatedCustomer);

    const result = await controller.update('1', updateCustomerDto);

    expect(result).toEqual(mockUpdatedCustomer);
    expect(mockCustomersService.update).toHaveBeenCalledWith(1, updateCustomerDto);
  });

  it('should call CustomersService.remove and return void', async () => {
    // Mock the remove method of CustomersService
    mockCustomersService.remove.mockResolvedValue(undefined);

    const result = await controller.remove('1');

    expect(result).toBeUndefined();
    expect(mockCustomersService.remove).toHaveBeenCalledWith(1);
  });
});
