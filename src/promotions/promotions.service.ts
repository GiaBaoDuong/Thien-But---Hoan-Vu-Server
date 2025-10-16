import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { createResponse } from 'src/helper/response.helper';

@Injectable()
export class PromotionsService {
  constructor(private readonly prismaService: PrismaService ){}

   async create(createPromotionDto: CreatePromotionDto) {
    try{
      const promotion = await this.prismaService.promotion.create({
        data: {
          name: createPromotionDto.name,
          description: createPromotionDto.description,
          discountType: createPromotionDto.discountType,
          discountValue: createPromotionDto.discountValue,
          startDate: createPromotionDto.startDate,
          endDate: createPromotionDto.endDate,
          isActive: createPromotionDto.isActive ?? true,
          companyId: createPromotionDto.companyId,
          
          products: {
            connect: createPromotionDto.productIds?.map((id) => ({ id })) || [],
          },
        },
      });
      return createResponse(201, 'Tạo Promotion thành công', promotion);
    }catch(error){
      throw new InternalServerErrorException('Error creating promotion: ' + error.message);
    }
  }

  async findAll() {
    const promotions = await this.prismaService.promotion.findMany({
      include: { products : true, company: true},
    });
    return createResponse(200, 'Lấy danh sách promotion thành công', promotions);
  }

  async findById(id: number){
    const promotion = await this.prismaService.promotion.findUnique({
      where: { id },
      include: {products: true, company: true},
    })
    if(!promotion){
      throw new NotFoundException('Promotion cần tìm không tồn tại');
    }
    return promotion;
  }

  async findOne(id: number) {
    const promotion = await this.findById(id);
    return createResponse(200, 'Lấy thông tin promotion thành công ');
  }
  

  async update(id: number, updatePromotionDto: UpdatePromotionDto) {
    await this.findById(id);
    const updatedPromotion = await this.prismaService.promotion.update({
      where: { id },
      data: { ... updatePromotionDto },
    });
    return createResponse(200, 'Cập nhật promotion thành công ', updatedPromotion );
  }

  async remove(id: number) {
    await this.findById(id);
    await this.prismaService.promotion.delete({
      where: { id },
    });
    return createResponse(200, 'Xóa promotion thành công ');
  }
}
