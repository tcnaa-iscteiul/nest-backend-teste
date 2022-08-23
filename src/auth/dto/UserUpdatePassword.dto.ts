import {
    IsString,
    MinLength,
    IsOptional,
    IsMongoId,
} from "class-validator";

export class UserUpdatePasswordDto {
    @IsOptional()
    @IsMongoId()
    id: string;

    @IsString()
    token: string;

    @IsString()
    @MinLength(8)
    password: string;
}
