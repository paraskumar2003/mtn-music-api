// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document } from 'mongoose';

// export type MongoUserDocument = MongoUser & Document;

// @Schema({ timestamps: true })
// export class MongoUser {
//     @Prop({ required: true })
//     username: string;

//     @Prop({ required: true })
//     email: string;

//     @Prop({ required: true })
//     password: string;

//     @Prop({ default: true })
//     isActive: boolean;

//     @Prop({ type: [String], default: [] })
//     roles: string[];
// }

// export const MongoUserSchema = SchemaFactory.createForClass(MongoUser);
