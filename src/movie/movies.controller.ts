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
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { MovieService } from './movies.service';
import { Movie } from './schemas/movie.schema';
import { AuthGuard } from '../auth/auth.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateRatingDto } from './dto/create-rating.dto';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() createMovie: CreateMovieDto): Promise<Movie> {
    return this.movieService.create(createMovie);
  }
  @Get()
  @UsePipes(new ValidationPipe())
  async getAllMovies(): Promise<Movie[]> {
    return this.movieService.getAllMovies();
  }

  @Get('search')
  @UsePipes(new ValidationPipe())
  async searchMovies(
    @Query('query') query: string,
    @Query('genre') genre: string,
  ): Promise<any> {
    if (!query) {
      return [];
    }

    const results = await this.movieService.searchMovies(query, genre);
    return results;
  }

  @Get(':id')
  @UsePipes(new ValidationPipe())
  async getMovieById(@Param('id') id: string): Promise<Movie> {
    return this.movieService.getMovieById(id);
  }
  @Delete(':id')
  async deleteMovieById(@Param('id') id): Promise<Movie> {
    return this.movieService.deleteMovieById(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  updateMovieById(
    @Body() updateMovieDto: CreateMovieDto,
    @Param('id') id,
  ): Promise<Movie> {
    return this.movieService.updateMovieById(id, updateMovieDto);
  }

  @Post('rate')
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard)
  rateMovie(@Request() req, @Body() createRatingDto: CreateRatingDto) {
    return this.movieService.rateMovie(createRatingDto, req.user);
  }

  @Post('comment')
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard)
  commentOnFilm(@Request() req, @Body() createCommentDto: CreateCommentDto) {
    return this.movieService.commentOnMovie(createCommentDto, req.user);
  }
}
