import { Controller, Get, Post, Body, Param, Delete, UploadedFile, UseInterceptors, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { BannerService } from './banner.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { CreateBannerDto } from './dto/create-banner.dto';
import { existsSync } from 'fs';
import { unlink } from 'fs/promises';

@Controller('banner')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads', // lưu file vào thư mục uploads
      filename: (req, file, cb) => {
        // Sinh tên file duy nhất sử dụng UUID
        const uniqueSuffix = uuidv4();
        const fileExtName = extname(file.originalname);
        cb(null, `${uniqueSuffix}${fileExtName}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      // Chỉ cho phép upload các file ảnh (jpeg, jpg, png, gif)
      if (!file.mimetype.match(/\/(jpeg|jpg|png|gif)$/)) {
        return cb(new Error('Chỉ hỗ trợ upload file ảnh (jpeg, jpg, png, gif)!'), false);
      }
      cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 } // giới hạn kích thước file tối đa 5MB
  }))
  async createBannerWithFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() createBannerDto: CreateBannerDto,
  ) {
    // Xây dựng URL cho file đã tải lên (BASE_URL nên được đặt trong .env, mặc định sử dụng localhost nếu chưa có)
    const baseUrl = process.env.BASE_URL || 'http://localhost:8080';
    const fileUrl = `${baseUrl}/uploads/${file.filename}`;

    // Gán fileUrl vào trường url của DTO
    const updatedDto: CreateBannerDto = {
      ...createBannerDto,
      companyId: Number(createBannerDto.companyId),
      imageUrl: fileUrl,   // <-- gán file upload vào imageUrl
    };

    return this.bannerService.create(updatedDto);
  }

  @Get()
  findAll() {
    return this.bannerService.findAll();
  }
  @Get('company/:companyId')
  findByCompanyId(@Param('companyId') companyId: string) {
    return this.bannerService.findByCompanyId(+companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bannerService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateBannerDto: UpdateBannerDto) {
  //   return this.bannerService.update(+id, updateBannerDto);
  // }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const banner = await this.bannerService.findOne(+id);
    if (!banner) {
      throw new NotFoundException('Banner không tồn tại');
    }
    let fileName = banner.data?.imageUrl;
    if (!fileName) {
      throw new NotFoundException('Không tìm thấy đường dẫn file');
    }
    const index = banner.data?.imageUrl.indexOf('/uploads/')||-1;
    if (index !== -1) {
      fileName = banner.data?.imageUrl.substring(index + '/uploads/'.length);
    }
    const filePath = join(__dirname, '..', '..', 'uploads', ''+fileName);
    if (existsSync(filePath)) {
      try {
        await unlink(filePath);
      } catch (error) {
        throw new InternalServerErrorException('Lỗi khi xóa file ảnh');
      }
    }
    return this.bannerService.remove(+id);
  }
}
