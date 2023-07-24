import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MovieDocument = HydratedDocument<Movie>;

@Schema()
export class Movie {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  release_date: string;

  // For the sake of this project, we will assume we only have ticket prices in PKR
  @Prop()
  ticket_price: number;

  @Prop()
  country: string;

  @Prop()
  genre: string;

  @Prop()
  photo_uri: string;

  @Prop({ default: [] })
  ratings: { userId: string; rating: number }[]; // Array of objects to store user ratings

  @Prop({ default: [] })
  comments: { userId: string; text: string }[]; // Array of objects to store user comments
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
