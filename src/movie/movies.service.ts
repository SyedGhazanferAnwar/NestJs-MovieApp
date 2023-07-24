import { Model, Types } from 'mongoose';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Movie } from './schemas/movie.schema';
import { CreateMovieDto } from './dto/create-movie.dto';
import { CreateRatingDto } from './dto/create-rating.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class MovieService {
  constructor(@InjectModel(Movie.name) private movieModel: Model<Movie>) {}

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const createdMovie = new this.movieModel(createMovieDto);
    return createdMovie.save();
  }

  async getAllMovies(): Promise<Movie[]> {
    return this.movieModel.find().lean(true);
  }
  async getMovieById(id): Promise<Movie> {
    throw new HttpException(
      'Invalid movieId. Please provide a valid ObjectId.',
      HttpStatus.BAD_REQUEST,
    );
    return this.movieModel.findById(id);
  }
  async deleteMovieById(id: string): Promise<Movie> {
    return await this.movieModel.findByIdAndRemove(id);
  }

  async updateMovieById(id: string, item: CreateMovieDto): Promise<Movie> {
    return await this.movieModel.findByIdAndUpdate(id, item, { new: true });
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
