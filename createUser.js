// File: backend/createUser.js
const bcrypt = require('bcrypt');
const { pool } = require('./database');

async function createUser() {
  try {
    const email = 'test@123fakturera.se';
    const plainPassword = 'password123'; // ✅ Use this password for testing

    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    console.log('✅ Hashed password:', hashedPassword);

    const query = `
      INSERT INTO users (email, password, created_at)
      VALUES ($1, $2, NOW())
    `;
    await pool.query(query, [email, hashedPassword]);
    console.log('✅ User inserted successfully');
  } catch (error) {
    console.error('❌ Error inserting user:', error);
  } finally {
    await pool.end();
  }
}

createUser();

