require("dotenv").config({ path: "../.env" });

const db = require("./db");

async function testDB() {
  try {
    const [rows] = await db.query("SELECT DATABASE() AS db");
    console.log("MySQL Connected Successfully!", rows[0]);
  } catch (error) {
    console.log("Database Error:", error.message);
  } finally {
    await db.end();
  }
}

testDB();