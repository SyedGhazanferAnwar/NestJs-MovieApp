import { IsNotEmpty, IsString } from 'class-validator';
export class CreateCommentDto {
  @IsString()
  @IsNotEmpty({ message: 'movieId is required' })
  movieId: string;

  @IsString()
  @IsNotEmpty({ message: 'text is required' })
  text: string;
}
