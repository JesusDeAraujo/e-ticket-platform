import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { EventsRepository } from './events.repository';
import { Event, EventSchema } from './schemas/events.schema';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || '',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [EventsController],
  providers: [EventsService, EventsRepository, JwtStrategy],
})
export class EventsModule {}
