import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { MovieModule } from './movie/movies.module';
import { ElasticSearchModule } from './elasticsearch/elasticsearch.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_CONNECTION_STRING'),
      }),
    }),
    MovieModule,
    ElasticSearchModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
