import { IsString, IsNotEmpty, IsInt, Min, MaxLength, IsMongoId } from 'class-validator';

export class CreateReservationDto {
    @IsMongoId({ message: 'El ID del evento es incorrecto.' })
    @IsNotEmpty({ message: 'El ID del evento es requerido.' })
    readonly eventId!: string;

    @IsInt({ message: 'La cantidad de boletos debe ser un número entero.' })
    @Min(1, { message: 'Debes reservar al menos 1 boleto.' })
    readonly quantity!: number;
}