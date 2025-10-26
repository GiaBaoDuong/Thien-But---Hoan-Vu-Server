// src/products/products.service.ts

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { SearchProductDto } from './dto/search-product.dto';
import { product as Product, Promotion } from '@prisma/client';
import { createResponse } from 'src/helper/response.helper';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) { }
  
  async create(createProductDto: CreateProductDto) {
    const { images, ...productData } = createProductDto;

    return this.prisma.$transaction(async (tx) => {
      // Bước 1: Tạo sản phẩm với các thông tin cơ bản
      const product = await tx.product.create({
        data: {
          ...productData,
        },
      });

      // Bước 2: Nếu có danh sách ảnh, tạo các bản ghi ProductImage
      if (images && images.length > 0) {
        await tx.productImage.createMany({
          data: images.map((url, index) => ({
            imageUrl: url,
            order: index, // Gán thứ tự cho ảnh
            productId: product.id,
          })),
        });
      }

      // Bước 3: Trả về sản phẩm hoàn chỉnh với danh sách ảnh
      return tx.product.findUnique({
        where: { id: product.id },
        include: {
          images: true,
        },
      });
    });
  }
  private async findById(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { images: true, promotions: true },
    });
    if(!product){
      throw new NotFoundException("Sản phẩm cần tìm không hề tồn tại");
    }

    return product;
}
  async findAll() {
    const products = await this.prisma.product.findMany({
      include: { images: true },
    });
    return createResponse(200, 'Lấy danh sách sản phẩm thành công', products);
  }

  async search(searchDto: SearchProductDto) {
    const {
      name,
      companyId,
      is_published,
      is_featured,
      is_deleted = false
    } = searchDto;

    // Xây dựng điều kiện where
    const where: any = {};

    // Tìm kiếm theo tên (không phân biệt hoa thường)
    if (name) {
      where.name = {
        contains: name,
        mode: 'insensitive'
      };
    }

    // Lọc theo companyId
    if (companyId) {
      where.companyId = companyId;
    }

    // Lọc theo trạng thái published
    if (is_published !== undefined) {
      where.is_published = is_published;
    }

    // Lọc theo trạng thái featured
    if (is_featured !== undefined) {
      where.is_featured = is_featured;
    }

    // Lọc theo trạng thái deleted
    where.is_deleted = is_deleted;

    const products = await this.prisma.product.findMany({
      where,
      include: {
        images: true,
        category: true,
        brand: true,
        company: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return createResponse(200, 'Tìm kiếm sản phẩm thành công', products);
  }

  async findOne(id: number){
    const product = await this.findById(id);
    return createResponse(200, 'Lấy thông tin sản phẩn thành công', product);
  }

  async update(id: number, updateProductDto: UpdateProductDto){
    await this.findById(id);

    // Loại bỏ các trường undefined: 
    const cleanData = Object.fromEntries(
      Object.entries(updateProductDto).filter(([_, v]) => v !== undefined)
    );
      const updatedProduct = await this.prisma.product.update({
        where : { id },
        data: cleanData,
      });
      return createResponse(200, 'Cập nhật sản phẩm thành công', updatedProduct);
  }

  

  async remove(id: number){
    await this.findById(id);
    await this.prisma.product.delete({
      where: { id },
    })
    return createResponse(200, 'Xóa sản phẩm thành công',);
  }

  async getImagesByProductId(productId: number) {
  // B1: Kiểm tra sản phẩm có tồn tại không
  const product = await this.prisma.product.findUnique({
    where: { id: productId },
  });
  if (!product) {
    throw new NotFoundException('Sản phẩm không tồn tại');
  }

  // B2: Lấy danh sách ảnh của sản phẩm đó
  const images = await this.prisma.productImage.findMany({
    where: { productId },
    orderBy: { order: 'asc' },
  });

  return createResponse(200, 'Lấy danh sách ảnh thành công', images);
}

async addImagesToProduct(productId: number, imageUrls: string[]) {
  const imagesData = imageUrls.map((url, index) => ({
    productId,
    imageUrl: url,
    order: index,
  }));

  await this.prisma.productImage.createMany({ data: imagesData });
}
}
