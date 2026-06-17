import { Injectable, NestMiddleware, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; 
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class GatewayAuthMiddleware implements NestMiddleware {
    constructor(private readonly configService: ConfigService) {}
    
    use(req: Request, _res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedException('Acceso denegado, Token ausente o mal proporcionado.');
    }

    const token = authHeader.split(' ')[1];

    try {
        const secret = this.configService.get<string>('JWT_SECRET');

        if (!secret) {
            throw new InternalServerErrorException('La variable de entorno JWT_SECRET no esta configurada.');
        }

        const decoded = jwt.verify(token, secret);
        req['user'] = decoded; 
        next();

    } catch (error) {
        if (error instanceof InternalServerErrorException) {
            throw error;
        }
        throw new UnauthorizedException('Acceso denegado, Token no valido.');
        }
    }
}
