const { Pool } = require("pg");

const schemaName = `schema${process.env.MIGRATION_FILE}`;

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false,
});

const db = {
    connect: () => pool.connect(),
    query: async (text, params) => {
        const client = await pool.connect();
        // Fija el search_path en cada query para que apunte al schema correcto
        await client.query(`SET search_path TO ${schemaName}`);
        const result = await client.query(text, params);
        client.release();
        return result;
    },
    end: () => pool.end(),
};

module.exports = db;
