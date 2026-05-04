import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

/* async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
 */

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  
  app.use(helmet());
  app.enableCors();

  
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Gateway corriendo en puerto: ${port}`);
}
bootstrap();