interface EnvConfig {
  API_URL: string;
  ENV: 'production' | 'development';
  VITE_API_KEY: string;
  VITE_AUTH_DOMAIN: string;
  VITE_PROJECT_ID: string;
  VITE_STORAGE_BUCKET: string;
  VITE_MESSAGING_SENDER_ID: string;
  VITE_APP_ID: string;
  VITE_ALG_ID: string;
  VITE_ALG_SEACRH_API_KEY: string;
}

const ensure = (key: string): string => {
  const value = import.meta.env[key as keyof ImportMetaEnv];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set.`);
  }
  return value;
};

export const envConfig: EnvConfig = {
  API_URL: ensure('VITE_API_URL'),
  ENV: ensure('VITE_ENV') as 'production' | 'development',
  VITE_API_KEY: ensure('VITE_API_KEY'),
  VITE_AUTH_DOMAIN: ensure('VITE_AUTH_DOMAIN'),
  VITE_PROJECT_ID: ensure('VITE_PROJECT_ID'),
  VITE_STORAGE_BUCKET: ensure('VITE_STORAGE_BUCKET'),
  VITE_MESSAGING_SENDER_ID: ensure('VITE_MESSAGING_SENDER_ID'),
  VITE_APP_ID: ensure('VITE_APP_ID'),
  VITE_ALG_ID: ensure('VITE_ALG_ID'),
  VITE_ALG_SEACRH_API_KEY: ensure('VITE_ALG_SEARCH_API_KEY'),
};
