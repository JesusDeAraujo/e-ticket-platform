import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

describe('EventsController', () => {
    let controller: EventsController;
    let service: EventsService;

    const mockEventsService = {
        findAll: jest.fn().mockResolvedValue([{ _id: '1', title: 'Evento Test' }]),
        findOne: jest.fn().mockResolvedValue({ _id: '1', title: 'Evento Test' }),
        create: jest.fn().mockResolvedValue({ _id: '123', title: 'Nuevo Evento' }),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
        controllers: [EventsController],
        providers: [
        {
            provide: EventsService,
            useValue: mockEventsService,
            },
        ],
    }).compile();

    controller = module.get<EventsController>(EventsController);
    service = module.get<EventsService>(EventsService);
    });

    it('debería estar definido', () => {
        expect(controller).toBeDefined();
    });

    it('debería llamar a service.create', async () => {
        const dto = { title: 'Nuevo Evento', location: 'Caracas', date: new Date(), price: 50, stock: 100 };
        await controller.create(dto);
        expect(service.create).toHaveBeenCalledWith(dto);
    });
});