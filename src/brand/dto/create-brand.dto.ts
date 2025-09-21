//src/brand/dto/create-brand.dto.ts 

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsBoolean,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUrl,
}from 'class-validator';

export class CreateBrandDto{
    @ApiProperty({description: 'Tên thương hiệu:'})
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'URL hình ảnh của thương hiệu'})
    logoUrl: string;

    @ApiProperty({ description: 'Slug của thương hiệu'})
    @IsOptional()
    @IsString()
    slug: string;

    @ApiProperty({ description : 'Id của công ty sở hữu Brand', required: false})
    @Type(() => Number)
    @IsInt()
    companyId: number;

}