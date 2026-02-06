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
  const isProduction = import.meta.env.MODE === 'production';

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const missingVars = Object.entries(fieldErrors)
      .filter(([, value]) => value && value.length > 0)
      .map(([key]) => key);

    console.error('❌ Invalid env vars:', fieldErrors);
    console.error('❌ Missing required vars:', missingVars);
    console.error(
      '❌ Available import.meta.env keys:',
      Object.keys(import.meta.env).filter((k) => k.startsWith('VITE_')),
    );

    const baseMessage = 'Invalid environment configuration';
    const details = [
      missingVars.length > 0 ? `Missing required variables: ${missingVars.join(', ')}` : null,
      parsed.error?.message ? `Zod error: ${parsed.error.message}` : null,
      isProduction ? 'Refusing to start in production with invalid env.' : null,
    ]
      .filter(Boolean)
      .join(' | ');

    throw new Error(details ? `${baseMessage} - ${details}` : baseMessage);
  }

  // At this point, parsing has succeeded and env is fully validated
  return parsed.data;
};

export const env = validateEnv();
export const getEnvVar = (key: keyof typeof env) => env[key];
