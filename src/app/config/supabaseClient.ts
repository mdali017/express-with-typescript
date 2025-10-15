import { createClient } from "@supabase/supabase-js";
import { config } from "./env";

const supabase = createClient(
  config.supabaseUrl as string,
  config.supabaseKey as string
);

export default supabase;
