import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Movie } from './schemas/movie.schema';
import { CreateMovieDto } from './dto/create-movie';

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
    return this.movieModel.findById(id);
  }
}
