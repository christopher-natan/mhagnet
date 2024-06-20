import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { OrderEntity } from './order.entity';
import { Repository } from 'typeorm';
import { CustomersEntity } from '../customers/customer.entity';
import { UidService } from '../services/uid.service';

@Injectable()
export class OrderService extends TypeOrmCrudService<OrderEntity> {
  constructor(
    @InjectRepository(OrderEntity) protected repo: Repository<OrderEntity>,
    @InjectRepository(CustomersEntity)
    protected customersRepo: Repository<CustomersEntity>,
    protected readonly uidService: UidService,
  ) {
    super(repo);
  }

  async create(order: OrderEntity): Promise<OrderEntity> {
    order.orNumber = this.uidService.generate('OR');
    order.referenceCode = this.uidService.generate('RF');
    return this.repo.save(order);
  }

  findAll(): Promise<OrderEntity[]> {
    return this.repo.find({ relations: ['customer'] });
  }
}
