import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from './schemas/events.schema';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventsRepository {
    constructor(@InjectModel(Event.name) private readonly eventModel: Model<Event>) {}

    async create(createEventDto: CreateEventDto): Promise<Event> {
        const newEvent = new this.eventModel(createEventDto);
        return newEvent.save();
    }

    async findAll(): Promise<Event[]> {
        return this.eventModel.find().exec();
    }

    async findOne(id: string): Promise<Event> {
        const event = await this.eventModel.findById(id).exec();
        if (!event) {
            throw new NotFoundException(`No se encontro el evento con el ID ${id}`);
        }

        return event;
    }
}