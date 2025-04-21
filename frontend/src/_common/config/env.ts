interface EnvConfig {
  API_URL: string;
  ENV: "production" | "development";
}

const ensure = <T>(name: string, envVar: T): T => {
  if (!envVar || typeof envVar !== typeof ("" as T)) {
    throw new Error(`Environment variable ${name} is not set.`);
  }
  return envVar;
};

export const envConfig: EnvConfig = {
  API_URL: ensure<string>("API_URL", import.meta.env.VITE_API_URL),
  ENV: ensure<"production" | "development">("ENV", import.meta.env.VITE_ENV),
};
