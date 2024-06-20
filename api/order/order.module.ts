import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './order.entity';
import { OrderService } from './order.service';
import { CustomersEntity } from '../customers/customer.entity';
import { UidService } from '../services/uid.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity, CustomersEntity])],
  providers: [OrderService, UidService],
  controllers: [OrderController],
})
export class OrderModule {}
