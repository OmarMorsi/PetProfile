import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://slizauyyxljgonlptgaz.supabase.co";
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsaXphdXl5eGxqZ29ubHB0Z2F6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3OTMwODksImV4cCI6MjA1NzM2OTA4OX0.n7F3whtqMxBiyQSHy9NQiULs2LCuE-iTxz-_Am5cX5Y";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
