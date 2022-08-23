import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Class, ClassSchema } from "../classes/class.schema";
import { ClassController } from "../classes/class.controller";
import { ClassService } from "../classes/class.service";
import { ClassRepository } from "../classes/class.repository";
import { UserModule } from "../users/user.module";
import { forwardRef } from '@nestjs/common';

@Module({
    imports: [
        UserModule,
        MongooseModule.forFeature([
            { name: Class.name, schema: ClassSchema },
        ]),
        forwardRef(() => UserModule),
    ],
    controllers: [ClassController],
    providers: [
        ClassRepository,
        ClassService,
    ],
    exports:[ClassService]
})
export class ClassModule { }
