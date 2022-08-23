import { Transform } from "class-transformer";
import {
    IsString,
    MaxLength,
    MinLength,
    IsAlpha,
    IsDate,
    MinDate,
    Validate,
    IsOptional,
    IsMongoId,
    IsNotEmpty,
} from "class-validator";

export class ClassUpdateDto {
    @IsOptional()
    @IsMongoId()
    @IsNotEmpty()
    id: string;

    @IsAlpha()
    @MinLength(2)
    @MaxLength(50)
    @IsNotEmpty()
    name: string;

    @IsOptional()
    @IsString()
    @MinLength(15)
    @MaxLength(50)
    @IsNotEmpty()
    description: string;

    @IsOptional()
    @Transform(({ value }) => new Date(value))
    @IsDate()
    @MinDate(new Date())
    @IsNotEmpty()
    startDate: Date;

    @IsOptional()
    @Transform(({ value }) => new Date(value))
    @IsDate()
    @Validate(MinDate, ["startDate"])
    @IsNotEmpty()
    endDate: Date;
}
