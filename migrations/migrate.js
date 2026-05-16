#!/usr/bin/env node
/**
 * migrate.js
 * Crea el schema correspondiente a esta instancia y ejecuta la migración SQL.
 * Variable requerida: MIGRATION_FILE  ->  '01', '02' o '03'
 * El schema se llamará: schema01, schema02, schema03
 */

require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const migrationId = process.env.MIGRATION_FILE;

if (!migrationId) {
    console.error('MIGRATION_FILE no está definida. Valores válidos: 01, 02, 03');
    process.exit(1);
}

const schemaName = `schema${migrationId}`;
const sqlFile = path.join(__dirname, 'migrations', `${migrationId}.sql`);

if (!fs.existsSync(sqlFile)) {
    console.error(`No se encuentra el fichero de migración: ${sqlFile}`);
    process.exit(1);
}

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: false },
});

(async () => {
    const client = await pool.connect();
    try {
        console.log(`Creando schema '${schemaName}' si no existe...`);
        await client.query(`CREATE SCHEMA IF NOT EXISTS ${schemaName}`);

        await client.query(`SET search_path TO ${schemaName}`);

        console.log(`Ejecutando migracion ${migrationId}.sql en schema '${schemaName}'...`);
        const sql = fs.readFileSync(sqlFile, 'utf8');
        await client.query(sql);

        console.log(`Migracion ${migrationId}.sql completada en schema '${schemaName}'.`);
    } catch (err) {
        if (err.message.includes('already exists')) {
            console.log(`Schema/tablas ya existian, se omite la migracion.`);
        } else {
            console.error('Error durante la migracion:', err.message);
            process.exit(1);
        }
    } finally {
        client.release();
        await pool.end();
    }
})();
