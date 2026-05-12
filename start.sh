#!/bin/sh

echo "Ejecutando migraciones..."
node -e "
const { Pool } = require('pg');
const fs = require('fs');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function migrate() {
  const sql = fs.readFileSync('./migrations/01.sql', 'utf8');
  await pool.query(sql);
  console.log('Migración completada');
  await pool.end();
}

migrate().catch(err => {
  console.error('Error en migración:', err.message);
  process.exit(1);
});
"

echo "Arrancando servidor..."
node server.js