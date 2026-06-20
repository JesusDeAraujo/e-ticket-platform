import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateEventDto } from './dto/create-event.dto';
import { EventsRepository } from './events.repository';

@Injectable()
export class EventsService {
  constructor(
    private readonly repository: EventsRepository,
    @Inject('REDIS_SERVICE') private readonly redisClient: ClientProxy,
  ) {}

  async create(createEventDto: CreateEventDto) {
    const newEvent = await this.repository.create(createEventDto);
    this.redisClient.emit('event_created', {
      eventId: newEvent._id.toString(),
      title: newEvent.title,
      price: newEvent.price,
      stock: createEventDto.stock || 100,
    });
    return newEvent;
  }

  findAll() {
    return this.repository.findAll();
  }

  findOne(id: string) {
    return this.repository.findOne(id);
  }
}
//No implementamos metodos para borrar y actualizar