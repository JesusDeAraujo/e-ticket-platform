import { IsString, IsNotEmpty, IsInt, Min, MaxLength, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReservationDto {
    @ApiProperty({
        description: 'ID del evento que se desea reservar',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @IsMongoId({ message: 'El ID del evento es incorrecto.' })
    @IsNotEmpty({ message: 'El ID del evento es requerido.' })
    readonly eventId!: string;

    @ApiProperty({
        description: 'Cantidad de boletos que se desea reservar',
        example: 2,
        minimum: 1
    })
    @IsInt({ message: 'La cantidad de boletos debe ser un número entero.' })
    @Min(1, { message: 'Debes reservar al menos 1 boleto.' })
    readonly quantity!: number;
}