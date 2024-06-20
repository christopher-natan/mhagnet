import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { CrudValidationGroups } from '@nestjsx/crud';
import { v4 as uuidv4 } from 'uuid';
const { CREATE, UPDATE } = CrudValidationGroups;

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @BeforeInsert()
  generateId() {
    this.id = uuidv4();
  }

  @ApiProperty()
  @Column()
  code: string;

  @ApiProperty()
  @Column()
  @IsNotEmpty({ groups: [CREATE, UPDATE] })
  @IsString({ groups: [CREATE, UPDATE] })
  @MaxLength(40, { groups: [CREATE, UPDATE] })
  name: string;

  @ApiProperty()
  @Column('text')
  @IsNotEmpty({ groups: [CREATE, UPDATE] })
  @IsString({ groups: [CREATE, UPDATE] })
  @MaxLength(1200, { groups: [CREATE, UPDATE] })
  description: string;

  @ApiProperty()
  @Column()
  price: number;

  @ApiProperty()
  @Column()
  quantity: number;

  @ApiProperty()
  @Column('json', { nullable: true })
  categories: any;

  @ApiProperty()
  @Column('json', { nullable: true })
  images: any;

  @ApiProperty()
  @Column({
    type: 'int',
    transformer: {
      from: (value: number) => value === 1,
      to: (value: boolean) => (value ? 1 : 0),
    },
  })
  isAvailable: number;

  @ApiProperty()
  @Column({
    type: 'int',
    transformer: {
      from: (value: number) => value === 1,
      to: (value: boolean) => (value ? 1 : 0),
    },
  })
  isFeatured: number;

  @Exclude()
  @ApiProperty()
  @CreateDateColumn()
  createAt: Date;

  @Exclude()
  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
