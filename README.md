# Country Currency & Exchange API

A RESTful API built with NestJS that fetches country data from external APIs, stores it in a MySQL database, and provides CRUD operations with filtering, sorting, and image generation capabilities.

## Features

- Fetch country data from RestCountries API
- Fetch exchange rates from Open Exchange Rates API
- Calculate estimated GDP based on population and exchange rates
- CRUD operations for countries
- Filter by region and currency
- Sort by GDP, population, or name
- Generate and serve summary images
- Persistent MySQL database storage

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v16 or higher)
- npm or yarn
- MySQL (v5.7 or higher)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/CodeEnthusiast09/hng-internship-backend.git
cd hng-internship-backend
git checkout stage-2
```

2. Install dependencies:

```bash
npm install
```

3. Create a MySQL database:

```sql
CREATE DATABASE countries_api;
```

4. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the values in `.env`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password_here
DB_DATABASE=countries_api

PORT=3000
NODE_ENV=development

COUNTRIES_API_URL=https://restcountries.com/v2/all?fields=name,capital,region,population,flag,currencies
EXCHANGE_RATE_API_URL=https://open.er-api.com/v6/latest/USD
```

## Running the Application

### Development mode

```bash
npm run start:dev
```

### Production mode

```bash
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000`

## API Endpoints

### 1. Refresh Country Data

Fetches all countries and exchange rates, then caches them in the database.

**Endpoint:** `POST /countries/refresh`

**Response:**

```json
{
  "message": "Countries data refreshed successfully",
  "total": 250
}
```

### 2. Get All Countries

Retrieves all countries from the database with optional filters and sorting.

**Endpoint:** `GET /countries`

**Query Parameters:**

- `region` (optional) - Filter by region (e.g., `Africa`, `Europe`)
- `currency` (optional) - Filter by currency code (e.g., `NGN`, `USD`)
- `sort` (optional) - Sort results. Options:
  - `gdp_asc` / `gdp_desc`
  - `population_asc` / `population_desc`
  - `name_asc` / `name_desc`

**Examples:**

```bash
GET /countries?region=Africa
GET /countries?currency=NGN
GET /countries?sort=gdp_desc
GET /countries?region=Africa&sort=population_desc
```

**Response:**

```json
[
  {
    "id": 1,
    "name": "Nigeria",
    "capital": "Abuja",
    "region": "Africa",
    "population": 206139589,
    "currencyCode": "NGN",
    "exchangeRate": 1600.23,
    "estimatedGdp": 25767448125.2,
    "flagUrl": "https://flagcdn.com/ng.svg",
    "lastRefreshedAt": "2025-10-22T18:00:00Z"
  }
]
```

### 3. Get Single Country

Retrieves a specific country by name.

**Endpoint:** `GET /countries/:name`

**Example:**

```bash
GET /countries/Nigeria
```

**Response:**

```json
{
  "id": 1,
  "name": "Nigeria",
  "capital": "Abuja",
  "region": "Africa",
  "population": 206139589,
  "currencyCode": "NGN",
  "exchangeRate": 1600.23,
  "estimatedGdp": 25767448125.2,
  "flagUrl": "https://flagcdn.com/ng.svg",
  "lastRefreshedAt": "2025-10-22T18:00:00Z"
}
```

### 4. Delete Country

Deletes a country record from the database.

**Endpoint:** `DELETE /countries/:name`

**Example:**

```bash
DELETE /countries/Nigeria
```

**Response:**

```json
{
  "message": "Country deleted successfully"
}
```

### 5. Get Status

Shows total countries and last refresh timestamp.

**Endpoint:** `GET /status`

**Response:**

```json
{
  "total_countries": 250,
  "last_refreshed_at": "2025-10-22T18:00:00Z"
}
```

### 6. Get Summary Image

Serves the generated summary image containing total countries, top 5 by GDP, and timestamp.

**Endpoint:** `GET /countries/image`

**Response:** PNG image file

## Error Responses

The API returns consistent JSON error responses:

### 400 Bad Request

```json
{
  "error": "Validation failed",
  "details": {
    "currency_code": "is required"
  }
}
```

### 404 Not Found

```json
{
  "error": "Country not found"
}
```

### 500 Internal Server Error

```json
{
  "error": "Internal server error"
}
```

### 503 Service Unavailable

```json
{
  "error": "External data source unavailable",
  "details": "Could not fetch data from [API name]"
}
```

## Technologies Used

- **NestJS** - Progressive Node.js framework
- **TypeORM** - ORM for TypeScript and JavaScript
- **MySQL** - Relational database
- **Axios** - HTTP client for API requests
- **Canvas** - Image generation library
- **Class Validator** - Validation decorators

## Currency Handling

The API handles various currency scenarios:

1. **Multiple currencies**: Only the first currency code is stored
2. **No currencies**: Sets `currency_code`, `exchange_rate` to `null` and `estimated_gdp` to `0`
3. **Missing exchange rate**: Sets `exchange_rate` and `estimated_gdp` to `null`

## Update Logic

When refreshing country data:

- Existing countries (matched by name, case-insensitive) are **updated**
- New countries are **inserted**
- The `estimated_gdp` is recalculated with a fresh random multiplier (1000-2000) on each refresh
- The global `last_refreshed_at` timestamp is updated

```

```
