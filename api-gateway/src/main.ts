import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('API Gateway - E-Ticket Platform')
    .setDescription('Punto de acceso unificado a los microservicios')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    explorer: true,
    swaggerOptions: {
      urls: [
        {
          url: 'http://localhost:3000/auth/api/schema/',
          name: 'Auth Service',
        },
        {
          url: 'http://localhost:3000/events/api/docs-json',
          name: 'Events Service',
        },
        {
          url: 'http://localhost:3000/reservations/api/docs-json',
          name: 'Reservations Service',
        },
      ],
    },
});

  //Proxy para el microservicio de autenticación
  const authServiceUrl = configService.get<string>('AUTH_SERVICE_URL');
  app.use(
    '/auth',
    createProxyMiddleware({
      target: authServiceUrl,
      changeOrigin: true,
      pathRewrite: { '^/auth': '' },
    }),
  );

  app.use(helmet({
    contentSecurityPolicy: false,
  }));

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      message: 'Limite de peticiones superado, intenta nuevamente mas tarde',
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);
  console.log(`Gateway corriendo en puerto: ${port}`);
  console.log(`Swagger UI disponible en: http://localhost:${port}/api/docs`);
}
bootstrap();