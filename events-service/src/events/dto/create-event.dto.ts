import { IsString, IsNotEmpty, IsDateString, IsNumber, Min, IsOptional } from 'class-validator';

export class CreateEventDto {
    @IsString()
    @IsNotEmpty({ message: 'El titulo no puede estar vacio' })
    readonly title!: string;

    @IsString()
    @IsOptional()
    readonly description?: string;

    @IsDateString()
    readonly date!: Date;

    @IsNumber()
    @Min(0)
    readonly price!: number;

    @IsNumber()
    @Min(0)
    readonly stock!: number;
    }