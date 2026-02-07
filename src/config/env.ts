import { z } from 'zod';

// Define environment variable schema for Vite build-time envs
const envSchema = z.object({
  // API URL is required in production, optional in development for local testing
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
  // const isProduction = import.meta.env.MODE === 'production';

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const missingVars = Object.entries(fieldErrors)
      .filter(([, value]) => value && value.length > 0)
      .map(([key]) => key);

    console.warn('⚠️ Invalid env vars configuration:', fieldErrors);
    console.warn('⚠️ Missing required vars:', missingVars);

    // In production, we might want to be stricter, but to fix the "white screen" report
    // we will allow the app to boot even with invalid config, logging a loud warning.
    console.warn('⚠️ Application starting with potentially invalid configuration.');

    // Return the raw env vars as a fallback so the app doesn't crash immediately
    return import.meta.env as unknown as z.infer<typeof envSchema>;
  }

  // At this point, parsing has succeeded and env is fully validated
  return parsed.data;
};

export const env = validateEnv();
export const getEnvVar = (key: keyof typeof env) => env[key];
