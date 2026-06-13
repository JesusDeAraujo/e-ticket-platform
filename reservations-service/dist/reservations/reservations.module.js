"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const passport_1 = require("@nestjs/passport");
const jwt_1 = require("@nestjs/jwt");
const reservations_service_1 = require("./reservations.service");
const reservations_controller_1 = require("./reservations.controller");
const reservation_entity_1 = require("./entities/reservation.entity");
const event_stock_entity_1 = require("./entities/event-stock.entity");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
const ioredis_1 = __importDefault(require("ioredis"));
let ReservationsModule = class ReservationsModule {
};
exports.ReservationsModule = ReservationsModule;
exports.ReservationsModule = ReservationsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([reservation_entity_1.Reservation, event_stock_entity_1.EventStock]),
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'clave-por-defecto-baja-seguridad',
                signOptions: { expiresIn: '1d' },
            }),
        ],
        controllers: [reservations_controller_1.ReservationsController],
        providers: [reservations_service_1.ReservationsService, jwt_strategy_1.JwtStrategy,
            {
                provide: 'REDIS_CLIENT',
                useFactory: () => {
                    return new ioredis_1.default({
                        host: process.env.REDIS_HOST || 'localhost',
                        port: Number(process.env.REDIS_PORT || '6379'),
                    });
                }
            }
        ],
        exports: ['REDIS_CLIENT'],
    })
], ReservationsModule);
//# sourceMappingURL=reservations.module.js.map