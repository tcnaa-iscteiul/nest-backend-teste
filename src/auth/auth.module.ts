import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TokenModule } from "src/token/token.module";
import { AuthService } from "./auth.service";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "../users/user.module";
import { LocalStrategy } from "./strategy/local.strategy";
import { JwtStrategy } from "./strategy/jwt.strategy";
import { AuthRepository } from "./auth.repository";
import { AuthController } from "./auth.controller";
import { MailModule } from "../mail/mail.module";

@Module({
    imports: [
        ConfigModule.forRoot(),
        PassportModule,
        UserModule,
        TokenModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: {
                expiresIn: "30s",
            },
        }),
        MailModule
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, AuthRepository, JwtStrategy],
    exports: [JwtModule, AuthService, AuthRepository],
})
export class AuthModule {}
