import dotenv from "dotenv";
import pkg from "pg";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envGlobalPath = path.resolve(__dirname, "../../.env.global");
if (fs.existsSync(envGlobalPath)) {
  dotenv.config({ path: envGlobalPath });
  console.log(`🔐 Loaded env from ${envGlobalPath}`);
} else {
  console.warn(
    `⚠️ .env.global not found at ${envGlobalPath}. Falling back to default dotenv lookup (process.cwd=${process.cwd()}).`
  );
  dotenv.config();
}

const { Pool } = pkg;

// Build pool config from DATABASE_URL, SUPABASE_DB_URL or individual env vars.
const dbConnectionString = process.env.SUPABASE_DB_URL;

if (dbConnectionString) {
  // mask for logs: hide password between '://' and '@' if present
  const masked = dbConnectionString.replace(/(:\/\/)(.*@)/, "$1***@");
  console.log(`🔗 Using DB connection string from env (masked): ${masked}`);
}

const poolConfig = dbConnectionString
  ? {
      connectionString: dbConnectionString,
      // Allow opt-in SSL (useful for Supabase). Set DB_SSL=true in .env if needed.
      ssl:
        process.env.DB_SSL === "true"
          ? { rejectUnauthorized: false }
          : undefined,
    }
  : {
      host: process.env.DB_HOST || "127.0.0.1",
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl:
        process.env.DB_SSL === "true"
          ? { rejectUnauthorized: false }
          : undefined,
    };

export const pool = new Pool(poolConfig);

export async function testConnection() {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("🟢 Conectado a la base de datos:", res.rows[0].now);
  } catch (err) {
    // Log a friendly, actionable message and don't rethrow so the server can still start.
    console.warn("⚠️ No se pudo conectar a la base de datos Postgres.");
    if (err && err.code === "ECONNREFUSED") {
      console.warn(
        "ECONNREFUSED - revisa que Postgres esté corriendo en la dirección configurada (host/port) o que la variable DATABASE_URL sea correcta."
      );
      console.warn(
        "Si usas una base de datos remota (Supabase), asegúrate de tener DATABASE_URL configurada en .env y, si corresponde, DB_SSL=true."
      );
    }
    console.warn("Detalles:", err && err.message ? err.message : err);
    // Don't throw — this keeps the app running for development without DB.
  }
}
