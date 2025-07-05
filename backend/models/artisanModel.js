// models/artisanModel.js
const db = require('../config/db');

const ArtisanModel = {
  create: async ({ nom, prenom, bio, bankInfo, numeroTelephone, user_id }) => {
    const [result] = await db.query(
      `INSERT INTO artisans (nom, prenom, bio, bankInfo, numeroTelephone, user_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nom, prenom, bio, bankInfo, numeroTelephone, user_id]
    );
    return result.insertId;
  },

  findById: async (id) => {
    const [rows] = await db.query('SELECT * FROM artisans WHERE id = ?', [id]);
    return rows[0];
  },

  findByUserId: async (user_id) => {
    const [rows] = await db.query('SELECT * FROM artisans WHERE user_id = ?', [user_id]);
    return rows[0];
  },

  update: async (id, updates) => {
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    values.push(id);
    const [result] = await db.query(`UPDATE artisans SET ${fields} WHERE id = ?`, values);
    return result;
  },

  delete: async (id) => {
    const [result] = await db.query('DELETE FROM artisans WHERE id = ?', [id]);
    return result;
  }
};

module.exports = ArtisanModel;
