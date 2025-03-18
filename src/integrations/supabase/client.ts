
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://bdcnhuddqsmiefzutpzq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkY25odWRkcXNtaWVmenV0cHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1Mjg3OTksImV4cCI6MjA1NzEwNDc5OX0.igg6hUPbfjKs9xG6IBRMzwSBLYRhIUB-EZYSme3Sx2I";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Add console.log for debugging
console.log('Supabase client initialized');
