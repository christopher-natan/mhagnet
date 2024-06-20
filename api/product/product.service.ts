import { Injectable, NotFoundException } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { ProductEntity } from './product.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductService extends TypeOrmCrudService<ProductEntity> {
  constructor(@InjectRepository(ProductEntity) repo) {
    super(repo);
  }

  public async saveImage(headers: any, files: any): Promise<ProductEntity> {
    const mapImages = (images: any[]) => {
      return images.map((file: any) => {
        return {
          name: file.filename == undefined ? file.name : file.filename, size: file.size,
        };
      });
    };

    const id: string = this.getHeaderId(headers);
    const product: ProductEntity = await this.repo.findOne({ where: { id } });
    this.validate(product);
    files = mapImages(files);
    product.images = [...files, ...product.images];
    return this.repo.save(product);
  }

  public async deleteImage(headers: any, image: string) {
    const id = headers['product-id'];
    const product = await this.repo.findOne({ where: { id } });
    if (!product) {
      throw new Error(`Image not found`);
    }
    product.images = product.images.filter((item: any) => item.name !== image);
    return this.repo.save(product);
  }

  public async setAvailable(headers: any, isAvailable: number) {
    const id = headers['product-id'];
    const product = await this.repo.findOne({ where: { id } });
    if (!product) {
      throw new Error(`Product not found`);
    }

    product.isAvailable = isAvailable;
    return this.repo.save(product);
  }

  public async setFeatured(headers: any, isFeatured: boolean) {
    const id = headers['product-id'];
    const product = await this.repo.findOne({ where: { id } });
    if (!product) {
      throw new Error(`Product not found`);
    }
    product.isFeatured = isFeatured ? 1 : 0;
    return this.repo.save(product);
  }

  public async findAllSortedByCreatedAt(): Promise<ProductEntity[]> {
    return this.repo.find({
      order: { createAt: 'DESC' },
    });
  }

  async delete(id: string): Promise<void> {
    const product = await this.repo.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    await this.repo.delete(id);
  }

  async saveCategories(headers: any, categories: any) {
    const id = headers['product-id'];
    const product = await this.repo.findOne({ where: { id } });
    if (!product) {
      throw new Error(`Product not found`);
    }
    product.categories = categories.map((item: string) => {
      return { id: item };
    });
    return this.repo.save(product);
  }

  private validate(data: any) {
    if (!data) {
      throw new Error(`An Error occurred`);
    }
  }

  private getHeaderId(headers: any): string {
    return headers['product-id'];
  }
}
