import { ApiProperty } from "@nestjs/swagger/dist/decorators/api-property.decorator";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class RegisterDto {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    email: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    password: string;

    @IsNotEmpty()
    @ApiProperty()
    repeatPassword: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    fullname: string;

    @IsNotEmpty()
    @ApiProperty()
    phoneNumber: string;
}