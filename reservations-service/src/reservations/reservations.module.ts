import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { Reservation } from './entities/reservation.entity';
import { EventStock } from './entities/event-stock.entity';
import { JwtStrategy } from './strategies/jwt.strategy';
import Redis from 'ioredis';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation, EventStock]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService, JwtStrategy,
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        return new Redis({
          host: process.env.REDIS_HOST || 'localhost',
          port: Number(process.env.REDIS_PORT || '6379'),
        })
      }
    }
  ],
  exports: ['REDIS_CLIENT'],
})
export class ReservationsModule {}