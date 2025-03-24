import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { IsOptional, IsString, IsInt, IsNumber, IsEnum, Min, Max } from 'class-validator';
import { OrderStatus } from 'src/orders/entities/order.entity'; // Assuming that you have an enum for order status

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsOptional() // This makes the field optional in the update request
  @IsInt() // Validates that the customerId is an integer
  customerId?: number;

  @IsOptional() 
  @IsInt() // Validates that the productId is an integer
  productId?: number;

  @IsOptional()
  @IsEnum(OrderStatus) // Validates that the status is one of the values in the OrderStatus enum
  status?: OrderStatus;

  @IsOptional()
  @IsInt() // Validates that the quantity is an integer
  @Min(1) // Validates that the quantity is greater than 0
  quantity?: number;

  @IsOptional()
  @IsNumber() // Validates that totalPrice is a number
  @Min(0) // Ensures the total price is greater than or equal to 0
  totalPrice?: number;

  @IsOptional()
  @IsString() // Validates that the shippingAddress is a string
  @Max(255) // Ensures the shipping address length doesn't exceed 255 characters
  shippingAddress?: string;
}
