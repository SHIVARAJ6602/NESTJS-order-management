import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Customer])],  // Register the Customer entity
  controllers: [CustomersController],
  providers: [
    CustomersService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,  // Make JwtAuthGuard global
    },
  ],
  exports: [CustomersService],
})
export class CustomersModule {}
