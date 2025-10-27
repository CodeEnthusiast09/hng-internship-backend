import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Country } from './entities/country.entity';
import { QueryCountriesDto } from './dto/query-countries.dto';
import { createCanvas } from 'canvas';
import * as fs from 'fs';
import * as path from 'path';
import { CountryApiResponse, ExchangeRate } from 'src/interfaces';
import { AxiosError } from 'axios';

@Injectable()
export class CountriesService {
  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async refreshCountries(): Promise<{ message: string; total: number }> {
    try {
      // Fetch countries data
      const countriesUrl = this.configService.get<string>('api.country') ?? '';

      // Fetch exchange rates
      const exchangeRateUrl =
        this.configService.get<string>('api.exchange_rate') ?? '';

      if (!countriesUrl || !exchangeRateUrl) {
        throw new HttpException(
          {
            error: 'Missing configuration',
            details: 'API URLs are not configured in environment variables',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const countriesResponse = await firstValueFrom(
        this.httpService.get<CountryApiResponse[]>(countriesUrl),
      );

      const countriesData = countriesResponse.data;

      const exchangeRateResponse = await firstValueFrom(
        this.httpService.get<ExchangeRate>(exchangeRateUrl),
      );

      const exchangeRates = exchangeRateResponse.data.rates;

      const currentTimestamp = new Date();
      let processedCount = 0;

      for (const countryData of countriesData) {
        const currencyCode = countryData.currencies?.[0]?.code ?? null;

        const exchangeRate = currencyCode
          ? (exchangeRates[currencyCode] ?? null)
          : null;

        let estimatedGdp: number | null;

        if (!currencyCode) {
          // Case A: no currencies -> per spec
          // currency_code = null, exchange_rate = null, estimated_gdp = 0
          estimatedGdp = 0;
        } else if (exchangeRate === null) {
          // Case B: currency_code exists but not found in exchange rates API -> per spec
          // exchange_rate = null, estimated_gdp = null
          estimatedGdp = null;
        } else {
          // exchangeRate exists; compute only if population present
          if (countryData.population) {
            const randomMultiplier = Math.random() * (2000 - 1000) + 1000;
            estimatedGdp =
              (countryData.population * randomMultiplier) / exchangeRate;
          } else {
            // population missing => can't compute; choose null (safer than leaving undefined)
            estimatedGdp = null;
          }
        }

        // Check if country exists (case-insensitive)
        const existingCountry = await this.countryRepository
          .createQueryBuilder('country')
          .where('LOWER(country.name) = LOWER(:name)', {
            name: countryData.name,
          })
          .getOne();

        const countryRecord = {
          name: countryData.name,
          capital: countryData.capital,
          region: countryData.region,
          population: countryData.population,
          currencyCode: currencyCode,
          exchangeRate: exchangeRate ?? undefined,
          estimatedGdp: estimatedGdp ?? undefined,
          flagUrl: countryData.flag,
          lastRefreshedAt: currentTimestamp,
        };

        if (existingCountry) {
          // Update existing country
          await this.countryRepository.update(
            existingCountry.id,
            countryRecord,
          );
        } else {
          // Insert new country
          await this.countryRepository.save(countryRecord);
        }

        processedCount++;
      }

      // Generate summary image
      await this.generateSummaryImage(currentTimestamp);

      return {
        message: 'Countries data refreshed successfully',
        total: processedCount,
      };
    } catch (error) {
      if (error instanceof Error && 'response' in error) {
        const axiosError = error as AxiosError;
        throw new HttpException(
          {
            error: 'External data source unavailable',
            details: `Could not fetch data from ${axiosError.config?.url || 'external API'}`,
          },
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }
      throw new HttpException(
        { error: 'Internal server error' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(queryDto: QueryCountriesDto): Promise<Country[]> {
    const queryBuilder = this.countryRepository.createQueryBuilder('country');

    // Apply filters
    if (queryDto.region) {
      queryBuilder.andWhere('country.region = :region', {
        region: queryDto.region,
      });
    }

    if (queryDto.currency) {
      queryBuilder.andWhere('country.currencyCode = :currency', {
        currency: queryDto.currency,
      });
    }

    // Apply sorting
    if (queryDto.sort) {
      const [field, direction] = queryDto.sort.split('_');
      const orderDirection = direction.toUpperCase() as 'ASC' | 'DESC';

      if (field === 'gdp') {
        queryBuilder.orderBy('country.estimatedGdp', orderDirection);
      } else if (field === 'population') {
        queryBuilder.orderBy('country.population', orderDirection);
      } else if (field === 'name') {
        queryBuilder.orderBy('country.name', orderDirection);
      }
    }

    return await queryBuilder.getMany();
  }

  async findOne(name: string): Promise<Country> {
    const country = await this.countryRepository
      .createQueryBuilder('country')
      .where('LOWER(country.name) = LOWER(:name)', { name })
      .getOne();

    if (!country) {
      throw new HttpException(
        { error: 'Country not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    return country;
  }

  async remove(name: string): Promise<{ message: string }> {
    const country = await this.findOne(name);
    await this.countryRepository.remove(country);
    return { message: 'Country deleted successfully' };
  }

  async getStatus(): Promise<{
    total_countries: number;
    last_refreshed_at: Date | null;
  }> {
    const totalCountries = await this.countryRepository.count();

    const lastRefreshed = await this.countryRepository
      .createQueryBuilder('country')
      .select('MAX(country.lastRefreshedAt)', 'lastRefreshed')
      .getRawOne<{ lastRefreshed: Date | null }>();

    return {
      total_countries: totalCountries,
      last_refreshed_at: lastRefreshed?.lastRefreshed || null,
    };
  }

  private async generateSummaryImage(timestamp: Date): Promise<void> {
    try {
      // Get total countries
      const totalCountries = await this.countryRepository.count();

      // Get top 5 countries by GDP
      const topCountries = await this.countryRepository.find({
        order: { estimatedGdp: 'DESC' },
        take: 5,
      });

      // Create canvas
      const width = 800;
      const height = 600;
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext('2d');

      // Background
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, width, height);

      // Title
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 32px Arial';
      ctx.fillText('Country Data Summary', 50, 60);

      // Total countries
      ctx.font = '24px Arial';
      ctx.fillText(`Total Countries: ${totalCountries}`, 50, 120);

      // Top 5 countries
      ctx.font = 'bold 28px Arial';
      ctx.fillText('Top 5 Countries by GDP', 50, 180);

      ctx.font = '20px Arial';
      let yPosition = 220;
      topCountries.forEach((country, index) => {
        const gdp = country.estimatedGdp
          ? new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              maximumFractionDigits: 0,
            }).format(Number(country.estimatedGdp))
          : 'N/A';

        ctx.fillText(`${index + 1}. ${country.name}: ${gdp}`, 70, yPosition);
        yPosition += 40;
      });

      // Timestamp
      ctx.font = '18px Arial';
      ctx.fillStyle = '#aaaaaa';
      ctx.fillText(
        `Last Refreshed: ${timestamp.toISOString()}`,
        50,
        height - 50,
      );

      // Ensure cache directory exists
      const cacheDir = path.join(process.cwd(), 'cache');
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      // Save image
      const buffer = canvas.toBuffer('image/png');
      const imagePath = path.join(cacheDir, 'summary.png');
      fs.writeFileSync(imagePath, buffer);
    } catch (error) {
      console.error('Error generating summary image:', error);
    }
  }

  getSummaryImage(): string {
    const imagePath = path.join(process.cwd(), 'cache', 'summary.png');

    if (!fs.existsSync(imagePath)) {
      throw new HttpException(
        { error: 'Summary image not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    return imagePath;
  }
}
