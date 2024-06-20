import { Body, Controller, Get, Post } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { OrderEntity } from './order.entity';
import { OrderService } from './order.service';

@Crud({
  model: {
    type: OrderEntity,
  },
})
@Controller('order')
export class OrderController implements CrudController<OrderEntity> {
  constructor(public service: OrderService) {
  }

  @Post()
  async create(@Body() order: OrderEntity) {
    return this.service.create(order);
  }

  @Get()
  findAll(): Promise<OrderEntity[]> {
    return this.service.findAll();
  }
}
