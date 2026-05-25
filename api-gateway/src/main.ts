import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

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

//Proxy para el microservicio de eventos
  const eventsServiceUrl = configService.get<string>('EVENTS_SERVICE_URL');
  app.use(
    '/events',
    createProxyMiddleware({
      target: eventsServiceUrl,
      changeOrigin: true,
    }),
  );

  app.use(helmet());
  app.enableCors();

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      message: 'Limite de peticiones superado, intenta nuevamente mas tarde',
    }),
  );

  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);
  console.log(`Gateway corriendo en puerto: ${port}`);
}
bootstrap();