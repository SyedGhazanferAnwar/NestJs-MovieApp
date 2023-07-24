import { Model, Types } from 'mongoose';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Movie } from './schemas/movie.schema';
import { CreateMovieDto } from './dto/create-movie.dto';
import { CreateRatingDto } from './dto/create-rating.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ElasticsearchService } from '../elasticsearch/elasticsearch.service';

@Injectable()
export class MovieService {
  constructor(
    @InjectModel(Movie.name) private movieModel: Model<Movie>,
    private elasticsearchService: ElasticsearchService,
  ) {}

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const createdMovie = new this.movieModel(createMovieDto);
    const movie = await createdMovie.save();
    await this.elasticsearchService.indexFilm(movie);
    return movie;
  }

  async getAllMovies(): Promise<Movie[]> {
    return this.movieModel.find().lean(true);
  }
  async getMovieById(id): Promise<Movie> {
    if (!Types.ObjectId.isValid(id)) {
      throw new HttpException(
        'Invalid movieId. Please provide a valid ObjectId.',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.movieModel.findById(id);
  }
  async deleteMovieById(id: string): Promise<Movie> {
    const movie = await this.movieModel.findByIdAndRemove(id);
    if (movie) await this.elasticsearchService.deleteFilm(id);
    return movie;
  }

  async updateMovieById(id: string, item: CreateMovieDto): Promise<Movie> {
    const movie = await this.movieModel.findByIdAndUpdate(id, item, {
      new: true,
    });
    if (movie) await this.elasticsearchService.updateFilm(movie);
    return movie;
  }
  async rateMovie(createRatingDto: CreateRatingDto, user: any): Promise<Movie> {
    if (!Types.ObjectId.isValid(createRatingDto.movieId)) {
      throw new HttpException(
        'Invalid movieId. Please provide a valid ObjectId.',
        HttpStatus.BAD_REQUEST,
      );
    }
    const Movie = await this.movieModel.findById(createRatingDto.movieId);
    if (!Movie) {
      throw new HttpException('Movie not found.', HttpStatus.BAD_REQUEST);
    }

    // Ensure the user hasn't rated the Movie before
    const existingRating = Movie.ratings.find(
      (rating) => rating.userId === user.userId,
    );
    if (existingRating) {
      throw new HttpException(
        'You have already rated this Movie.',
        HttpStatus.BAD_REQUEST,
      );
    }

    Movie.ratings.push({
      userId: user.userId,
      rating: createRatingDto.rating,
    });
    await Movie.save();
    return Movie;
  }

  async commentOnMovie(
    createCommentDto: CreateCommentDto,
    user: any,
  ): Promise<Movie> {
    if (!Types.ObjectId.isValid(createCommentDto.movieId)) {
      throw new HttpException(
        'Invalid movieId. Please provide a valid ObjectId.',
        HttpStatus.BAD_REQUEST,
      );
    }
    const Movie = await this.movieModel.findById(createCommentDto.movieId);
    if (!Movie) {
      throw new HttpException('Movie not found.', HttpStatus.BAD_REQUEST);
    }

    Movie.comments.push({
      userId: user.userId,
      text: createCommentDto.text,
    });
    await Movie.save();
    return Movie;
  }
}
