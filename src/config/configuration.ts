export default () => ({
  NODE_ENV: process.env.NODE_ENV,

  port: parseInt(process.env.PORT || '5432'),

  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USERNAME,
    pass: process.env.DB_PASSWORD,
    name: process.env.DB_DATABASE,
  },
});
