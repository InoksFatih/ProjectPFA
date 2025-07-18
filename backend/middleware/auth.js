const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'Token manquant' });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('JWT error:', err);
    return res.status(401).json({ message: 'Token invalide' });
  }
};
