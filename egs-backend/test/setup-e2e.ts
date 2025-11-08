import { config } from 'dotenv';

// Load .env.test for e2e tests
config({ path: '.env.test', quiet: true });
