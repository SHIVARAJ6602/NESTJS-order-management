import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ description: 'The name of the product' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'The price of the product'})
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'The quantity of the product in stock'})
  @IsNumber()
  quantity: number;
}
