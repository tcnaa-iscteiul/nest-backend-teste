import { forwardRef, Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { UserModule } from "../users/user.module";
import { TokenController } from "./token.controller";
import { TokenService } from "./token.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Token, TokenSchema } from "./token.schema";
import { TokenRepository } from "./token.repository";

@Module({
    imports: [
        forwardRef(() => AuthModule),
        UserModule,
        MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
    ],
    controllers: [TokenController],
    providers: [TokenService, TokenRepository],
    exports: [TokenService, TokenRepository],
})
export class TokenModule { }
