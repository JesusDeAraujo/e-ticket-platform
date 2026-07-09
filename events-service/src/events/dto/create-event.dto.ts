import { IsString, IsNotEmpty, IsDateString, IsNumber, Min, IsOptional, MaxLength, IsInt } from 'class-validator';
import { Transform } from 'class-transformer';
import sanitizeHtml from 'sanitize-html';

export class CreateEventDto {
    @IsString({ message: 'El titulo debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El titulo es de caracter obligatorio' })
    @MaxLength(100, { message: 'El titulo no puede tener mas de 100 caracteres' })
    @Transform(({ value }) => typeof value === 'string' ? sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }) : value)
    readonly title!: string;

    @IsString({ message: 'La descripcion debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'La descripcion es de caracter obligatorio' })
    @MaxLength(500, { message: 'La descripcion no puede tener mas de 500 caracteres' })
    @Transform(({ value }) => typeof value === 'string' ? sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }) : value)
    @IsOptional()
    readonly description?: string;

    @IsDateString({}, { message: 'El formato de la fecha debe ser YYYY-MM-DD' })
    @IsNotEmpty({ message: 'La fecha es de caracter obligatorio' })
    readonly date!: Date;

    @IsNumber({}, { message: 'El precio debe ser un número.' })
    @Min(0, { message: 'El precio mínimo no puede ser menor a 0.' })
    readonly price!: number;

    @IsInt({ message: 'El stock debe ser un número entero.' })
    @Min(0, { message: 'El stock mínimo debe ser 0.' })
    readonly stock!: number;
    }