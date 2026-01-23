import { defineConfig } from '@prisma/config';
import { config as loadEnv } from 'dotenv';

loadEnv({ path: '.env' });

const url = process.env.DATABASE_URL;

if (!url) {
  throw new Error('DATABASE_URL is missing. Set it in apps/backend/.env');
}

export default defineConfig({
  datasource: {
    url,
  },
});