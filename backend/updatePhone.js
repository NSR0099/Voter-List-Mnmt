import pool from './db.js';

const bloId = process.argv[2];
const newPhone = process.argv[3];

if (!bloId || !newPhone) {
    console.log("Usage: node updatePhone.js <BLO_ID> <NEW_PHONE_NUMBER>");
    console.log("Example: node updatePhone.js DEL123 +919876543210");
    process.exit(1);
}

const updatePhone = async () => {
    try {
        const res = await pool.query(
            "UPDATE blo_users SET phone = $1 WHERE blo_id = $2 RETURNING *",
            [newPhone, bloId]
        );

        if (res.rows.length > 0) {
            console.log(`✅ Success! Updated phone for ${bloId} to ${newPhone}`);
        } else {
            console.log(`❌ Error: User with BLO ID '${bloId}' not found.`);
        }
    } catch (err) {
        console.error("Database error:", err);
    } finally {
        pool.end();
    }
};

updatePhone();
