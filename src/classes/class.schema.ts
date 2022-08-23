import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import * as mongoose from "mongoose";

export type ClassDocument = Class & Document;

@Schema()
export class Class {
    @Prop()
    id: string;

    @Prop({ unique: true, required: true })
    name: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true, type: Date })
    startDate: Date;

    @Prop({ required: true })
    endDate: Date;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
    teacher: string;

    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: "User" }])
    students: [string];
}
export const ClassSchema = SchemaFactory.createForClass(Class);
