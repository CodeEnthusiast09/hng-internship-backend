export default () => ({
  NODE_ENV: process.env.NODE_ENV,

  port: parseInt(process.env.PORT || '3000'),

  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USERNAME,
    pass: process.env.DB_PASSWORD,
    name: process.env.DB_DATABASE,
  },

  api: {
    country: process.env.COUNTRIES_API_URL,
    exchange_rate: process.env.EXCHANGE_RATE_API_URL,
  },
});
