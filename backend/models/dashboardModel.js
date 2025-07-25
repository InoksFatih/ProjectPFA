const db = require('../config/db');

const DashboardModel = {
  async getSummary(userId, role) {
    if (role === 'artisan') {
      const [[ventes]] = await db.query(`
        SELECT SUM(cp.quantite * p.prix) AS total
        FROM commande_produits cp
        JOIN produits p ON cp.produit_id = p.id
        JOIN commandes c ON cp.commande_id = c.id
        JOIN boutiques b ON p.boutique_id = b.id
        JOIN artisans a ON b.artisan_id = a.id
        WHERE a.user_id = ? AND c.dateCreer >= NOW() - INTERVAL 30 DAY
      `, [userId]);

      const [[commandes]] = await db.query(`
        SELECT COUNT(DISTINCT c.id) AS total
        FROM commandes c
        JOIN commande_produits cp ON c.id = cp.commande_id
        JOIN produits p ON cp.produit_id = p.id
        JOIN boutiques b ON p.boutique_id = b.id
        JOIN artisans a ON b.artisan_id = a.id
        WHERE a.user_id = ?
      `, [userId]);

      const [[produits]] = await db.query(`
        SELECT COUNT(*) AS total
        FROM produits p
        JOIN boutiques b ON p.boutique_id = b.id
        JOIN artisans a ON b.artisan_id = a.id
        WHERE a.user_id = ?
      `, [userId]);

      return {
        ventes_mois: ventes.total || 0,
        commandes: commandes.total,
        produits: produits.total
      };
    } else {
      const [[commandes]] = await db.query(`
        SELECT COUNT(*) AS total
        FROM commandes
        WHERE user_id = ?
      `, [userId]);

      return {
        ventes_mois: 0,
        commandes: commandes.total,
        produits: 0
      };
    }
  },

  async getRecentOrders(userId, role) {
    if (role === 'artisan') {
      const [rows] = await db.query(`
        SELECT c.id AS commande_id, cl.prenom, cl.nom, c.dateCreer, 
               SUM(cp.quantite * p.prix) AS montant, c.status
        FROM commandes c
        JOIN commande_produits cp ON c.id = cp.commande_id
        JOIN produits p ON cp.produit_id = p.id
        JOIN boutiques b ON p.boutique_id = b.id
        JOIN artisans a ON b.artisan_id = a.id
        JOIN clients cl ON c.user_id = cl.user_id
        WHERE a.user_id = ?
        GROUP BY c.id
        ORDER BY c.dateCreer DESC
        LIMIT 5
      `, [userId]);
      return rows;
    } else {
      const [rows] = await db.query(`
        SELECT c.id AS commande_id, c.dateCreer, c.status,
               SUM(cp.quantite * p.prix) AS montant
        FROM commandes c
        JOIN commande_produits cp ON c.id = cp.commande_id
        JOIN produits p ON cp.produit_id = p.id
        WHERE c.user_id = ?
        GROUP BY c.id
        ORDER BY c.dateCreer DESC
        LIMIT 5
      `, [userId]);

      return rows.map(r => ({
        ...r,
        prenom: 'Moi',
        nom: ''
      }));
    }
  }
};

module.exports = DashboardModel;
