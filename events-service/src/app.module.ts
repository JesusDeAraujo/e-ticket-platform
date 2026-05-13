import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/events_db'), //Por los momentos usaremos localhost
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}