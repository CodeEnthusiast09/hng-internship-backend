import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

interface CatFactResponse {
  fact: string;
  length: number;
}

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);
  private readonly CAT_FACT_API: string;
  private readonly userEmail: string;
  private readonly userName: string;
  private readonly userStack: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.CAT_FACT_API = this.configService.get<string>(
      'CAT_FACT_API_URL',
      'https://catfact.ninja/fact',
    );
    this.userEmail = this.configService.get<string>('USER_EMAIL', '');
    this.userName = this.configService.get<string>('USER_NAME', '');
    this.userStack = this.configService.get<string>('USER_STACK', '');
  }

  async getProfile() {
    const timestamp = new Date().toISOString();
    const fact = await this.fetchCatFact();

    return {
      status: 'success',
      user: {
        email: this.userEmail,
        name: this.userName,
        stack: this.userStack,
      },
      timestamp,
      fact,
    };
  }

  private async fetchCatFact(): Promise<string> {
    try {
      this.logger.log('Fetching cat fact from external API');

      const response = await firstValueFrom(
        this.httpService.get<CatFactResponse>(this.CAT_FACT_API),
      );

      return response.data.fact;
    } catch (error) {
      this.logger.error('Failed to fetch cat fact', error);

      if (error instanceof AxiosError) {
        if (error.code === 'ECONNABORTED') {
          return 'Unable to fetch cat fact: Request timeout';
        }
        if (error.response) {
          return `Unable to fetch cat fact: API returned ${error.response.status}`;
        }
      }

      return 'Unable to fetch cat fact at this time';
    }
  }
}
