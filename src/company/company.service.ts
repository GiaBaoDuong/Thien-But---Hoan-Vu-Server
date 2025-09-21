import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { createResponse } from 'src/helper/response.helper';

@Injectable()
export class CompanyService {

  constructor(
    private prismaService: PrismaService,
  ) { }

  async create(createCompanyDto: CreateCompanyDto) {
    try {
      const company = await this.prismaService.company.create({
        data: {
          name: createCompanyDto.name,
          email: createCompanyDto.email,
          phoneNumber: createCompanyDto.phoneNumber,
          address: createCompanyDto.address
        },
      });
      return createResponse(201, 'Tạo công ty thành công', company);
    } catch (error) {
      throw new InternalServerErrorException('Error creating company: ' + error.message);
    }
  }

  async findAll() {
    const companies = await this.prismaService.company.findMany();
    return createResponse(200, 'Lấy danh sách công ty thành công', companies);
  }

  async findOne(id: number) {
    const company = await this.findById(id);
    return createResponse(200, 'Lấy thông tin công ty thành công', company);
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto) {
    await this.findById(id);

    // Thực hiện cập nhật thông tin công ty dựa trên dữ liệu truyền từ DTO
    const updatedCompany = await this.prismaService.company.update({
      where: { id },
      data: { ...updateCompanyDto },
    });
    return createResponse(201, 'Cập nhật công ty thành công', updatedCompany);
  }

  async remove(id: number) {
    await this.findById(id);
    return createResponse(200, 'Xóa công ty thành công', await this.prismaService.company.delete({ where: { id: id } }));
  }

  async findById(id: number) {
    const company = await this.prismaService.company.findUnique({
      where: {
        id: id
      }
    });
    if (!company) {
      throw new NotFoundException(`Không tìm thấy công ty với id ${id}`);
    }
    return company
  }
}
