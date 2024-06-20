import { Body, Controller, Delete, Get, Headers, Param, Post } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { ProductEntity } from './product.entity';
import { ProductService } from './product.service';

@Crud({
  model: {
    type: ProductEntity,
  },
})
@Controller('product')
export class ProductController implements CrudController<ProductEntity> {
  constructor(public service: ProductService) {}

  @Delete('image/:name')
  public async deleteImage(
    @Param('name') name: string,
    @Headers() headers: any,
  ): Promise<void> {
    await this.service.deleteImage(headers, name);
  }

  @Post('available')
  public async setAvailable(
    @Body('isAvailable') isAvailable: number,
    @Headers() headers: any,
  ): Promise<void> {
    await this.service.setAvailable(headers, isAvailable);
  }

  @Post('categories')
  public async saveCategories(
    @Body('categories') categories: any,
    @Headers() headers: any,
  ): Promise<void> {
    await this.service.saveCategories(headers, categories);
  }

  @Post('featured')
  public async setFeatured(
    @Body('isFeatured') isFeatured: boolean,
    @Headers() headers: any,
  ): Promise<void> {
    await this.service.setFeatured(headers, isFeatured);
  }

  @Get()
  public async findAll(): Promise<ProductEntity[]> {
    return await this.service.findAllSortedByCreatedAt();
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    await this.service.delete(id);
  }
}
