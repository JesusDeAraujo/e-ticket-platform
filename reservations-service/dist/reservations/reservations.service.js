"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const reservation_entity_1 = require("./entities/reservation.entity");
const event_stock_entity_1 = require("./entities/event-stock.entity");
let ReservationsService = class ReservationsService {
    reservationRepository;
    dataSource;
    constructor(reservationRepository, dataSource) {
        this.reservationRepository = reservationRepository;
        this.dataSource = dataSource;
    }
    async create(createReservationDto, userId) {
        const { eventId, quantity } = createReservationDto;
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const eventStock = await queryRunner.manager
                .createQueryBuilder(event_stock_entity_1.EventStock, 'eventStock')
                .setLock('pessimistic_write')
                .where('eventStock.eventId = :eventId', { eventId })
                .getOne();
            if (!eventStock) {
                throw new common_1.NotFoundException('El evento especificado no existe en el registro de inventario.');
            }
            if (eventStock.stock < quantity) {
                throw new common_1.BadRequestException(`Inventario insuficiente. Quedan ${eventStock.stock} entradas disponibles y solicitaste ${quantity}.`);
            }
            eventStock.stock -= quantity;
            await queryRunner.manager.save(eventStock);
            const pricePerTicket = 50.00;
            const totalPrice = pricePerTicket * quantity;
            const newReservation = queryRunner.manager.create(reservation_entity_1.Reservation, {
                userId,
                eventId,
                quantity,
                totalPrice,
                status: 'CONFIRMED',
            });
            const savedReservation = await queryRunner.manager.save(newReservation);
            await queryRunner.commitTransaction();
            return savedReservation;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async findAll() {
        return this.reservationRepository.find();
    }
};
exports.ReservationsService = ReservationsService;
exports.ReservationsService = ReservationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(reservation_entity_1.Reservation)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource])
], ReservationsService);
//# sourceMappingURL=reservations.service.js.map