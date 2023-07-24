import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Put,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { MovieService } from './movies.service';
import { Movie } from './schemas/movie.schema';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateRatingDto } from './dto/create-rating.dto';

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
  @Delete(':id')
  async deleteMovieById(@Param('id') id): Promise<Movie> {
    return this.movieService.deleteMovieById(id);
  }

  @Put(':id')
  updateMovieById(
    @Body() updateMovieDto: CreateMovieDto,
    @Param('id') id,
  ): Promise<Movie> {
    return this.movieService.updateMovieById(id, updateMovieDto);
  }

  @Post('rate')
  @UseGuards(AuthGuard)
  rateMovie(@Request() req, @Body() createRatingDto: CreateRatingDto) {
    return this.movieService.rateMovie(createRatingDto, req.user);
  }

  @Post('comment')
  @UseGuards(AuthGuard)
  commentOnFilm(@Request() req, @Body() createCommentDto: CreateCommentDto) {
    return this.movieService.commentOnMovie(createCommentDto, req.user);
  }
}
