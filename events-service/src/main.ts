import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors()
  
  const config = new DocumentBuilder()
    .setTitle('Events Service - E-Ticket Platform')
    .setDescription('Microservicio de gestión de eventos y tickets')
    .setVersion('1.0')
    .addServer('http://localhost:3000/events', 'API Gateway Proxy')
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

  await app.listen(3001);
  console.log('Microservicio de Eventos corriendo en el puerto 3001');
}
bootstrap();