import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { createResponse } from 'src/helper/response.helper';
import { PrismaService } from 'src/prisma/prisma.service';
import { asyncWrapProviders } from 'async_hooks';

@Injectable() 
export class BrandService {
    constructor(private readonly prismaService: PrismaService){}
      // Hàm private để tìm kiếm brand theo id, nếu không có sẽ ném NotFoundException
      
      private async findById(id:number){
        const brand = await this.prismaService.brand.findUnique({
            where : {id},
        });
        
        if(!brand){
            throw new NotFoundException('Brand cần tìm không tồn tại');
        }
        return brand;

      }

      async create(createBrandDto: CreateBrandDto){
        try{
            const brand = await this.prismaService.brand.create({
                data: {
                    name: createBrandDto.name,
                    logoUrl: createBrandDto.logoUrl,
                    slug: createBrandDto.slug ?? '',
                    companyId: +createBrandDto.companyId,
                }
            });
            return createResponse(201, 'Tạo brand thành công', brand);
        }catch(error){
            throw new InternalServerErrorException('Error creating brand: '+ error.message);
        }
      }
    
      async findAll(){
        const brands = await this.prismaService.brand.findMany();
        return createResponse(200, 'Lấy danh sách brand thành công', brands);
      }
      
      async findOne(id:number){
        //Gọi findById để đảm bảo rằng brand tồn tại 
        const brand = await this.findById(id);
        return createResponse(200, 'Lấy thông tin brand thành công', brand);

      }

      async update(id: number, updateBrandDto: UpdateBrandDto){
            //Xác nhận brand tồn tại
        await this.findById(id);

        const updatedBrand = await this.prismaService.brand.update({
            where: { id },
            data: { ...updateBrandDto },
        });
        return createResponse(200, 'Cập nhật brand thành công', updatedBrand);
      }

      async remove(id: number){
        //Xác nhận brand tồn tại trước khi xóa
        await this.findById(id);

        await this.prismaService.brand.delete({
            where: { id },
        });
        return createResponse(200, 'Xóa brand thành công', );
      }

      async findByCompanyId(companyId: number){
        const data = await this.prismaService.brand.findMany({
            where: { companyId },
        });
        if(!data || data.length == 0 ){
            throw new NotFoundException('Không có dữ liệu');
        }
        return createResponse(200, 'Lấy dữ liệu thành công');
      }
}