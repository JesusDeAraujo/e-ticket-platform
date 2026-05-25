import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Event extends Document {
    @Prop({ required: true })
    title!: string;

    @Prop()
    description?: string;

    @Prop({ required: true })
    date!: Date;

    @Prop({ required: true })
    price!: number;

    @Prop({ required: true, min: 0 })
    stock!: number;
    }

export const EventSchema = SchemaFactory.createForClass(Event);