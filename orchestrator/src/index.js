import express from "express";
import dotenv from "dotenv";
import { testConnection } from "./db.js";
import instancesRouter from "./routes/instances.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const app = express();
app.use(express.json());

// Rutas
app.use("/instances", instancesRouter);

// Root route and health check
app.get("/", (req, res) => {
  res.json({ ok: true, app: process.env.APP_NAME || "orchestrator" });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

const port = process.env.PORT || 4000;

app.listen(port, async () => {
  await testConnection();
  console.log(`🚀 Orchestrator corriendo en http://localhost:${port}`);
});
