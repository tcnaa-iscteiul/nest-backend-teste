import {
    forwardRef,
    HttpException,
    HttpStatus,
    Inject,
    Injectable,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { User } from "../users/user.schema";
import { JwtPayload } from "./strategy/jwt-payload.interface";
import { UserRepository } from "../users/user.repository";
import { TokenRepository } from "../token/token.repository";
import { Status } from "../users/dto/UserStatus.dto";
import { UserUpdatePasswordDto } from "./dto/UserUpdatePassword.dto";
import { MailService } from "../mail/mail.service";
import {  UserSearchDto } from "../users/dto/UserSearch.dto";

@Injectable()
export class AuthRepository {
    constructor(
        private readonly userModel: UserRepository,
        private jwtService: JwtService,
        @Inject(forwardRef(() => TokenRepository))
        private tokenService: TokenRepository,
        private mailService: MailService
    ) { }

    async validateUser(
        email: string,
        password: string
    ): Promise<User | undefined> {
        const user = await this.userModel.findEmail(email);
        if (
            user &&
            (await bcrypt.compare(password, user.password)) &&
            user.status === Status.Active) {
            return user;
        }
        return null;
    }

    async login(user: any) {
        const { email } = user;
        const payload: JwtPayload = { email };
        const accessToken: string = await this.jwtService.sign(payload);
        const role = user.role;
        const status = user.status;
        const expireAt = new Date();

        expireAt.setDate(expireAt.getDate() + 1);

        const expired = expireAt.toISOString();
        this.tokenService.save(accessToken, email, expired);
        return { accessToken, role, status };
    }

    async loginToken(token: string) {
        const user = await this.tokenService.getUserByToken(token);
        if (user) {
            return this.login(user);
        } else {
            return new HttpException(
                {
                    errorMessage: "Invalid Token",
                },
                HttpStatus.UNAUTHORIZED);
        }
    }

    async changePassword(userUpdatePasswordDto: UserUpdatePasswordDto) {
        const { token, password } = userUpdatePasswordDto;

        const user = await this.tokenService.getUserByToken(token);
        if (user) {
            const salt = await bcrypt.genSalt(); //generate a salt
            const hashedPassword = await bcrypt.hash(password, salt); //hash the password with the salt
            user.password = hashedPassword;
            const response = await this.userModel.update(user);
            return response;
        } else {
            return new HttpException(
                {
                    errorMessage: "Invalid URL",
                },
                HttpStatus.UNAUTHORIZED);
        }
    }

    async forgotPassword(userSearch: UserSearchDto) {

        const user = await this.userModel.findEmail(userSearch.email);
        if (!user) {
            return new HttpException(
                {
                    errorMessage: "Invalid email",
                },
                HttpStatus.UNAUTHORIZED);
        }

        const { accessToken } = await this.login(user);
        const forgotLink = `http:localhost:3000/changePassword?token=${accessToken}`;

        await this.mailService.send({
            from: "noreply@schoolApplication.com",
            to: user.email,
            subject: 'Forgot Password',
            html: `
                <h3>Hello ${user.firstName}!</h3>
                <p>Please use this <a href="${forgotLink}">link</a> to reset your password.</p>
            `,
        });
    }
}
