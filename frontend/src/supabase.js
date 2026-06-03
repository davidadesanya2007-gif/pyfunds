import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL;

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase =
  createClient(
    supabaseUrl,
    supabaseAnonKey
  );

/*
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://jiynnsanamrqmcezkzdd.supabase.co";

const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppeW5uc2FuYW1ycW1jZXpremRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzNDU5OTMsImV4cCI6MjA5MzkyMTk5M30.rQIytwd_5sbUcWftsjdBkvSG3Et7YbqqUPkwL0ySR2A";

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);
*/