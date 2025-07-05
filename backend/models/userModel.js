const db = require('../config/db');

const UserModel= {
  // Find user by email (for login)
  findByEmail: async (email) => {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },

  // Create new user
  create: async ({ login, password, email, role }) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      `INSERT INTO users (login, password, email, role, created_at) 
       VALUES (?, ?, ?, ?, NOW())`,
      [login, hashedPassword, email, role]
    );
    return result.insertId;
  },

  // Get user by ID
  findById: async (id) => {
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  },
 findByLoginOrEmail: async (login) => {
    const [rows] = await db.query(
      `SELECT * FROM users WHERE login = ? OR email = ?`,
      [login, login]
    );
    return rows[0];
  },

  comparePassword: async (inputPassword, hashedPassword) => {
    return await bcrypt.compare(inputPassword, hashedPassword);
  },

  // Update user by ID
  update: async (id, updates) => {
    const fields = Object.keys(updates).map((key) => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    values.push(id);
    const [result] = await db.query(`UPDATE users SET ${fields} WHERE id = ?`, values);
    return result;
  },

  // Delete user by ID
  delete: async (id) => {
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
    return result;
  }
};

module.exports = UserModel;
