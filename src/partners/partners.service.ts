import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { createResponse } from 'src/helper/response.helper';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PartnersService {
  constructor (private readonly prismaService : PrismaService){}

  private async findById(id: number){
    const partner = await this.prismaService.partner.findUnique({
      where: { id },
    });

  if(!partner){
    throw new NotFoundException('Partner cần tìm không tồn tại')      
    }
    return partner;
  }
  async create(createPartnerDto: CreatePartnerDto) {
    try{
      const partner = await this.prismaService.partner.create({
        data: {
          name: createPartnerDto.name,
          logoUrl: createPartnerDto.logoUrl,
          websiteUrl: createPartnerDto.websiteUrl,
          companyId: +createPartnerDto.companyId,
        },
      });
      return createResponse(200, 'Tạo Partner thành công', partner);
    }catch(error){
      throw new InternalServerErrorException('Error create partner: ' + error.message);
    }
  }

  async findAll() {
    const partners = await this.prismaService.partner.findMany();
    return createResponse(200, 'Lấy danh sách partner thành công ', partners);
  }

  async findOne(id: number) {
    const partner = await this.findById(id);
    return createResponse(200, 'Lấy thông tin partner thành công', partner);
  }

  

  async remove(id: number) {
    await this.findById(id);
    await this.prismaService.partner.delete({
      where: { id },
    });
    return createResponse(200, 'Xóa partner thành công', );
  }

  async update(id: number, updatePartnerDto: UpdatePartnerDto){
    await this.findById(id);

    const updatedPartner = await this.prismaService.partner.update({
      where: { id },
      data: { ... updatePartnerDto },
    });
    return createResponse(200, 'Cập nhật partner thành công',updatedPartner);
  }

  async findByCompanyId(companyId: number){
    const data = await this.prismaService.partner.findMany({
      where: { companyId },
    });
    if(!data || data.length === 0){
      throw new NotFoundException('Không có dữ liệu');
    }
    return createResponse(200, 'Lấy danh sách partner theo công ty thành công', data);
  }
}
