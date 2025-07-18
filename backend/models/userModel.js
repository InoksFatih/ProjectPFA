const db = require('../config/db');
const bcrypt = require('bcryptjs');

const UserModel = {
  findByLoginOrEmail: async (login) => {
    const [rows] = await db.query(
      'SELECT * FROM users WHERE login = ? OR email = ?',
      [login, login]
    );
    return rows[0];
  },

  comparePassword: async (inputPassword, hashedPassword) => {
    return await bcrypt.compare(inputPassword, hashedPassword);
  },

  create: async ({ login, email, password, role }) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      `INSERT INTO users (login, password, email, role, created_at)
       VALUES (?, ?, ?, ?, NOW())`,
      [login, hashedPassword, email, role.toLowerCase()]
    );
    return result.insertId;
  },

  findById: async (id) => {
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  },

  update: async (id, updates) => {
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    values.push(id);
    const [result] = await db.query(`UPDATE users SET ${fields} WHERE id = ?`, values);
    return result;
  },

  delete: async (id) => {
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
    return result;
  }
};

module.exports = UserModel;
