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

export enum Role {
    Admin = "Admin",
    Student = "Student",
    Teacher = "Teacher",
}
export enum Status {
    Active = "Active",
    Pending = "Pending",
    Inactive = "Inactive",
}
export class UserSearchDto {
    @IsOptional()
    @IsMongoId()
    id: string;

    @IsOptional()
    @IsEmail()
    email: string;

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
