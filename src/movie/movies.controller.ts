import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie';
import { MovieService } from './movies.service';
import { Movie } from './schemas/movie.schema';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Post()
  async create(@Body() createMovie: CreateMovieDto): Promise<Movie> {
    return this.movieService.create(createMovie);
  }
  @Get()
  async getAllMovies(): Promise<Movie[]> {
    return this.movieService.getAllMovies();
  }
  @Get(':id')
  async getMovieById(@Param('id') id: string): Promise<Movie> {
    return this.movieService.getMovieById(id);
  }
}
