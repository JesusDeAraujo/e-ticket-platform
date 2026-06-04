import { IsMongoId, IsString, IsNumber, Min, IsNotEmpty } from 'class-validator';

export class CreateReservationDto {
    @IsNotEmpty()
    //@IsMongoId() 
    @IsString() //Usamos temporalmente @IsString para poder hacer las pruebas rapidas 
    readonly eventId!: string;

    @IsNumber()
    @Min(1, { message: 'Debes reservar al menos 1 ticket' })
    readonly quantity!: number
}