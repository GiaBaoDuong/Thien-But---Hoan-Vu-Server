import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { createResponse } from 'src/helper/response.helper';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly prismaService: PrismaService){}
  async create(createCategoryDto: CreateCategoryDto) {
    try{
      const category = await this.prismaService.category.create({
        data: {
          name: createCategoryDto.name,
          slug: createCategoryDto.slug ?? '',
          description: createCategoryDto.description,
        }
      });
      return createResponse(201, 'Tạo danh mục thành công', category);
    }catch(error){
      throw new InternalServerErrorException('Error creating category: ' + error.message);
    }
  }

  private async findById(id: number){
    const category = await this.prismaService.category.findUnique({
      where: { id },
  });

    if(!category){
      throw new NotFoundException("Category cần tìm không hề tồn tại");
    }
    return category;
}

  async findAll() {
    const categories = await this.prismaService.category.findMany();
    return createResponse(200, 'Lấy danh sách danh mục thành công', categories);
  }

  async findOne(id: number) {
    const category = await this.findById(id);
    return createResponse(200, 'Lấy thông tin danh mục thành công', category);
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    await this.findById(id);
    const updatedCategory = await this.prismaService.category.update({
      where : { id },
      data: { ...updateCategoryDto },
    });
    return createResponse(200, 'Cập nhật danh mục thành công ', updatedCategory);
  }

  async remove(id: number) {
    await this.findById(id);
    await this.prismaService.category.delete({
      where: { id },
    });
    return createResponse(200, 'Xóa danh mục thành công',);
  }
}
