import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from "@nestjs/common"
import { Reflector } from "@nestjs/core";
import jwt_decode from "jwt-decode";
import { Status } from "../users/dto/UserStatus.dto";
import { UserService } from "../users/user.service";

@Injectable()
export class RolesGuard implements CanActivate {

    constructor(
        private reflector: Reflector,
        private userService: UserService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const token = context
                .getArgs()[0]
                .headers.authorization.split(" ")[1];
            const { email }:any = jwt_decode(token);

            const user = await this.userService.findEmail(email);

            const roles = this.reflector.get<string[]>("roles",
                context.getHandler());
            const total_roles = roles.filter(
                (role) => role === user.role && user.status === Status.Active);

            return total_roles.length >= 1;
        } catch (err) {
            new HttpException(
                {
                    errorMessage: "Missing Token",
                },
                HttpStatus.UNAUTHORIZED);
        }
    }
}
