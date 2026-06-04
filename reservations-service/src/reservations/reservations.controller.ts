import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller()
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createReservationDto: CreateReservationDto,
    @Req() req: any,
  ) {
    const userId = req.user.userId; 
    return this.reservationsService.create(createReservationDto, userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard) //Comentar para poder hacer pruebas sin autenticación
  findAll() {
    return this.reservationsService.findAll();
  }

  //ENDPOINT TEMPORAL PARA PRUEBAS LOCALES
  @Post('seed-stock')
  async seedStock(@Body() body: { eventId: string; stock: number }) {
    const { eventId, stock } = body;
    const entityManager = this.reservationsService['dataSource'].manager;
    const newStock = entityManager.create('EventStock', { eventId, stock });
    await entityManager.save('EventStock', newStock);
    return { message: `Stock de ${stock} unidades registrado para el evento ${eventId}` };
  }
}