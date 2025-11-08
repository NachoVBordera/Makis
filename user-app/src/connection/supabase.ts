import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";
import { Database } from "../models/db_types";
import AsyncStorage from "@react-native-async-storage/async-storage";
const supabaseUrl = Constants?.expoConfig?.extra?.supabaseUrl;
const supabaseKey = Constants?.expoConfig?.extra?.supabaseAnonKey;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
