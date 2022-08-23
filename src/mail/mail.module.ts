import { Module } from "@nestjs/common";
import { MailerModule } from "@nestjs-modules/mailer";
import { MailService } from "./mail.service";
import { MailController } from "./mail.controller";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [
        ConfigModule.forRoot(),
        MailerModule.forRoot({
            transport: ({
                host: process.env.EMAIL_HOST ,
                port: process.env.EMAIL_PORT,
                auth: {
                    user: process.env.USER,
                    pass: process.env.PASS
                },
            })
        }),
    ],
    controllers: [MailController],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule { }