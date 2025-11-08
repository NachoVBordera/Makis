import { ExpoConfig, ConfigContext } from "expo/config";
import * as dotenv from "dotenv";

dotenv.config();

export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,
    slug: "mus",
    name: "Tuenti",
    extra: {
      ...config.extra,
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_KEY,
      eas: {
        projectId: "0e0c959e-18f6-4748-a83f-96e19d3ef1ac",
      },
    },
  };
};
