import { Module } from "@nestjs/common";
import { UserModule } from "./users/user.module";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";
import { ClassModule } from "./classes/class.module";
import { AuthModule } from "./auth/auth.module";

@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRoot(process.env.DB_URL),
        UserModule,
        ClassModule,
        AuthModule,
    ]
})
export class AppModule { }