import { DataSource, Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
export declare class ReservationsService {
    private readonly reservationRepository;
    private readonly dataSource;
    constructor(reservationRepository: Repository<Reservation>, dataSource: DataSource);
    create(createReservationDto: CreateReservationDto, userId: string): Promise<Reservation>;
    findAll(): Promise<Reservation[]>;
}
