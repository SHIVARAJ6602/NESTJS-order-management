import { Test, TestingModule } from '@nestjs/testing';
import { OrderproductsService } from './orderproducts.service';

describe('OrderproductsService', () => {
  let service: OrderproductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderproductsService],
    }).compile();

    service = module.get<OrderproductsService>(OrderproductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
