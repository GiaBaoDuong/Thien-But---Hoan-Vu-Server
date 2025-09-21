import { Controller, Get, Patch, Post, Body, Param, Delete, UploadedFile, UseInterceptors, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { BrandService } from './brand.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { existsSync } from 'fs';
import { unlink } from 'fs/promises';

@Controller('brand')
export class BrandController {
    constructor(private readonly brandService : BrandService ){}
    
    @Post('upload')
    @UseInterceptors(FileInterceptor('file',{
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
                return cb(new Error('Chỉ hỗ trợ upload file ảnh (jpeg, jpg, png, gif)!'), false);
        }
        cb(null,true);
    },
    limits: { fileSize: 5 * 1024 * 1024 } // giới hạn kích thước file tối đa 5MB
    }))
    async createBrandWithFile(
        @UploadedFile() file: Express.Multer.File,
        @Body() createBrandDto: CreateBrandDto,
    ){
        const baseUrl = process.env.BASE_URL || 'http://localhost:8080';
        const fileUrl = `${baseUrl}/uploads/${file.filename}`;
        
        // gán fileUrl vào trường url của DTO
        const updatedDto: CreateBrandDto = {
            ...createBrandDto,
            companyId: Number(createBrandDto.companyId),
            logoUrl: fileUrl,
            
        };
        return this.brandService.create(updatedDto);
    }

    @Get()
    findAll(){
        return this.brandService.findAll();
    }

    @Get('company/:companyId')
    findByCompanyId(@Param('companyId') companyId: string){
        return this.brandService.findByCompanyId(+companyId);
    }

    @Get(':id')
    findOne(@Param('id') id: string){
        return this.brandService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto){
        return this.brandService.update(+id, updateBrandDto);
    }
    
}