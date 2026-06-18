import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsService } from './reservations.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { EventStock } from './entities/event-stock.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';

describe('ReservationsService', () => {
    let service: ReservationsService;

    const mockReservationRepository = {
    find: jest.fn(),
    };
    const mockEventStockRepository = {};

    const mockQueryRunner = {
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
        createQueryBuilder: jest.fn().mockReturnThis(),
        setLock: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        },
    };

    const mockDataSource = {
        createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
    };

    const mockRedisClient = {
        publish: jest.fn().mockResolvedValue(1),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
        providers: [
            ReservationsService,
            {
            provide: getRepositoryToken(Reservation),
            useValue: mockReservationRepository,
        },
        {
            provide: getRepositoryToken(EventStock),
            useValue: mockEventStockRepository,
        },
        {
            provide: DataSource,
            useValue: mockDataSource,
        },
        {
            provide: 'REDIS_CLIENT',
            useValue: mockRedisClient,
        },
        ],
    }).compile();

    service = module.get<ReservationsService>(ReservationsService);
    
    jest.clearAllMocks();
    });

    it('deberia estar definido', () => {
        expect(service).toBeDefined();
    });

    describe('create reservation', () => {
        const createDto = { eventId: 'evt-123', quantity: 2 };
        const userId = 'usr-999';

        it('debería crear una reservación exitosamente si hay suficiente stock', async () => {
        const mockStock = { eventId: 'evt-123', stock: 10 };
        const mockSavedReservation = {
            id: 'res-abc',
            userId,
            eventId: 'evt-123',
            quantity: 2,
            totalPrice: 100,
            status: 'CONFIRMED',
        };

        mockQueryRunner.manager.getOne.mockResolvedValue(mockStock);
        mockQueryRunner.manager.create.mockReturnValue(mockSavedReservation);
        mockQueryRunner.manager.save.mockResolvedValue(mockSavedReservation);

        const result = await service.create(createDto, userId);

        expect(result).toEqual(mockSavedReservation);
        expect(mockQueryRunner.connect).toHaveBeenCalled();
        expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
        expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
        expect(mockRedisClient.publish).toHaveBeenCalledWith(
        'order_created',
        expect.stringContaining('evt-123')
        );
    });

    it('debería lanzar NotFoundException si el evento no existe en el stock', async () => {
        mockQueryRunner.manager.getOne.mockResolvedValue(null);

        await expect(service.create(createDto, userId)).rejects.toThrow(NotFoundException);
        expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    });

    it('debería lanzar BadRequestException si el stock es insuficiente', async () => {
        const mockStock = { eventId: 'evt-123', stock: 1 }; //Queda un solo ticket, y pedimos 2
        mockQueryRunner.manager.getOne.mockResolvedValue(mockStock);

        await expect(service.create(createDto, userId)).rejects.toThrow(BadRequestException);
        expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    });
    });
});