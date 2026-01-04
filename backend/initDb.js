import pool from './db.js';

const initDb = async () => {
    const client = await pool.connect();
    try {
        console.log("Initializing database...");

        // 1. BLO Users Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS blo_users (
                id SERIAL PRIMARY KEY,
                blo_id VARCHAR(50) UNIQUE NOT NULL,
                password VARCHAR(100) NOT NULL,
                name VARCHAR(100) NOT NULL,
                phone VARCHAR(20) NOT NULL
            );
        `);

        // 2. Voters Table (Forms)
        await client.query(`
            CREATE TABLE IF NOT EXISTS voters (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                name_english VARCHAR(100),
                relative_name VARCHAR(100),
                mobile VARCHAR(20) NOT NULL,
                aadhaar VARCHAR(20),
                gender VARCHAR(20),
                dob DATE,
                address TEXT,
                district VARCHAR(100),
                state VARCHAR(100),
                pin VARCHAR(10),
                disability VARCHAR(100),
                blo_id VARCHAR(50) REFERENCES blo_users(blo_id),
                status VARCHAR(20) DEFAULT 'Pending',
                is_verified BOOLEAN DEFAULT FALSE,
                submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // 3. Audit Logs Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS audit_logs (
                id SERIAL PRIMARY KEY,
                date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                action VARCHAR(100) NOT NULL,
                blo_id VARCHAR(50),
                status VARCHAR(50)
            );
        `);

        console.log("Tables created successfully.");

        // Seed Default BLO User
        const checkUser = await client.query("SELECT * FROM blo_users WHERE blo_id = $1", ['DEL123']);
        if (checkUser.rows.length === 0) {
            await client.query(`
                INSERT INTO blo_users (blo_id, password, name, phone)
                VALUES ($1, $2, $3, $4)
            `, ['DEL123', 'pass123', 'Rajesh Kumar', '9876543210']);
            console.log("Seeded default BLO user: DEL123 / pass123");
        } else {
            console.log("Default user already exists.");
        }

    } catch (err) {
        console.error("Error initializing database:", err);
    } finally {
        client.release();
        process.exit();
    }
};

initDb();
