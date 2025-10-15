import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_KEY,
  backendUrl: process.env.BACKEND_URL,
  frontendUrl: process.env.FRONTEND_URL,
};
