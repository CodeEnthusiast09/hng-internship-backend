import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { CountriesService } from './countries.service';
import { QueryCountriesDto } from './dto/query-countries.dto';
import { CountryResponseDto } from './dto/country-response.dto';

@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Post('refresh')
  async refresh() {
    return await this.countriesService.refreshCountries();
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() queryDto: QueryCountriesDto) {
    const countries = await this.countriesService.findAll(queryDto);
    return countries.map((country) => new CountryResponseDto(country));
  }

  @Get('image')
  getImage(@Res() res: Response) {
    const imagePath = this.countriesService.getSummaryImage();
    return res.sendFile(imagePath);
  }

  @Get(':name')
  async findOne(@Param('name') name: string) {
    const country = await this.countriesService.findOne(name);
    return new CountryResponseDto(country);
  }

  @Delete(':name')
  async remove(@Param('name') name: string) {
    return await this.countriesService.remove(name);
  }
}

@Controller('status')
export class StatusController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  async getStatus() {
    return await this.countriesService.getStatus();
  }
}
