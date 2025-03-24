import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderproductDto } from './create-orderproduct.dto';

export class UpdateOrderproductDto extends PartialType(CreateOrderproductDto) {}
