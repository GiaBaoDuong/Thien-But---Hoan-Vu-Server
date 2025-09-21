import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";


export class LoginDto { 

    @IsNotEmpty()
    @ApiProperty()
    username: string; //phoneNumber or email

    @IsNotEmpty()
    @ApiProperty()
    password: string;
}