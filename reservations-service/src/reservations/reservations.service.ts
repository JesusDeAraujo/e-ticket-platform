import { BadRequestException, Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { EventStock } from './entities/event-stock.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import Redis from 'ioredis';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    private readonly dataSource: DataSource,
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis
  ) {}

  async create(createReservationDto: CreateReservationDto, userId: string): Promise<Reservation> {
    const { eventId, quantity } = createReservationDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const eventStock = await queryRunner.manager
        .createQueryBuilder(EventStock, 'eventStock')
        .setLock('pessimistic_write') 
        .where('eventStock.eventId = :eventId', { eventId })
        .getOne();

      if (!eventStock) {
        throw new NotFoundException('El evento especificado no existe en el registro de inventario.');
      }

      if (eventStock.stock < quantity) {
        throw new BadRequestException(
          `Inventario insuficiente. Quedan ${eventStock.stock} entradas disponibles y solicitaste ${quantity}.`
        );
      }

      eventStock.stock -= quantity;
      await queryRunner.manager.save(eventStock);

      const pricePerTicket = eventStock.price; 
      const totalPrice = pricePerTicket * quantity;

      const newReservation = queryRunner.manager.create(Reservation, {
        userId,
        eventId,
        quantity,
        totalPrice,
        status: 'CONFIRMED',
      });

      const savedReservation = await queryRunner.manager.save(newReservation);

      await queryRunner.commitTransaction();
      try {
        const eventPayLoad = {
          userId: savedReservation.userId,
          eventId: savedReservation.eventId,
          quantity: savedReservation.quantity,
          reservationId: savedReservation.id,
          totalPrice: savedReservation.totalPrice,
        };
        await this.redisClient.publish('order_created', JSON.stringify(eventPayLoad));
        console.log(` [Evento Emitido] Orden ${savedReservation.id} publicada en Redis.`);
      } catch (redisError) {
        console.error('Error al publicar el evento en Redis:', redisError);
      }

      return savedReservation;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<any[]> {
  return this.reservationRepository
    .createQueryBuilder('reservation')
    .leftJoinAndSelect(EventStock, 'eventStock', 'eventStock.eventId = reservation.eventId')
    .select([
      'reservation.id AS "id"',
      'reservation.userId AS "userId"',
      'reservation.eventId AS "eventId"',
      'eventStock.title AS "eventName"',
      'reservation.quantity AS "quantity"',
      'reservation.totalPrice AS "totalPrice"',
      'reservation.status AS "status"',
      'reservation.createdAt AS "createdAt"',
      'reservation.updatedAt AS "updatedAt"',
    ])
    .getRawMany();
  }
}
