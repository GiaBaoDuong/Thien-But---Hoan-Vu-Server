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
export class CreatePartnerDto {
    @ApiProperty({ description: 'Tên của partner: ' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({description: 'URL hình ảnh của partner: '})
    logoUrl: string;

    @ApiProperty({description: 'Website của partner: ', required: false})
    @IsOptional()
    @IsString()
    websiteUrl?: string;

    @ApiProperty({description: 'Id công ty của partner: '})
    @Type(() => Number)
    @IsInt()
    companyId: number;



}
