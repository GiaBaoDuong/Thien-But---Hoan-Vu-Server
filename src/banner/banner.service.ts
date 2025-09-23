import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateBannerDto } from './dto/create-banner.dto';
import { createResponse } from 'src/helper/response.helper';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateBannerDto } from './dto/update-banner.dto';

@Injectable()
export class BannerService {
constructor(private readonly prismaService: PrismaService) {}

  // Hàm private để tìm kiếm banner theo id, nếu không có sẽ ném NotFoundException
  private async findById(id: number) {
    const banner = await this.prismaService.banner.findUnique({
      where: { id },
    });

    if (!banner) {
      throw new NotFoundException(`Banner cần tìm không tồn tại`);
    }

    return banner;
  }

  async create(createBannerDto: CreateBannerDto) {
    try {
      const banner = await this.prismaService.banner.create({
        data: {
          title: createBannerDto.title,
          imageUrl: createBannerDto.imageUrl,
          companyId: +createBannerDto.companyId,
        },
      });
      return createResponse(200, 'Tạo banner thành công', banner);
    } catch (error) {
      throw new InternalServerErrorException('Error creating banner: ' + error.message);
    }
  }

  async findAll() {
    const banners = await this.prismaService.banner.findMany();
    return createResponse(200, 'Lấy danh sách banner thành công', banners);
  }

  async findOne(id: number) {
    // Gọi findById để đảm bảo banner tồn tại
    const banner = await this.findById(id);
    return createResponse(200, 'Lấy thông tin banner thành công', banner);
  }

   async update(id: number, updateBannerDto: UpdateBannerDto) {
    // Xác nhận banner tồn tại
     await this.findById(id);

     const updatedBanner = await this.prismaService.banner.update({
       where: { id },
       data: { ...updateBannerDto },
     });
     return createResponse(200, 'Cập nhật banner thành công', updatedBanner);
   }

  async remove(id: number) {
    // Xác nhận banner tồn tại trước khi xóa
    await this.findById(id);

    await this.prismaService.banner.delete({
      where: { id },
    });
    return createResponse(200, 'Xóa banner thành công',);
  }

  async findByCompanyId(companyId: number) {
    const data = await this.prismaService.banner.findMany({
      where: { companyId },
    });
    if (!data || data.length === 0) {
      throw new NotFoundException(`không có dữ liệu`);
    }
    return createResponse(200, 'Lấy danh sách banner theo công ty thành công', data);
  }
}
