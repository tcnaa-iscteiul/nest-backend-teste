import { Controller, Get, Body } from '@nestjs/common';
import { IMailGunData } from './interface/mail.interface';
import { MailService } from './mail.service';

@Controller('email')
export class MailController {
    constructor(private mailService: MailService) { }

    @Get()
    async send(@Body()data: IMailGunData) {
        return await this.mailService.send(data);
    }
}