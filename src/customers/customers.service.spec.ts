import { Test, TestingModule } from '@nestjs/testing';
import { CustomersService } from './customers.service';
import { Customer } from './entities/customer.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm'; 
import { NotFoundException, ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('CustomersService', () => {
  let service: CustomersService;
  let customerRepository: Repository<Customer>;

  // Mock the TypeORM repository for Customer
  const mockCustomerRepository = {
    find: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        {
          provide: getRepositoryToken(Customer),
          useValue: mockCustomerRepository,  // Use the mocked repository
        },
      ],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
    customerRepository = module.get<Repository<Customer>>(getRepositoryToken(Customer));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new customer and return the customer', async () => {
    const createCustomerDto = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      pswd: 'plaintextpassword',  // The plain password before hashing
    };

    // The password will be hashed in the service method, so we mock that behavior.
    const hashedPassword = await bcrypt.hash(createCustomerDto.pswd, 10);

    // Create a mock customer object that would be returned after saving
    const mockCustomer = {
      id: 1,
      name: createCustomerDto.name,
      email: createCustomerDto.email,
      pswd: hashedPassword,  // Mock hashed password
      orders: undefined,  // Assuming orders would be set after saving
    };

    // Mock the save method to return the mock customer with an id
    mockCustomerRepository.save.mockResolvedValue(mockCustomer);

    // Call the service's create method
    const result = await service.create(createCustomerDto);

    // Check that the save method was called with an object containing the expected customer data
    expect(mockCustomerRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        name: createCustomerDto.name,
        email: createCustomerDto.email,
        pswd: expect.any(String), // Checking that the password is hashed (any string for now)
      }),
    );

    // Check if the result matches the expected customer
    expect(result).toEqual(mockCustomer);
  });

  // Test for `findByCredentials` method (valid credentials)
  it('should find customer by credentials and return the customer', async () => {
    const mockCustomer = { 
      id: 1, 
      name: 'John Doe', 
      pswd: 'hashedpassword',
      checkPassword: jest.fn().mockResolvedValue(true), // Mock checkPassword method
    };
    const pswd = 'hashedpassword';
  
    mockCustomerRepository.findOne.mockResolvedValue(mockCustomer);
    const result = await service.findByCredentials(1, pswd);
  
    expect(result).toEqual(mockCustomer);
    expect(mockCustomerRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(mockCustomer.checkPassword).toHaveBeenCalledWith(pswd);  // Check if checkPassword was called with the correct password
  });
  

  // Test for `findByCredentials` method (invalid credentials)
  it('should throw UnauthorizedException if credentials are invalid', async () => {
    const pswd = 'wrongpassword';
  
    // Mock the customer object to include the checkPassword method
    const mockCustomer = {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      pswd: 'hashedpassword',
      checkPassword: jest.fn().mockResolvedValue(false),  // Simulate failed password check
    };
  
    // Mock the repository to return the mock customer
    mockCustomerRepository.findOne.mockResolvedValue(mockCustomer);
  
    // Ensure that the UnauthorizedException is thrown if the credentials are invalid
    await expect(service.findByCredentials(1, pswd)).rejects.toThrowError(UnauthorizedException);
  });
  

  // Test for `findAll` method (empty array)
  it('should throw NotFoundException if no customers are found', async () => {
    mockCustomerRepository.find.mockResolvedValue([]);

    await expect(service.findAll()).rejects.toThrow(NotFoundException);
    await expect(service.findAll()).rejects.toThrow('No customers found');
  });

  // Test for `findAll` method with data
  it('should return all customers', async () => {
    const mockCustomers = [{ id: 1, name: 'John Doe' }];
    mockCustomerRepository.find.mockResolvedValue(mockCustomers);

    const result = await service.findAll();

    expect(result).toEqual(mockCustomers);
    expect(mockCustomerRepository.find).toHaveBeenCalled();
  });

  // Test for `findOne` method (customer exists)
  it('should return a customer when found by id', async () => {
    const mockCustomer = { id: 1, name: 'John Doe' };
    mockCustomerRepository.findOne.mockResolvedValue(mockCustomer);

    const result = await service.findOne(1);

    expect(result).toEqual(mockCustomer);
    expect(mockCustomerRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  // Test for `findOne` method (customer not found)
  it('should throw NotFoundException when customer is not found', async () => {
    mockCustomerRepository.findOne.mockResolvedValue(null);

    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    await expect(service.findOne(999)).rejects.toThrow('Customer with id 999 not found');
  });

  // Test for `update` method (valid update)
  it('should update a customer and return the updated customer', async () => {
    const updateCustomerDto = { name: 'John Updated', email: 'john.updated@example.com' };
    const mockCustomer = { id: 1, name: 'John Doe', email: 'john.doe@example.com' };
    const updatedCustomer = { id: 1, ...updateCustomerDto };

    mockCustomerRepository.findOne.mockResolvedValue(mockCustomer);
    mockCustomerRepository.save.mockResolvedValue(updatedCustomer);

    const result = await service.update(1, updateCustomerDto);

    expect(result).toEqual(updatedCustomer);
    expect(mockCustomerRepository.save).toHaveBeenCalledWith(expect.objectContaining(updatedCustomer));
  });

  // Test for `update` method (conflict when email exists)
  it('should throw ConflictException when trying to update with an existing email', async () => {
    const updateCustomerDto = { email: 'john.doe@example.com' };
    const mockCustomer = { id: 1, name: 'John Doe', email: 'john.smith@example.com' };
  
    mockCustomerRepository.findOne.mockResolvedValue(mockCustomer);
    
    // Mocking save to throw a ConflictException
    mockCustomerRepository.save.mockRejectedValue(new ConflictException(`Account with the ${updateCustomerDto.email} email exists`));
  
    await expect(service.update(1, updateCustomerDto)).rejects.toThrow(ConflictException);
  });
  

  // Test for `remove` method (successful removal)
  it('should remove a customer', async () => {
    const mockCustomer = { id: 1, name: 'John Doe' };
    mockCustomerRepository.findOne.mockResolvedValue(mockCustomer);
    mockCustomerRepository.remove.mockResolvedValue(undefined);

    await expect(service.remove(1)).resolves.not.toThrow();
    expect(mockCustomerRepository.remove).toHaveBeenCalledWith(mockCustomer);
  });

  // Test for `remove` method (customer not found)
  it('should throw NotFoundException when trying to remove a non-existent customer', async () => {
    mockCustomerRepository.findOne.mockResolvedValue(null);

    await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    await expect(service.remove(999)).rejects.toThrow('Customer with id 999 not found');
  });
});
