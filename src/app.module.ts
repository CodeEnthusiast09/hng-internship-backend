import { Module } from '@nestjs/common';
import { CountriesModule } from './countries/countries.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { validate } from 'env.validation';
import { typeOrmAsyncConfig } from 'db/data-source';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [configuration],
      validate: validate,
    }),
    CountriesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
