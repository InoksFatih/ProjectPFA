const db = require('../config/db');

const ProduitModel = {
  // 🔍 Get all products for a boutique
  getByBoutiqueId: async (boutiqueId) => {
    const [rows] = await db.query('SELECT * FROM produits WHERE boutique_id = ?', [boutiqueId]);
    return rows;
  },

  // ➕ Add product
  add: async ({ titre, description, prix, stock, boutique_id }) => {
    const [result] = await db.query(
      `INSERT INTO produits (titre, description, prix, stock, boutique_id)
       VALUES (?, ?, ?, ?, ?)`,
      [titre, description, prix, stock, boutique_id]
    );
    return result.insertId;
  },

  // ✏️ Update product
  update: async (id, { titre, description, prix }) => {
    const [result] = await db.query(
      `UPDATE produits SET titre = ?, description = ?, prix = ? WHERE id = ?`,
      [titre, description, prix, id]
    );
    return result;
  },

  // ❌ Delete product
  delete: async (id) => {
    const [result] = await db.query('DELETE FROM produits WHERE id = ?', [id]);
    return result;
  },
  getAllWithArtisan: async () => {
  const [products] = await db.query(`
    SELECT 
      p.id, p.titre, p.description, p.prix, p.stock,
      b.nom AS boutique_nom,
      a.nom AS artisan_nom,
      a.pays AS artisan_pays,
      a.type_artisanat
    FROM produits p
    JOIN boutiques b ON p.boutique_id = b.id
    JOIN artisans a ON b.artisan_id = a.id
  `);

  console.log("🧪 Raw products from DB:", products); // ✅

  const [images] = await db.query(`
    SELECT produit_id, image_url FROM product_images
  `);

  console.log("🧪 Raw images from DB:", images); // ✅

  const enrichedProducts = products.map(product => {
    const productImages = images.filter(img => Number(img.produit_id) === Number(product.id));
    console.log(`🔗 Product ID: ${product.id}, Found images:`, productImages);
    return {
      ...product,
      images: productImages
    };
  });

  return enrichedProducts;
},



  // 📸 IMAGE MANAGEMENT
  getImages: async (produitId) => {
    const [rows] = await db.query(
      `SELECT * FROM product_images WHERE produit_id = ?`,
      [produitId]
    );
    return rows;
  },

  addImage: async (produitId, imageUrl) => {
    const [result] = await db.query(
      `INSERT INTO product_images (produit_id, image_url) VALUES (?, ?)`,
      [produitId, imageUrl]
    );
    return result.insertId;
  },

  deleteImage: async (imageId) => {
    const [result] = await db.query(
      `DELETE FROM product_images WHERE id = ?`,
      [imageId]
    );
    return result;
  },
  
  getByArtisanUserId: async (userId) => {
  const [rows] = await db.query(
    `SELECT p.* FROM produits p
     JOIN boutiques b ON b.id = p.boutique_id
     JOIN artisans a ON a.id = b.artisan_id
     WHERE a.user_id = ?`,
    [userId]
  );
  return rows;
  
},
getSingleWithImages: async (id) => {
  const [productRows] = await db.query(
    `SELECT p.*, b.nom AS boutique_nom, a.nom AS artisan_nom, a.pays AS artisan_pays, a.type_artisanat
     FROM produits p
     JOIN boutiques b ON p.boutique_id = b.id
     JOIN artisans a ON b.artisan_id = a.id
     WHERE p.id = ?`,
    [id]
  );

  if (productRows.length === 0) return null;

  const [images] = await db.query(
    'SELECT image_url FROM product_images WHERE produit_id = ?',
    [id]
  );

  const product = productRows[0];
  product.images = images;
  return product;
},


};

module.exports = ProduitModel;
