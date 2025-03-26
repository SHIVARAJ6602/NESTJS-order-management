import { IsArray, IsInt, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ description: 'The ID of the customer placing the order' })
  @IsInt()
  customerId: number;

  @ApiProperty({ description: 'The shipping address for the order' })
  @IsString()
  shippingAddress: string;

  @ApiProperty({
    description: 'A list of products included in the order, with product IDs and quantities',
  })
  @IsArray()
  products: { productId: number; quantity: number }[];

  @ApiProperty({
    description: 'The status of the order, defaults to "pending" if not provided',
    required: false,
  })
  @IsOptional()
  @IsString()
  status: string; // Optional status field (will default to "pending" in the service)
}
