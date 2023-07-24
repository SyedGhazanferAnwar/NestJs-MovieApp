export class CreateMovieDto {
  name: string;
  description?: string;
  release_date?: string;
  ticket_price?: number;
  country?: string;
  genre?: string;
  photo_uri?: string;
}
