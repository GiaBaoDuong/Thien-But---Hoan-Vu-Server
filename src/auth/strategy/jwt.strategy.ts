import { ConfigService } from '@nestjs/config';
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor( 
        configService: ConfigService,
        private prismaService: PrismaService
    ) {
        const jwtSecret = configService.get<string>('JWT_SECRET');
        console.log("jwtSecret:", jwtSecret);
        if (!jwtSecret) {
            throw new Error('JWT_SECRET is not defined');
        }
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtSecret,
        });
    }

    async validate(payload: any) {
        const user = await this.prismaService.user.findUnique({
            where: {
                id: payload.userId
            },
            select: {
                id: true,
                email: true,
                phoneNumber: true,
                fullname: true,
                createdAt: true,
            }
        }); 
        return user;
    }
}
