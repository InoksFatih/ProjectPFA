const db = require('../config/db');

const ClientModel = {
  getByUserId: async (userId) => {
    const [rows] = await db.query('SELECT * FROM clients WHERE user_id = ?', [userId]);
    return rows[0];
  },

  updateProfile: async (userId, updates) => {
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    values.push(userId);

    const [result] = await db.query(
      `UPDATE clients SET ${fields} WHERE user_id = ?`,
      values
    );
    return result;
  }
};

module.exports = ClientModel;
