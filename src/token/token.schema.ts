import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type TokenDocument = Token & Document;

@Schema()
export class Token {
    id: string;

    @Prop()
    hash: string;

    @Prop()
    email: string;

    @Prop()
    expireAt: string;
}
export const TokenSchema = SchemaFactory.createForClass(Token);
