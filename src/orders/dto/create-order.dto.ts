import { IsArray, IsInt, IsString, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @IsInt()
  customerId: number;

  @IsString()
  shippingAddress: string;

  @IsArray()
  products: { productId: number; quantity: number }[];

  @IsOptional()
  @IsString()
  status: string; // Optional status field (will default to "pending" in the service)
}
