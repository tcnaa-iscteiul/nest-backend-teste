import { Controller, Post, Req, UseGuards, Body, Patch } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { UserCreateDto } from "../users/dto/UserCreate.dto";
import { UserSearchDto } from "../users/dto/UserSearch.dto";
import { UserService } from "../users/user.service";
import { AuthService } from "./auth.service";
import { UserUpdatePasswordDto } from "./dto/UserUpdatePassword.dto";

@Controller("auth")
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService
    ) { }

    @UseGuards(AuthGuard("local"))
    @Post()
    async login(@Req() req: any) {
        return await this.authService.login(req.user);
    }

    @Post("/create")
    async createUser(@Body() userCreateDto: UserCreateDto): Promise<void> {
        return await this.userService.create(userCreateDto);
    }

    @Patch("/changePassword")
    async changePassword(@Body() userUpdatePasswordDto: UserUpdatePasswordDto) {
        return await this.authService.changePassword(userUpdatePasswordDto);
    }

    @Post('/forgotPassword')
    async forgotPassword(@Body() user: UserSearchDto ) {
        return await this.authService.forgotPassword(user);
    }
}
