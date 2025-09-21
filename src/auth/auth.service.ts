import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as agron2 from 'argon2';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto';
import { createResponse } from 'src/helper/response.helper';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    
    constructor(
        private prismaService: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService
    ) { }

    async register(registerDto: RegisterDto) {

        if (registerDto.password !== registerDto.repeatPassword) {
            throw new BadRequestException('Mật khẩu nhập lại không khớp');
        }

        const existingUser = await this.prismaService.user.findFirst({
            where: {
                OR: [
                    { phoneNumber: registerDto.phoneNumber },
                    { email: registerDto.email }
                ]
            }
        });

        if (existingUser) {
            if (existingUser.phoneNumber === registerDto.phoneNumber) {
                throw new ForbiddenException('Số điện thoại đã tồn tại');
            }
            if (existingUser.email === registerDto.email) {
                throw new ForbiddenException('email đã tồn tại');
            }
        }

            const hashPassword = await agron2.hash(registerDto.password);
        try { 
            const user = await this.prismaService.user.create({
                data: {
                    email: registerDto.email,
                    phoneNumber: registerDto.phoneNumber,
                    fullname: registerDto.fullname,
                    hashedPassword: hashPassword
                },
                select: {
                    id: true,
                    email: true,
                    phoneNumber: true,
                    fullname: true,
                    createdAt: true
                }
            })
            return createResponse(201, 'Đăng kí người dùng thàn công', {
                user: user,
                accessToken: await this.signJwtToken(
                    Number(user.id),
                    user.email ?? '',
                    user.phoneNumber ?? ''
                )
            })
        } catch (error) {
            throw new ForbiddenException('Đăng kí người dùng thất bại');
        }
     }

    async login(loginDto: LoginDto) { 

        let user = await this.prismaService.user.findFirst({
            where: {
                OR: [
                    { phoneNumber: /^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(loginDto.username) ? loginDto.username : undefined },
                    { email: /^\S+@\S+\.\S+$/.test(loginDto.username) ? loginDto.username : undefined }
                ]
            }
        });
        if (!user) {
            throw new UnauthorizedException('Thông tin đăng nhập không hợp lệ');
        }
        if (!await agron2.verify(user.hashedPassword, loginDto.password)) {
            throw new UnauthorizedException('Thông tin đăng nhập không hợp lệ');
        }

        const { hashedPassword, ...userWithoutPassword } = user;
        return createResponse(200, 'Đăng nhâp thành công', {
            user: userWithoutPassword,
            accessToken: await this.signJwtToken(
                Number(user.id),
                user.email ?? '',
                user.phoneNumber ?? ''
            )});
    }

    async signJwtToken(userId: number, email: string, phoneNumber: string) {
        
        const payload = { userId, email, phoneNumber };

        return this.jwtService.signAsync(payload,{
            secret: this.configService.get<string>('JWT_SECRET'),
            expiresIn: this.configService.get<string>('JWT_EXPIRES_IN')
        });
    }


}
