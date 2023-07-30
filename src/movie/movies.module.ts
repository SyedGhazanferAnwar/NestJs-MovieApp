import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MovieController } from './movies.controller';
import { MovieService } from './movies.service';
import { Movie, MovieSchema } from './schemas/movie.schema';
import { ElasticsearchService } from 'src/elasticsearch/elasticsearch.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }]),
  ],
  controllers: [MovieController],
  providers: [MovieService, ElasticsearchService],
})
export class MovieModule {}
