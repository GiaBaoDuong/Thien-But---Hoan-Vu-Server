import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PartnersService } from './partners.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { existsSync } from 'fs';
import { unlink } from 'fs/promises';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';
@Controller('partners')
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data') // Báo cho Swagger endpoint này nhận form-data
  @ApiBody({
    description: 'Upload logo đối tác',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'File logo đối tác (jpeg, jpg, png, gif)',
        },
        name: {
          type: 'string',
          description: 'Tên đối tác',
          example: 'Đối tác ABC'
        },
        description: {
          type: 'string',
          description: 'Mô tả đối tác',
          example: 'Mô tả về đối tác'
        },
        companyId: {
          type: 'number',
          description: 'ID công ty',
          example: 1
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
      if(!file.mimetype.match(/\/(jpeg|jpg|png|gif)$/)){
        return cb(new Error('Chỉ hỗ trợ upload file ảnh(jpeg,jpg,png,gif)!'), false);
      }
      cb(null,true);
    },
    limits: { fileSize: 5 * 1024 * 1024 } // giới hạn kích thước file tối đa 5MB
  }))
  async createPartnerWithFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() createPartnerDto: CreatePartnerDto,
  ){
    const baseUrl = process.env.BASE_URL || 'http://localhost:8080';
    const fileUrl = `${baseUrl}/uploads/${file.filename}`;

    // gắn fileUrl vào trường url của DTO 
    const updatedDto: CreatePartnerDto = {
      ...createPartnerDto,
      companyId: Number(createPartnerDto.companyId),
      logoUrl: fileUrl,
    };
    return this.partnersService.create(updatedDto);
  }

  @Get()
  findAll() {
    return this.partnersService.findAll();
  }

  @Get('company/:companyId')
  findByCompanyId(@Param('companyId') companyId: string){
    return this.partnersService.findByCompanyId(+companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.partnersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePartnerDto: UpdatePartnerDto) {
    return this.partnersService.update(+id, updatePartnerDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const partner = await this.partnersService.findOne(+id);
    if(!partner){
      throw new NotFoundException("Partner không tồn tại");
    }
    let fileName = partner.data?.logoUrl;
    if(!fileName){
      throw new NotFoundException('Không tìm thấy đường dẫn file');
    }
    const index = partner.data?.logoUrl.indexOf('/uploads/') || -1;
    if(index != -1){
      fileName = partner.data?.logoUrl.substring(index + '/uploads/'.length);
    }
    const filePath = join(__dirname, '..', '..', 'uploads', ''+fileName);
    if(existsSync(filePath)){
      try{
        await unlink(filePath);
      }catch(error){
        throw new InternalServerErrorException('Lỗi khi xóa file ảnh');
      }
    }
    return this.partnersService.remove(+id);
  }
}
