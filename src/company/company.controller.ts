import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Public } from 'src/helper/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) { }

  //@Post('create')
  //create(@Body() createCompanyDto: CreateCompanyDto) {
    //return this.companyService.create(createCompanyDto);
  //}

  @Post('upload')
  @ApiConsumes('multipart/form-data') // Báo cho Swagger endpoint này nhận form-data
  @ApiBody({
    description: 'Upload avatar công ty',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'File avatar công ty (jpeg, jpg, png, gif)',
        },
        name: {
          type: 'string',
          description: 'Tên công ty',
          example: 'Công ty ABC'
        },
        email: {
          type: 'string',
          description: 'Email công ty',
          example: 'contact@company.com'
        },
        phoneNumber: {
          type: 'string',
          description: 'Số điện thoại',
          example: '0123456789'
        },
        address: {
          type: 'string',
          description: 'Địa chỉ công ty',
          example: '123 Đường ABC, Quận 1, TP.HCM'
        }
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = uuidv4();
        const fileExtName = extname(file.originalname);
        cb(null, `${uniqueSuffix}${fileExtName}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpeg|jpg|png|gif)$/)) {
        return cb(new Error('Chỉ hỗ trợ upload file ảnh (jpeg, jpg, png, gif)!'), false);
      }
      cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 } // giới hạn kích thước file tối đa 5MB
  }))
  async createCompanyWithFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() createCompanyDto: CreateCompanyDto,
  ) {
    const baseUrl = process.env.BASE_URL || 'http://localhost:8080';
    const fileUrl = `${baseUrl}/uploads/${file.filename}`;

    // Gán fileUrl vào trường avatarUrl của DTO
    const updatedDto: CreateCompanyDto = {
      ...createCompanyDto,
      avatarUrl: fileUrl,
    };
    return this.companyService.create(updatedDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.companyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.update(+id, updateCompanyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyService.remove(+id);
  }
}
