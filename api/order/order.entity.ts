import { BeforeInsert, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { v4 as uuidv4 } from 'uuid';
import { CustomersEntity } from '../customers/customer.entity';

@Entity('orders')
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @BeforeInsert()
  generateId() {
    this.id = uuidv4();
  }


  @ApiProperty()
  @Column()
  referenceCode: string;

  @ApiProperty()
  @Column()
  customerId: string;


  @Column()
  @ApiProperty()
  orNumber: string;

  @ApiProperty()
  @ManyToOne(() => CustomersEntity, (customer) => customer.order)
  customer: CustomersEntity;

  @ApiProperty()
  @Column('json')
  delivery: string;

  @ApiProperty()
  @Column('json')
  invoice: string;

  @ApiProperty()
  @Column('json')
  products: string;

  @ApiProperty()
  @Column('json', { nullable: true })
  placeHolder: string;

  @ApiProperty()
  @Column()
  @CreateDateColumn()
  dateOrdered: Date;

  @Exclude()
  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @Exclude()
  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
