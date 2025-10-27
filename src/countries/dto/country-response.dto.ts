import { Expose } from 'class-transformer';
import { Country } from '../entities/country.entity';

export class CountryResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  capital: string | null;

  @Expose()
  region: string | null;

  @Expose()
  population: number;

  @Expose()
  currency_code: string | null;

  @Expose()
  exchange_rate: number | null;

  @Expose()
  estimated_gdp: number | null;

  @Expose()
  flag_url: string | null;

  @Expose()
  last_refreshed_at: Date | null;

  constructor(entity: Country) {
    this.id = entity.id;
    this.name = entity.name;
    this.capital = entity.capital;
    this.region = entity.region;
    this.population = Number(entity.population);
    this.currency_code = entity.currencyCode;
    this.exchange_rate = entity.exchangeRate
      ? Number(entity.exchangeRate)
      : null;
    this.estimated_gdp = entity.estimatedGdp
      ? Number(entity.estimatedGdp)
      : null;
    this.flag_url = entity.flagUrl;
    this.last_refreshed_at = entity.lastRefreshedAt;
  }
}
