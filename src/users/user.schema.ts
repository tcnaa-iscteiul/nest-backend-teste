import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Role } from "./dto/UserRole.dto";
import { Status } from "./dto/UserStatus.dto";

export type UserDocument = User & Document;

@Schema()
export class User {
    _id: string;

    @Prop({ unique: true, required: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true })
    role: Role.Teacher;

    @Prop({ required: true })
    status: Status.Active;

    @Prop({ required: true })
    firstName: string;

    @Prop({ required: true })
    lastName: string;

    @Prop({ required: true })
    phone: string;
}
export const UserSchema = SchemaFactory.createForClass(User);
