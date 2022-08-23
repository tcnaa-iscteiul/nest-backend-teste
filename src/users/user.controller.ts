import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    Patch,
    Delete,
    UseGuards,
    Query,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { UserCreateDto } from "./dto/UserCreate.dto";
import { UserUpdateDto } from "./dto/UserUpdate.dto";
import { UserSearchDto } from "./dto/UserSearch.dto";
import { User } from "./user.schema";
import { AuthGuard } from "@nestjs/passport";

@UseGuards(AuthGuard("jwt"))
@Controller("user")
export class UserController {
    constructor(private userService: UserService) { }

    @Get("/all")
    async getAllUsers(@Query() param: UserSearchDto): Promise<User[]> {
        if (Object.keys(param).length) {
            return this.userService.userSearch(param);
        } else {
            return this.userService.getAll();
        }
    }

    @Post()
    createUser(@Body() userCreateDto: UserCreateDto): Promise<void> {
        return this.userService.create(userCreateDto);
    }

    @Get("/:id")
    getUserById(@Param("id") id: string): Promise<User> {
        return this.userService.getUserById(id);
    }

    @Patch()
    updateUser(@Body() userUpdateDto: UserUpdateDto): Promise<void> {
        return this.userService.update(userUpdateDto);
    }

    @Delete()
    async deleteUser(@Body() param: UserUpdateDto) {
        return await this.userService.delete(param);
    }

    @Get()
    async getNrUsers(@Body() userUpdateDto: UserSearchDto) {
        return await this.userService.getNrUsers(userUpdateDto);
    }
}
