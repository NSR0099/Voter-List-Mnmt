import pool from './db.js';

const migrateDb = async () => {
    const client = await pool.connect();
    try {
        console.log("Migrating database for OTP support...");

        // Add OTP columns to blo_users if they don't exist
        await client.query(`
            ALTER TABLE blo_users 
            ADD COLUMN IF NOT EXISTS otp_code VARCHAR(6),
            ADD COLUMN IF NOT EXISTS otp_expires_at TIMESTAMP;
        `);

        console.log("Database migration successful.");

    } catch (err) {
        console.error("Error migrating database:", err);
    } finally {
        client.release();
        process.exit();
    }
};

migrateDb();
