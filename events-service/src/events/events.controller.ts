import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller()
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post('')
  @UseGuards(JwtAuthGuard)
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }
}