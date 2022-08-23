import { Transform } from "class-transformer";
import {
    IsString,
    MaxLength,
    MinLength,
    IsAlpha,
    IsDate,
    MinDate,
    IsNotEmpty,
} from "class-validator";

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

export class ClassCreateDto {
    @IsAlpha()
    @MinLength(2)
    @MaxLength(50)
    @IsNotEmpty()
    name: string;

    @IsString()
    @MinLength(15)
    @MaxLength(50)
    @IsNotEmpty()
    description: string;

    @Transform(({ value }) => new Date(value))
    @IsDate()
    @MinDate(tomorrow)
    @IsNotEmpty()
    startDate: Date;

    @Transform(({ value }) => new Date(value))
    @IsDate()
    @MinDate(tomorrow)
    @IsNotEmpty()
    endDate: Date;
}
