/**
 * Environment Configuration & Validation
 * Centralizes all environment variable access and validation
 */

export interface EnvConfig {
  // Strapi Configuration
  strapi: {
    url: string;
    host: string;
    token: string;
  };

  // Social Media
  social: {
    instagramToken: string;
    whatsappNumber: string;
  };

  // Analytics
  analytics: {
    googleAnalyticsId?: string;
  };

  // Cloudflare (Optional)
  cloudflare?: {
    zoneId: string;
    apiToken: string;
    accountId?: string;
  };

  // Environment
  nodeEnv: 'development' | 'production' | 'test';
  isDevelopment: boolean;
  isProduction: boolean;
}

/**
 * Get environment variable or throw error if required and missing
 */
function getEnvVar(key: string, required: boolean = true): string | undefined {
  const value = process.env[key];

  if (required && !value) {
    throw new Error(
      `Missing required environment variable: ${key}\n` +
      `Please add it to your .env file. See .env.example for reference.`
    );
  }

  return value;
}

/**
 * Validate environment variables and return typed config
 */
export function validateEnv(): EnvConfig {
  // Required Strapi variables
  const strapiUrl = getEnvVar('NEXT_PUBLIC_STRAPI_URL');
  const strapiHost = getEnvVar('STRAPI_HOST');
  const strapiToken = getEnvVar('NEXT_PUBLIC_STRAPI_TOKEN');

  if (!strapiUrl || !strapiHost || !strapiToken) {
    throw new Error('Missing required Strapi configuration');
  }

  // Required social media variables
  const instagramToken = getEnvVar('NEXT_PUBLIC_INSTAGRAM_TOKEN');
  const whatsappNumber = getEnvVar('NEXT_PUBLIC_WHATSAPP_NUMBER');

  if (!instagramToken || !whatsappNumber) {
    throw new Error('Missing required social media configuration');
  }

  // Optional analytics
  const googleAnalyticsId = getEnvVar('NEXT_PUBLIC_GA_MEASUREMENT_ID', false);

  // Optional Cloudflare configuration
  const cloudflareZoneId = getEnvVar('CLOUDFLARE_ZONE_ID', false);
  const cloudflareApiToken = getEnvVar('CLOUDFLARE_API_TOKEN', false);
  const cloudflareAccountId = getEnvVar('CLOUDFLARE_ACCOUNT_ID', false);

  let cloudflare: EnvConfig['cloudflare'] = undefined;

  // Only require both zone ID and API token if one is provided
  if (cloudflareZoneId || cloudflareApiToken) {
    if (!cloudflareZoneId || !cloudflareApiToken) {
      throw new Error(
        'Cloudflare configuration incomplete!\n' +
        'Both CLOUDFLARE_ZONE_ID and CLOUDFLARE_API_TOKEN are required.\n' +
        'See .env.example for details.'
      );
    }

    cloudflare = {
      zoneId: cloudflareZoneId,
      apiToken: cloudflareApiToken,
      accountId: cloudflareAccountId,
    };
  }

  // Node environment
  const nodeEnv = (process.env.NODE_ENV || 'development') as EnvConfig['nodeEnv'];

  return {
    strapi: {
      url: strapiUrl,
      host: strapiHost,
      token: strapiToken,
    },
    social: {
      instagramToken,
      whatsappNumber,
    },
    analytics: {
      googleAnalyticsId,
    },
    cloudflare,
    nodeEnv,
    isDevelopment: nodeEnv === 'development',
    isProduction: nodeEnv === 'production',
  };
}

/**
 * Get validated environment configuration
 * Use this throughout your app instead of process.env
 */
export function getEnvConfig(): EnvConfig {
  try {
    return validateEnv();
  } catch (error) {
    console.error('❌ Environment configuration error:');
    console.error(error instanceof Error ? error.message : error);
    console.error('\n📖 See .env.example for required environment variables');
    process.exit(1);
  }
}

/**
 * Check if Cloudflare is configured
 */
export function isCloudflareConfigured(): boolean {
  return !!(
    process.env.CLOUDFLARE_ZONE_ID &&
    process.env.CLOUDFLARE_API_TOKEN
  );
}

/**
 * Get Cloudflare configuration or throw error
 */
export function getCloudflareConfig(): NonNullable<EnvConfig['cloudflare']> {
  const config = getEnvConfig();

  if (!config.cloudflare) {
    throw new Error(
      'Cloudflare is not configured!\n' +
      'Add CLOUDFLARE_ZONE_ID and CLOUDFLARE_API_TOKEN to your .env file.\n' +
      'See CLOUDFLARE_SETUP.md for setup instructions.'
    );
  }

  return config.cloudflare;
}

// Export individual getters for convenience
export const env = {
  get strapi() {
    return getEnvConfig().strapi;
  },
  get social() {
    return getEnvConfig().social;
  },
  get analytics() {
    return getEnvConfig().analytics;
  },
  get cloudflare() {
    return getEnvConfig().cloudflare;
  },
  get nodeEnv() {
    return getEnvConfig().nodeEnv;
  },
  get isDevelopment() {
    return getEnvConfig().isDevelopment;
  },
  get isProduction() {
    return getEnvConfig().isProduction;
  },
};
