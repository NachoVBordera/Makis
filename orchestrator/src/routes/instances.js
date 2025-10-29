import express from "express";
import { pool } from "../db.js";

const router = express.Router();

// Crear instancia (nuevo schema)
router.get("/", async (req, res) => {
  // Simple response so clients don't hang — can be extended to list instances.
  res.json({ ok: true, message: "instances root" });
});

router.post("/create", async (req, res) => {
  //en un futuro se encripta el nombre y lo desencrita el bot de telegram
  const name = Math.random().toString(36).substring(2, 10);
  const schemaName = `instance_${Date.now()}`;
  console.log(`🧱 Creando schema: ${schemaName}`);

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(`CREATE SCHEMA ${schemaName};`);

    await client.query(`
      CREATE TABLE ${schemaName}.users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE ${schemaName}.messages (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES ${schemaName}.users(id),
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query(
      `
      INSERT INTO core.instances (name, schema_name, estado, created_at)
      VALUES ($1, $2, 'active', NOW());
    `,
      [name, schemaName]
    );

    await client.query("COMMIT");
    res.json({ ok: true, schema: schemaName });
    console.log("Esquema creado");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Error creando schema:", err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// Borrar instancia
router.delete("/:schema", async (req, res) => {
  const { schema } = req.params;
  if (!schema) return res.status(400).json({ error: "Falta schema" });

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(`DROP SCHEMA IF EXISTS ${schema} CASCADE;`);
    await client.query(
      `UPDATE core.instances SET estado='deleted', deleted_at=NOW() WHERE schema_name=$1;`,
      [schema]
    );
    await client.query("COMMIT");
    res.json({ ok: true, deleted: schema });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Error borrando schema:", err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

export default router;
