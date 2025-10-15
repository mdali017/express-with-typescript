import app from "./app";
import { config } from "./app/config/env";
import supabase from "./app/config/supabaseClient";

const startServer = async () => {
  try {
    console.log("🔍 Checking Supabase connection...");
    
    const { error } = await supabase.auth.getSession();

    if (error) {
      console.error("❌ Supabase connection failed:", error.message);
      process.exit(1);
    }

    console.log("✅ Supabase connection successful!");
    console.log(`📡 Starting server on port ${config.port}...`);

    const server = app.listen(config.port, () => {
      console.log(`🚀 Server is running on http://localhost:${config.port}`);
      console.log(`📍 Health check: http://localhost:${config.port}/`);
      console.log(`🔐 Auth API: http://localhost:${config.port}/api/auth`);
      console.log("✅ Connected to Supabase Database successfully!");
    });

    server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${config.port} is already in use!`);
        process.exit(1);
      } else {
        console.error('❌ Server error:', err);
        process.exit(1);
      }
    });

  } catch (err) {
    console.error("❌ Unexpected error while starting server:", err);
    process.exit(1);
  }
};

(async () => {
  await startServer();
})();