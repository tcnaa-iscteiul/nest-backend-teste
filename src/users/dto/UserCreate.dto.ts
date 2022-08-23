import {
    IsString,
    MaxLength,
    MinLength,
    IsPhoneNumber,
    IsEnum,
    IsEmail,
    IsAlpha,
} from "class-validator";
import { Role, Status } from "../dto/UserSearch.dto";

export class UserCreateDto {
    id: string;

    @IsEnum(Role)
    role: Role;

    @IsEnum(Status)
    status: Status;

    @IsAlpha()
    @MinLength(2)
    @MaxLength(20)
    firstName: string;

    @IsAlpha()
    @MinLength(2)
    @MaxLength(20)
    lastName: string;

    @IsPhoneNumber("PT")
    phone: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;
}
