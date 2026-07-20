import { GatewayAuthMiddleware } from './auth.middleware';
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

describe('AuthMiddleware', () => {
    let middleware: GatewayAuthMiddleware;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction;
    let mockConfigService: Partial<ConfigService>;

    const CLAVE_SECRETA_TEST = 'mi-clave-secreta-para-pruebas';

    beforeEach(() => {
        mockConfigService = {
            get: jest.fn().mockReturnValue(CLAVE_SECRETA_TEST),
        };

        middleware = new GatewayAuthMiddleware(mockConfigService as ConfigService);

        mockRequest = {
            headers: {},
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as Partial<Response>;
        nextFunction = jest.fn();
    });

    it('should be defined', () => {
        expect(middleware).toBeDefined();
    });

    it('should allow access if token or credentials are valid', () => {
        const tokenValido = jwt.sign({ userId: 123 }, CLAVE_SECRETA_TEST);

        mockRequest.headers = { authorization: `Bearer ${tokenValido}` };
    
        middleware.use(mockRequest as Request, mockResponse as Response, nextFunction);
    
        expect(nextFunction).toHaveBeenCalled();
    });
});