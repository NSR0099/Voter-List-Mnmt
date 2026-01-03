import pool from './db.js';

const bloId = process.argv[2];
const name = process.argv[3];
const phone = process.argv[4];

if (!bloId || !name || !phone) {
    console.log("Usage: node addUser.js <BLO_ID> <NAME> <PHONE>");
    console.log('Example: node addUser.js BLO-002 "Suman Singh" +919414084975');
    process.exit(1);
}

const addUser = async () => {
    try {
        // Check if exists
        const check = await pool.query("SELECT * FROM blo_users WHERE blo_id = $1", [bloId]);
        if (check.rows.length > 0) {
            console.log(`❌ User ${bloId} already exists.`);
            process.exit(1);
        }

        const res = await pool.query(
            "INSERT INTO blo_users (blo_id, password, name, phone) VALUES ($1, $2, $3, $4) RETURNING *",
            [bloId, 'pass123', name, phone]
        );

        console.log(`✅ Success! Added user: ${res.rows[0].blo_id} (${res.rows[0].name}) - ${res.rows[0].phone}`);
    } catch (err) {
        console.error("Database error:", err);
    } finally {
        pool.end();
    }
};

addUser();
