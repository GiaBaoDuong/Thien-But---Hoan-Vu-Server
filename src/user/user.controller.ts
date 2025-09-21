import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator/user.decorator';
import { JwtAuthGuard } from 'src/auth/guard';
import { createResponse } from 'src/helper/response.helper';

@Controller('users')
export class UserController {

    // @UseGuards(AuthGuard('jwt'))
    @UseGuards(JwtAuthGuard)
    @Get('me')
    @ApiBearerAuth()
    getMe(@GetUser() user: User) {
        return createResponse(200,'lấy thông tin người dùng thành công',user);
    }
}
