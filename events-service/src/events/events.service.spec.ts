import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { EventsRepository } from './events.repository';

describe('EventsService', () => {
    let service: EventsService;

    const mockEventsRepository = {
        findAll: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
    };

    const mockRedisService = {
        emit: jest.fn().mockImplementation(() => ({
            toPromise: jest.fn().mockResolvedValue(true),
            subscribe: jest.fn(),
        })),
        send: jest.fn().mockImplementation(() => ({
            toPromise: jest.fn().mockResolvedValue(true),
            subscribe: jest.fn(),
        })),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
        providers: [
        EventsService,
        {
            provide: EventsRepository,
            useValue: mockEventsRepository,
            },
            {
            provide: 'REDIS_SERVICE',
            useValue: mockRedisService,
            },
        ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    jest.clearAllMocks();
    });

    it('debería estar definido', () => {
    expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('debería retornar un arreglo de eventos desde el repositorio', async () => {
        const expectedEvents = [{ id: '1', title: 'Concierto Rock', location: 'Caracas' }];
        mockEventsRepository.findAll.mockResolvedValue(expectedEvents);

        const result = await service.findAll();
        expect(result).toEqual(expectedEvents);
        expect(mockEventsRepository.findAll).toHaveBeenCalled();
        });
    });

    describe('findOne', () => {
        it('debería retornar un evento específico si existe', async () => {
            const mockEvent = { id: '1', title: 'Concierto Rock' };
            mockEventsRepository.findOne.mockResolvedValue(mockEvent);

            const result = await service.findOne('1');
            
            expect(result).toEqual(mockEvent);
            expect(mockEventsRepository.findOne).toHaveBeenCalledWith('1');
        });
    });

    describe('create', () => {
        it('debería crear un evento y emitir la notificación a Redis', async () => {
            const createDto = {
                title: 'Nuevo Evento', 
                location: 'Caracas',
                date: new Date(),
                price: 50,
                stock: 100
            };
            const createdEvent = { _id: '123', ...createDto };
            
            mockEventsRepository.create.mockResolvedValue(createdEvent);

            const result = await service.create(createDto);

            expect(result).toEqual(createdEvent);
            expect(mockEventsRepository.create).toHaveBeenCalledWith(createDto);
            
            expect(mockRedisService.emit).toHaveBeenCalled();
        });
    });
});