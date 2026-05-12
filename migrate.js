#!/usr/bin/env node
/**
 * migrate.js
 * Ejecuta la migración SQL correspondiente a esta instancia de la API.
 * Se selecciona con la variable de entorno MIGRATION_FILE (01, 02 o 03).
 *
 * Uso en Render → Build Command:
 *   npm install && node migrate.js
 */

require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const migrationId = process.env.MIGRATION_FILE; // '01', '02' o '03'

if (!migrationId) {
  console.error('❌  MIGRATION_FILE no está definida. Valores válidos: 01, 02, 03');
  process.exit(1);
}

const sqlFile = path.join(__dirname, 'migrations', `${migrationId}.sql`);

if (!fs.existsSync(sqlFile)) {
  console.error(`❌  No se encuentra el fichero de migración: ${sqlFile}`);
  process.exit(1);
}

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false }, // requerido por Render Postgres
});

(async () => {
  const client = await pool.connect();
  try {
    console.log(`▶  Ejecutando migración ${migrationId}.sql …`);
    const sql = fs.readFileSync(sqlFile, 'utf8');
    await client.query(sql);
    console.log(`✅  Migración ${migrationId}.sql completada correctamente.`);
  } catch (err) {
    console.error('❌  Error durante la migración:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
})();
