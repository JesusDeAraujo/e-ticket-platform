import { Module, NestModule, MiddlewareConsumer} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import { GatewayAuthMiddleware } from './middleware/auth.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [GatewayAuthMiddleware],
})

export class AppModule implements NestModule {
  constructor(private readonly configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    const eventsUrl = this.configService.get<string>('EVENTS_SERVICE_URL');
    const reservationsUrl = this.configService.get<string>('RESERVATIONS_SERVICE_URL');

    consumer
  .apply(
    createProxyMiddleware({
      target: eventsUrl,
      changeOrigin: true,
      on: {
        //Correcion de la peticion colgada
        proxyReq: fixRequestBody, 
      },
    })
  )
  .forRoutes('events', 'events/(.*)');

    consumer
      .apply(
        GatewayAuthMiddleware,
        createProxyMiddleware({
          target: reservationsUrl,
          changeOrigin: true,
          on: {
            proxyReq: fixRequestBody, 
          },
        })
      )
      .forRoutes('reservations' , 'reservations/(.*)');
  }
}