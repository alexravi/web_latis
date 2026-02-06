import { z } from 'zod';

// Define environment variable schema for Vite build-time envs
const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url().optional(),
  VITE_FIREBASE_API_KEY: z.string(),
  VITE_FIREBASE_AUTH_DOMAIN: z.string(),
  VITE_FIREBASE_PROJECT_ID: z.string(),
  VITE_FIREBASE_STORAGE_BUCKET: z.string(),
  VITE_FIREBASE_MESSAGING_SENDER_ID: z.string(),
  VITE_FIREBASE_APP_ID: z.string(),
  VITE_FIREBASE_MEASUREMENT_ID: z.string().optional(),
  MODE: z.enum(['development', 'production', 'test']).optional(),
});

// Validate environment variables from import.meta.env only (static hosting)
const validateEnv = () => {
  const parsed = envSchema.safeParse(import.meta.env);

  if (!parsed.success) {
    console.error('❌ Invalid env vars:', parsed.error.flatten().fieldErrors);

    if (import.meta.env.MODE === 'production') {
      throw new Error('Missing required environment variables');
    }
  }

  return parsed.success ? parsed.data : ({} as z.infer<typeof envSchema>);
};

export const env = validateEnv();
export const getEnvVar = (key: keyof typeof env) => env[key];
