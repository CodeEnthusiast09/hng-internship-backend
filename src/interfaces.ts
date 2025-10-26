export interface CountryApiResponse {
  name: string;
  capital: string;
  region: string;
  population: number;
  currencies: {
    code: string;
    name: string;
    symbol: string;
  }[];
  flag: string;
  independent: boolean;
}

export interface ExchangeRate {
  rates: Record<string, number>;
}

export interface ValidationErrorResponse {
  error?: string;
  message?: string | string[];
  statusCode?: number;
}

export interface ErrorDetails {
  [key: string]: string;
}

export interface ErrorResponse {
  error: string;
  details?: ErrorDetails;
}
