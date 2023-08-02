import type { Config } from 'drizzle-kit';
import 'dotenv/config';

export default {
  schema: './**/entities/*.entity.ts',
  out: './drizzle',
  driver: 'mysql2',
  dbCredentials: {
    host: process.env.HOST_MYSQL,
    user: process.env.USER_MYSQL,
    port: 3306,
    database: process.env.DB_MYSQL,
    password: process.env.PASS_MYSQL,
  },
} satisfies Config;
