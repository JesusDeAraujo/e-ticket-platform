import { Test, TestingModule } from '@nestjs/testing';
import { EventsRepository } from './events.repository';
import { getModelToken } from '@nestjs/mongoose';
import { Event } from './schemas/events.schema';

describe('EventsRepository', () => {
    let repository: EventsRepository;

    const mockEventInstance = {
        save: jest.fn(),
    };

    const mockQuery = {
        exec: jest.fn(),
    };

    const mockModel = jest.fn().mockImplementation(() => mockEventInstance) as any;
    
    mockModel.find = jest.fn().mockReturnValue(mockQuery);
    mockModel.findById = jest.fn().mockReturnValue(mockQuery);

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EventsRepository,
                {
                    provide: getModelToken(Event.name),
                    useValue: mockModel,
                },
            ],
        }).compile();

        repository = module.get<EventsRepository>(EventsRepository);
        jest.clearAllMocks();
    });

    it('debería estar definido', () => {
        expect(repository).toBeDefined();
    });

    it('debería ejecutar find y retornar la lista de eventos', async () => {
        const mockData = [{ title: 'Concierto' }];
        mockQuery.exec.mockResolvedValue(mockData);

        const result = await repository.findAll();
        expect(result).toEqual(mockData);
        expect(mockModel.find).toHaveBeenCalled();
    });

    it('debería ejecutar findOne y retornar un evento', async () => {
        const mockData = { title: 'Concierto' };
        mockQuery.exec.mockResolvedValue(mockData);

        const result = await repository.findOne('id-123');
        expect(result).toEqual(mockData);
        expect(mockModel.findById).toHaveBeenCalledWith('id-123');
    });

    it('debería crear un evento nuevo simulando el constructor de Mongoose', async () => {
        const dto = { 
            title: 'Nuevo Concierto',
            date: new Date(),
            price: 100,
            stock: 50
        };
        const savedEvent = { id: 'evt-123', ...dto };

        mockEventInstance.save.mockResolvedValue(savedEvent);

        const result = await repository.create(dto);
        
        expect(result).toEqual(savedEvent);
        expect(mockModel).toHaveBeenCalledWith(dto);
        expect(mockEventInstance.save).toHaveBeenCalled();
    });
});