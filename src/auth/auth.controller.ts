
import { Body, Controller, Get, HttpCode, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import { log } from 'console';
import { Public } from 'src/helper/public.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
    ) { }

    @Public()
    @Post('register')
    register(@Body() authDto: RegisterDto) {
        console.log(authDto)
        return this.authService.register(authDto)
    }

    @Post('login')
    @Public()
    login(@Body() loginDto: LoginDto) {
        console.log(loginDto)
        return this.authService.login(loginDto)
    }

}
