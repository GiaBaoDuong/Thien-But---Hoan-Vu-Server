import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guard';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PrismaModule, JwtModule.register({}),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
      // {
      //   provide: APP_GUARD,
      //   useClass: JwtAuthGuard,
      // },
  ],
})
export class AuthModule {}
