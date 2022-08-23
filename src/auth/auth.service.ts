import { Injectable } from "@nestjs/common";
import { UserSearchDto } from "../users/dto/UserSearch.dto";
import { User } from "../users/user.schema";
import { AuthRepository } from "./auth.repository";
import { UserUpdatePasswordDto } from "./dto/UserUpdatePassword.dto";

@Injectable()
export class AuthService {
    constructor(private authRepository: AuthRepository) { }

    async validateUser(email: string, password: string): Promise<User> {
        return await this.authRepository.validateUser(email,password);
    }

    async login(user: any) {
        return await this.authRepository.login(user);
    }

    async loginToken(token: string) {
        return await this.authRepository.loginToken(token);
    }

    async changePassword(userUpdatePasswordDto: UserUpdatePasswordDto) {
        return this.authRepository.changePassword(userUpdatePasswordDto);
    }

    async forgotPassword(user: UserSearchDto) {
        return this.authRepository.forgotPassword(user);
    }
}
