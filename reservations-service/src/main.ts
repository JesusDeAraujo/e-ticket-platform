import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors()

  const config = new DocumentBuilder()
    .setTitle('Reservations Service - E-Ticket Platform')
    .setDescription('Documentación de endpoints de entrada/salida')
    .setVersion('1.0')
    .addServer('http://localhost:3000/reservations', 'API Gateway Proxy')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));

  app.useGlobalFilters(new AllExceptionsFilter());

  app.connectMicroservice({
    transport: Transport.REDIS,
    options: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
    },
  });

  await app.startAllMicroservices();

  await app.listen(process.env.PORT || 3002);
  console.log('Microservicio de Reservas corriendo de forma HÍBRIDA (HTTP en puerto 3002 + Redis)');
}
bootstrap();