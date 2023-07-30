import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';
export class CreateMovieDto {
  @IsString()
  @IsNotEmpty({ message: 'name is required' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'description is required' })
  description?: string;

  @IsString()
  @IsNotEmpty({ message: 'release_date is required' })
  release_date?: string;

  @IsNumber()
  @IsNotEmpty({ message: 'ticket_price is required' })
  ticket_price?: number;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsNotEmpty({ message: 'genre is required' })
  genre: string;

  @IsString()
  @IsOptional()
  photo_uri?: string;
}
