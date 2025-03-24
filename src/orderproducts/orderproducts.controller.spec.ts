import { Test, TestingModule } from '@nestjs/testing';
import { OrderproductsController } from './orderproducts.controller';
import { OrderproductsService } from './orderproducts.service';

describe('OrderproductsController', () => {
  let controller: OrderproductsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderproductsController],
      providers: [OrderproductsService],
    }).compile();

    controller = module.get<OrderproductsController>(OrderproductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
