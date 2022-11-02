import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  NotFoundException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDTO } from './dtos/create-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Res } from '@nestjs/common/decorators';

@Controller('store/products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('/')
  async getProducts(@Query() query) {
    const allProducts = await this.productService.getAllProducts(
      query.limit,
      query.skip,
    );
    return allProducts;
  }

  @Get('/:id')
  async getProduct(@Param('id') id: string) {
    const product = await this.productService.getProduct(id);
    if (!product) throw new NotFoundException('Product does not exist!');
    return product;
  }

  @Get('/imgpath/:imgpath')
  seeUploadedFile(@Param('imgpath') image, @Res() res) {
    return res.sendFile(image, { root: './images' });
  }

  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: (req, File, cb) => {
          cb(null, './images');
        },
        filename: (req, file, callback) => {
          const name = file.originalname.split('.')[0];
          const fileExtName = extname(file.originalname);
          const randomName = Array(4)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          callback(null, `${name}-${randomName}${fileExtName}`);
        },
      }),
    }),
  )
  @Post('/')
  async addProduct(
    @Body() createProductDTO: CreateProductDTO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const response = {
      originalname: file.originalname,
      filename: file.filename,
    };
    const product = await this.productService.addProduct(
      createProductDTO,
      response,
    );

    return product;
  }

  @Put('/:id')
  async updateProduct(
    @Param('id') id: string,
    @Body() createProductDTO: CreateProductDTO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const response = {
      originalname: file.originalname,
      filename: file.filename,
    };
    const product = await this.productService.updateProduct(
      id,
      createProductDTO,
      response,
    );
    if (!product) throw new NotFoundException('Product does not exist!');
    return product;
  }

  @Delete('/:id')
  async deleteProduct(@Param('id') id: string) {
    const product = await this.productService.deleteProduct(id);
    if (!product) throw new NotFoundException('Product does not exist');
    return product;
  }
}
