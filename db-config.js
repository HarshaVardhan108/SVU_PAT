// Database configuration for local and Render
require('dotenv').config();

const isRender = !!process.env.DATABASE_URL;

module.exports = isRender ? {
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
} : {
  host: 'localhost',
  port: 5432,
  database: 'svu_pat',
  user: 'postgres',
  password: 'KEtMHmOZF6IIdqOojGM0SXZeCaID2VzE',
};
