const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');


router.post('/produit-image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const imageUrl = `/uploads/${req.file.filename}`;
  res.status(200).json({ message: 'Image uploaded', imageUrl });
});

module.exports = router;
