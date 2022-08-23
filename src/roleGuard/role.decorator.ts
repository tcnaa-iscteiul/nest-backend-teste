import { SetMetadata } from "@nestjs/common";
import { Role } from "../users/dto/UserRole.dto";

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
