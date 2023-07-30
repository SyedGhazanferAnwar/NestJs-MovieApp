import { Injectable } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';
import { Movie } from '../movie/schemas/movie.schema';

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
      body: {
        name: movie.name,
        description: movie.description,
        release_date: movie.release_date,
        ticket_price: movie.ticket_price,
        country: movie.country,
        genre: movie.genre,
        photo_uri: movie.photo_uri,
      },
    });
  }

  async updateFilm(movie: any): Promise<void> {
    await this.client.update({
      index: 'films',
      id: movie._id.toString(),
      body: {
        doc: {
          name: movie.name,
          description: movie.description,
          release_date: movie.release_date,
          ticket_price: movie.ticket_price,
          country: movie.country,
          genre: movie.genre,
          photo_uri: movie.photo_uri,
        },
      },
    });
  }

  async searchMovies(query: string, genre: string): Promise<any> {
    const response: any = await this.client.search({
      index: 'films',
      body: {
        query: {
          function_score: {
            query: {
              multi_match: {
                query,
                fields: ['name', 'description'],
                fuzziness: 'AUTO',
              },
            },
            functions: [
              {
                filter: {
                  term: {
                    genre,
                  },
                },
                weight: 2,
              },
              // If we want we can boost by director as well (Not in scope for this project)
              // {
              //   filter: {
              //     term: {
              //       director: directorName,
              //     },
              //   },
              //   weight: 3,
              // },
            ],
            boost_mode: 'sum', // Use the sum of query score and function scores
          },
        },
      },
    });
    console.log({ response });

    return response.hits.hits.map((hit) => hit._source);
  }

  async deleteFilm(filmId: string): Promise<void> {
    await this.client.delete({
      index: 'films',
      id: filmId,
    });
  }
}
