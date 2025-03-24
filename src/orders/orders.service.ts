import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity'; // Import the Order entity
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Product } from 'src/products/entities/product.entity';
import { OrderProduct } from 'src/orderproducts/entities/orderproduct.entity';
import { NotFoundError } from 'rxjs';
//import { ProductsService } from 'src/products/products.service'; // Assuming you have a ProductService

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    //private productService: ProductsService, // Inject ProductService to update product quantities
    @InjectRepository(OrderProduct) 
    private orderProductRepository: Repository<OrderProduct>,
  ) {}

  // Create a new order
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { customerId, shippingAddress, products, status = 'pending' } = createOrderDto;
  
    // Create the order
    const order = this.ordersRepository.create({
      customer: { id: customerId }, // Assume you already have customer information
      shippingAddress,
      status,
    });
  
    // Initialize total price
    let totalPrice = 0;
    const orderProducts: { product: Product; quantity: number }[] = [];
  
    // Check if products exist, sufficient stock, and calculate total price
    for (const { productId, quantity } of products) {
      const product = await this.productRepository.findOne({ where: { id: productId } });
  
      if (!product) {
        throw new NotFoundException(`Product with id ${productId} not found`);
      }
  
      if (product.quantity < quantity) {
        throw new ConflictException(`Product with id ${productId} has insufficient stock`);
      }
      
  
      // Update product stock quantity
      product.quantity -= quantity;
      await this.productRepository.save(product);
  
      // Calculate total price
      totalPrice += product.price * quantity;
  
      orderProducts.push({ product, quantity });
    }
  
    // Save the order
    const savedOrder = await this.ordersRepository.save(order);
  
    // Create OrderProduct entities and save them
    for (const { product, quantity } of orderProducts) {
      const orderProduct = this.orderProductRepository.create({
        order: savedOrder,
        product,
        quantity,
      });
      await this.orderProductRepository.save(orderProduct);
    }
  
    // Set total price for the order
    savedOrder.totalPrice = totalPrice;
    await this.ordersRepository.save(savedOrder);
  
    return savedOrder;
  }
  
  
  async findOrderDetails(id: number): Promise<any> {
    // Fetch the order with the related products and product details
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['products', 'products.product'],
    });
  
    // If the order is not found, throw an error
    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }
  
    // Format the response to match your desired structure
    return {
      id: order.id,
      shippingAddress: order.shippingAddress,
      status: order.status,
      totalPrice: order.totalPrice, // Ensure price is a number with two decimals
      products: order.products.map((orderProduct) => ({
        product: {
          id: orderProduct.product.id,
          name: orderProduct.product.name,
          price: orderProduct.product.price,
        },
        quantity: orderProduct.quantity,
      })),
      createdAt: order.createdAt,  // Return the date as a Date object
    };
  }
  
  

  

  // Get all orders
  async findAll(): Promise<Order[]> {
    return await this.ordersRepository.find(); // Retrieve all orders from the database
  }

  // Get a single order by ID
  async findOne(id: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({ where: { id } }); // Corrected usage of `findOne` with a `where` object
    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }
    return order; // Return the found order
  }

  // Find orders by ID and status
  async findByStatus(id: number, status: string): Promise<Order[]> {
    return await this.ordersRepository.find({
      where: {
        id: id,
        status: status,
      },
    }); // Find orders based on both id and status
  }

  // Update an order by ID
  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.ordersRepository.findOne({ where: { id } }); // Corrected usage of `findOne`
    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    // Apply the changes to the existing order object
    Object.assign(order, updateOrderDto);

    // Save the updated order back to the database
    return await this.ordersRepository.save(order);
  }

  // Remove an order by ID
  async remove(id: number): Promise<void> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['products'], // Make sure to load the related products to delete them
    });
  
    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }
  
    // First, delete related order products
    if (order.products && order.products.length > 0) {
      await this.orderProductRepository.remove(order.products);
    }
  
    // Now, delete the order itself
    await this.ordersRepository.remove(order);
  }
  
}
