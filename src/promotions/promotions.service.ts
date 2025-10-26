import { Injectable, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { SearchPromotionDto } from './dto/search-promotion.dto';
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

  async search(searchDto: SearchPromotionDto) {
    const {
      name,
      companyId,
      isActive,
      startDateFrom,
      startDateTo,
      endDateFrom,
      endDateTo
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

    // Lọc theo trạng thái active
    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    // Lọc theo ngày bắt đầu
    if (startDateFrom || startDateTo) {
      where.startDate = {};
      if (startDateFrom) {
        where.startDate.gte = startDateFrom;
      }
      if (startDateTo) {
        where.startDate.lte = startDateTo;
      }
    }

    // Lọc theo ngày kết thúc
    if (endDateFrom || endDateTo) {
      where.endDate = {};
      if (endDateFrom) {
        where.endDate.gte = endDateFrom;
      }
      if (endDateTo) {
        where.endDate.lte = endDateTo;
      }
    }

    const promotions = await this.prismaService.promotion.findMany({
      where,
      include: {
        products: {
          include: {
            images: true,
            category: true,
            brand: true
          }
        },
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

    return createResponse(200, 'Tìm kiếm promotion thành công', promotions);
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

  // Thêm products vào promotion
  async addProducts(promotionId: number, productIds: number[]) {
    // Bước 1: Kiểm tra promotion có tồn tại không
    const promotion = await this.prismaService.promotion.findUnique({
      where: { id: promotionId },
      include: { products: true }
    });
    
    if (!promotion) {
      throw new NotFoundException(`Promotion với ID ${promotionId} không tồn tại`);
    }

    // Bước 2: Kiểm tra promotion có đang active không
    if (!promotion.isActive) {
      throw new BadRequestException('Không thể thêm sản phẩm vào promotion đã bị vô hiệu hóa');
    }

    // Bước 3: Kiểm tra các products có tồn tại không
    const products = await this.prismaService.product.findMany({
      where: { 
        id: { in: productIds },
        is_deleted: false // Chỉ lấy sản phẩm chưa bị xóa
      },
    });
    
    if (products.length !== productIds.length) {
      const foundIds = products.map(p => p.id);
      const notFoundIds = productIds.filter(id => !foundIds.includes(id));
      throw new NotFoundException(`Các sản phẩm với ID ${notFoundIds.join(', ')} không tồn tại hoặc đã bị xóa`);
    }

    // Bước 4: Kiểm tra products đã có trong promotion chưa
    const existingProductIds = promotion.products.map(p => p.id);
    const newProductIds = productIds.filter(id => !existingProductIds.includes(id));
    
    if (newProductIds.length === 0) {
      throw new BadRequestException('Tất cả sản phẩm đã có trong promotion này');
    }

    // Bước 5: Thêm products vào promotion
    await this.prismaService.promotion.update({
      where: { id: promotionId },
      data: {
        products: {
          connect: newProductIds.map(id => ({ id })),
        },
      },
    });

    return createResponse(200, `Thêm ${newProductIds.length} sản phẩm vào promotion thành công`);
  }

  // Xóa products khỏi promotion
  async removeProducts(promotionId: number, productIds: number[]) {
    // Bước 1: Kiểm tra promotion có tồn tại không
    const promotion = await this.prismaService.promotion.findUnique({
      where: { id: promotionId },
      include: { products: true }
    });
    
    if (!promotion) {
      throw new NotFoundException(`Promotion với ID ${promotionId} không tồn tại`);
    }

    // Bước 2: Kiểm tra products có trong promotion không
    const existingProductIds = promotion.products.map(p => p.id);
    const validProductIds = productIds.filter(id => existingProductIds.includes(id));
    
    if (validProductIds.length === 0) {
      throw new BadRequestException('Không có sản phẩm nào trong danh sách thuộc promotion này');
    }

    // Bước 3: Xóa products khỏi promotion
    await this.prismaService.promotion.update({
      where: { id: promotionId },
      data: {
        products: {
          disconnect: validProductIds.map(id => ({ id })),
        },
      },
    });

    return createResponse(200, `Xóa ${validProductIds.length} sản phẩm khỏi promotion thành công`);
  }

  // Lấy danh sách products trong promotion
  async getProducts(promotionId: number) {
    const promotion = await this.prismaService.promotion.findUnique({
      where: { id: promotionId },
      include: {
        products: {
          include: {
            images: true,
            category: true,
            brand: true,
          },
        },
      },
    });

    if (!promotion) {
      throw new NotFoundException('Promotion không tồn tại');
    }

    return createResponse(200, 'Lấy danh sách sản phẩm trong promotion thành công', promotion.products);
  }
}
