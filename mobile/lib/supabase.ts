import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://iyoipkiyerazvlayrmeh.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5b2lwa2l5ZXJhenZsYXlybWVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2ODM4MDYsImV4cCI6MjA5NDI1OTgwNn0.xjTxuFOzfiwKrF8BNjdfDWfL81ObbqD31qv6DDm87p4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
