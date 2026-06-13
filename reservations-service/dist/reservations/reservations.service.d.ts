import { DataSource, Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import Redis from 'ioredis';
export declare class ReservationsService {
    private readonly reservationRepository;
    private readonly dataSource;
    private readonly redisClient;
    constructor(reservationRepository: Repository<Reservation>, dataSource: DataSource, redisClient: Redis);
    create(createReservationDto: CreateReservationDto, userId: string): Promise<Reservation>;
    findAll(): Promise<Reservation[]>;
}
