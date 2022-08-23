import {
    Injectable,
    Inject,
    HttpException,
    HttpStatus,
    forwardRef,
    NotFoundException,
} from "@nestjs/common";
import { UserService } from "src/users/user.service";
import { AuthRepository } from "src/auth/auth.repository";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Token, TokenDocument } from "./token.schema";

@Injectable()
export class TokenRepository {
    constructor(
        @InjectModel(Token.name)
        private tokenModel: Model<TokenDocument>,
        private userService: UserService,
        @Inject(forwardRef(() => AuthRepository))
        private authService: AuthRepository
    ) { }

    async save(hash: string, email: string, expireAt: string) {
        const objToken = await this.tokenModel.findOne({ email: email });
    
        if (objToken) {
            await this.tokenModel.findOneAndUpdate(
                { id: objToken.id },
                {
                    hash,
                    expireAt
                },
                {
                    new: true,
                }
            )
        } else {
            await new this.tokenModel({
                hash: hash,
                email: email,
                expireAt
            }).save();
        }
    }

    async refreshToken(oldToken: string) {
        const objToken = await this.tokenModel.findOne({ hash: oldToken });
        if (objToken) {
            const user = await this.userService.findEmail(objToken.email);
            return this.authService.login(user);
        } else {
            return new HttpException(
                {
                    errorMessage: "Invalid Token",
                },
                HttpStatus.UNAUTHORIZED);
        }
    }

    async getUserByToken(oldToken: string) {
        const objToken = await this.tokenModel.findOne({ hash: oldToken });
        const today = new Date();
        today.setDate(today.getDate());
        if (objToken && today.getTime() <= new Date(objToken.expireAt).getTime()) {
            if (today.getTime() >= new Date(objToken.expireAt).getTime()) {
                return null;
            }
            const user = await this.userService.findEmail(objToken.email);
            return user;
        } else {
            return null;
        }
    }

    async deleteToken(token: string): Promise<void> {
        const result = await this.tokenModel.findOneAndDelete({
            token: token,
        });
        if (!result) {
            throw new NotFoundException(`Token with ID not found`);
        }
    }
}
