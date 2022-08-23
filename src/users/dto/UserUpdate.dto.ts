import { Role, Status } from "../dto/UserSearch.dto";
import {
    IsString,
    MaxLength,
    MinLength,
    IsPhoneNumber,
    IsEnum,
    IsEmail,
    IsAlpha,
    IsOptional,
    IsMongoId,
} from "class-validator";

export class UserUpdateDto {
    @IsOptional()
    @IsMongoId()
    id?: string;

    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    password?: string;

    @IsOptional()
    @IsEnum(Role)
    role?: Role;

    @IsOptional()
    @IsEnum(Status)
    status?: Status;

    @IsOptional()
    @IsAlpha()
    @MinLength(2)
    @MaxLength(20)
    firstName?: string;

    @IsOptional()
    @IsAlpha()
    @MinLength(2)
    @MaxLength(20)
    lastName?: string;

    @IsOptional()
    @IsPhoneNumber("PT")
    phone: string;
}
