import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDTO } from './dtos/create-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product')
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async getAllProducts(limit: number, skip: number): Promise<Product[]> {
    const products = await this.productModel
      .find()
      .limit(limit)
      .skip(skip)
      .exec();
    return products;
  }

  async getProduct(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    return product;
  }

  async addProduct(
    createProductDTO: CreateProductDTO,
    response,
  ): Promise<Product> {
    const newProduct = await this.productModel.create(createProductDTO);
    newProduct['image'] = response.filename;
    return newProduct.save();
  }

  // perlu diupdate lagi codenya
  async updateProduct(
    id: string,
    createProductDTO: CreateProductDTO,
    response,
  ): Promise<Product> {
    const updatedProduct = await this.productModel.findByIdAndUpdate(
      id,
      createProductDTO,
      { new: true },
    );
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<any> {
    const deletedProduct = await this.productModel.findByIdAndRemove(id);
    return deletedProduct;
  }
}
