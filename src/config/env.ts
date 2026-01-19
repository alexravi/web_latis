import { z } from 'zod';

// Define environment variable schema - all optional for flexibility
const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url().optional().or(z.literal('')),
  VITE_FIREBASE_API_KEY: z.string().optional(),
  VITE_FIREBASE_AUTH_DOMAIN: z.string().optional(),
  VITE_FIREBASE_PROJECT_ID: z.string().optional(),
  VITE_FIREBASE_STORAGE_BUCKET: z.string().optional(),
  VITE_FIREBASE_MESSAGING_SENDER_ID: z.string().optional(),
  VITE_FIREBASE_APP_ID: z.string().optional(),
  VITE_FIREBASE_MEASUREMENT_ID: z.string().optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).optional().default('development'),
  MODE: z.string().optional(),
});

// Validate environment variables - lenient in development
const validateEnv = () => {
  try {
    // Use passthrough to allow extra properties
    return envSchema.passthrough().parse(import.meta.env);
  } catch (error) {
    // Only throw in production, warn in development
    if (import.meta.env.PROD) {
      if (error instanceof z.ZodError) {
        const missingVars = error.errors.map((e) => e.path.join('.')).join(', ');
        throw new Error(
          `Missing or invalid environment variables: ${missingVars}\n` +
          'Please check your .env file and ensure all required variables are set.'
        );
      }
      throw error;
    } else {
      // In development, just log a warning
      console.warn('Environment variable validation warning:', error);
      // Return a safe default
      return import.meta.env;
    }
  }
};

// Export validated environment variables
export const env = validateEnv();

// Type-safe environment variable access
export const getEnvVar = (key: keyof z.infer<typeof envSchema>): string | undefined => {
  return env[key] as string | undefined;
};
