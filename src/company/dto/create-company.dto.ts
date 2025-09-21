// src/companies/dto/create-company.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import {
    IsString,
    IsNotEmpty,
    IsEmail,
    IsOptional,
    IsPhoneNumber,
} from 'class-validator';

export class CreateCompanyDto {

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name: string;

    // @IsString()
    // @IsNotEmpty()
    // @ApiProperty()
    // @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    //     message: 'Slug must be a valid URL-friendly string (e.g., ten-cong-ty)',
    // })
    // slug: string;

    // @IsOptional()
    // @ApiProperty()
    // @IsUrl({}, { message: 'Logo URL must be a valid URL' })
    // logoUrl?: string;

    @IsOptional()
    @ApiProperty()
    @IsEmail({}, { message: 'Email must be a valid email address' })
    email?: string;

    @ApiProperty()
    @IsOptional()
    avatarUrl?: string;

    @IsOptional()
    @ApiProperty()
    phoneNumber?: string;

    @IsOptional()
    @ApiProperty()
    @IsString()
    address?: string;
}