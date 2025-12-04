import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    user: process.env.POSTGRES_USER || 'admin',
    host: process.env.POSTGRES_HOST || 'localhost',
    database: process.env.POSTGRES_DB || 'healthtwin_core',
    password: process.env.POSTGRES_PASSWORD || 'admin123',
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
});

export const query = (text: string, params?: any[]) => pool.query(text, params);

export const connectDB = async () => {
    try {
        const client = await pool.connect();
        console.log('Connected to PostgreSQL/TimescaleDB');
        client.release();
    } catch (err) {
        console.error('Database connection error', err);
        process.exit(1);
    }
};
