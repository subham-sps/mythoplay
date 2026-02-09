const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: false
});

async function createAdmin() {
  try {
    // Delete existing admin
    await pool.query("DELETE FROM admins WHERE email = 'admin@mythoplay.com'");
    console.log('Deleted existing admin if any');

    // Generate hash
    const hash = await bcrypt.hash('admin123', 10);
    console.log('Generated hash:', hash);

    // Insert new admin
    await pool.query(
      "INSERT INTO admins (name, email, password_hash, role) VALUES ($1, $2, $3, $4)",
      ['Super Admin', 'admin@mythoplay.com', hash, 'admin']
    );
    console.log('Admin created successfully!');
    console.log('Email: admin@mythoplay.com');
    console.log('Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createAdmin();

