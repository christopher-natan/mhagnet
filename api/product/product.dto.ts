import { IsObject } from 'class-validator';

export class CreateProductDto {
  @IsObject()
  images: object;

  @IsObject()
  categories: object;
}

export class ProductDto {
  id: number;
  images: object;
  categories: object;
}
