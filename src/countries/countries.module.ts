import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { CountriesController, StatusController } from './countries.controller';
import { CountriesService } from './countries.service';
import { Country } from './entities/country.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Country]),
    HttpModule.register({
      timeout: 20000, // 10 seconds timeout
      maxRedirects: 5,
    }),
  ],
  controllers: [CountriesController, StatusController],
  providers: [CountriesService],
})
export class CountriesModule {}
