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
    IsArray,
    IsNotEmpty,
} from "class-validator";

export class ClassSearchDto {
    @IsOptional()
    @IsMongoId()
    @IsNotEmpty()
    id: string;

    @IsOptional()
    @IsAlpha()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(50)
    name: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    @MinLength(15)
    @MaxLength(50)
    description: string;

    @IsOptional()
    @IsNotEmpty()
    @Transform(({ value }) => new Date(value))
    @IsDate()
    @MinDate(new Date())
    startDate: Date;

    @IsOptional()
    @IsNotEmpty()
    @Transform(({ value }) => new Date(value))
    @IsDate()
    @Validate(MinDate, ["startDate"])
    endDate: Date;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    teacher: string;

    @IsOptional()
    @IsNotEmpty()
    @IsArray()
    students: string[];
}
