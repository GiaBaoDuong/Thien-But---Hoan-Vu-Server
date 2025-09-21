// src/banner/dto/create-banner.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsBoolean,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUrl,
} from 'class-validator';

export class CreateBannerDto {
    @ApiProperty({ description: 'Tiêu đề chính của banner'})
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ description: 'URL hình ảnh của banner'})
    imageUrl: string;

    

    @ApiProperty({ description: 'Trạng thái kích hoạt của banner', example: true, default: true, required: false })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @ApiProperty({ description: 'ID của công ty sở hữu banner', example: 1 })
    @Type(() => Number)
    @IsInt()
    companyId: number;
}