import { Injectable } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';
// import { Movie } from '../movie/schemas/movie.schema';

@Injectable()
export class ElasticsearchService {
  private readonly client: Client;

  constructor() {
    this.client = new Client({ node: 'http://localhost:9200' }); // Change this to your Elasticsearch server URL
  }

  async indexFilm(movie: any): Promise<void> {
    await this.client.index({
      index: 'films',
      id: movie._id.toString(),
      body: movie,
    });
  }

  async updateFilm(movie: any): Promise<void> {
    await this.client.update({
      index: 'films',
      id: movie._id.toString(),
      body: {
        doc: movie,
      },
    });
  }

  async deleteFilm(filmId: string): Promise<void> {
    await this.client.delete({
      index: 'films',
      id: filmId,
    });
  }
}
