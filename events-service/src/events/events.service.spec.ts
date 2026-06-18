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

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
        providers: [
        EventsService,
        {
            provide: EventsRepository,
            useValue: mockEventsRepository,
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
});