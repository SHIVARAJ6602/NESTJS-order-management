import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const customer = new Customer();
    customer.name = createCustomerDto.name;
    customer.email = createCustomerDto.email;
    customer.pswd = createCustomerDto.pswd;

    // Hash password before saving
    await customer.hashPassword();

    return this.customerRepository.save(customer);
  }

  async findByCredentials(id: number,pswd: string): Promise<Customer | undefined> {
    // Find user by username
    const user = await this.customerRepository.findOne({ where: { id } });

    if (user && user.pswd) {
      // Compare password with hashed password
      const isValid = await user.checkPassword(pswd);
      if (isValid) {
        return user;
        }
      else{
        throw new UnauthorizedException('Invalid credentials');
      }
    }

    return undefined; // Return undefined if no user found
  }

  async findAll(): Promise<Customer[]> {
    const customers = await this.customerRepository.find();
    if (!customers.length) {
      throw new NotFoundException('No customers found');
    }
    return customers;
  }

  async findOne(id: number): Promise<Customer> {
    const customer = await this.customerRepository.findOne({ where: { id } });
    if (!customer) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }
    return customer;
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    const customer = await this.findOne(id);
    if (updateCustomerDto.name) customer.name = updateCustomerDto.name;
    if (updateCustomerDto.email)
    {
      try {
        customer.email = updateCustomerDto.email;
      }catch (error){
        throw new ConflictException(`Account with the ${updateCustomerDto.email} email exists`);
      }
    }
    if (updateCustomerDto.pswd) {
      customer.pswd = updateCustomerDto.pswd;
      await customer.hashPassword();
    }

    try {
      return this.customerRepository.save(customer);
    }catch (error){
      throw new ConflictException(`Account with the ${updateCustomerDto.email} email exists`);
    }
  }

  async remove(id: number): Promise<void> {
    const customer = await this.findOne(id);
    
    if (!customer) {
      throw new NotFoundException(`Customer with id ${id} not found.`);
    }

    try {
      await this.customerRepository.remove(customer);
    } catch (error) {
      throw new Error('Failed to delete customer');
    }
  }
}
