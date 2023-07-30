import { IsNotEmpty, IsString } from 'class-validator';
export class CreateRatingDto {
  @IsString()
  @IsNotEmpty({ message: 'movieId is required' })
  movieId: string;

  @IsString()
  @IsNotEmpty({ message: 'Rating is required' })
  rating: number;
}
