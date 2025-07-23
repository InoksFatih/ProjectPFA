
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const db = require('../config/db');


exports.loginUser = async (req, res) => {
  const { login, password } = req.body;

  try {
    const user = await UserModel.findByLoginOrEmail(login);
    if (!user) return res.status(401).json({ message: 'Utilisateur introuvable.' });

    const isMatch = await UserModel.comparePassword(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Identifiants invalides.' });

    let firstName = '';
    if (user.role === 'client') {
      const [clientRows] = await db.query(
        'SELECT prenom FROM clients WHERE user_id = ?',
        [user.id]
      );
      firstName = clientRows[0]?.prenom || '';
    } else if (user.role === 'artisan') {
      const [artisanRows] = await db.query(
        'SELECT prenom FROM artisans WHERE user_id = ?',
        [user.id]
      );
      firstName = artisanRows[0]?.prenom || '';
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      message: 'Connexion réussie',
      token,
      user: {
        id: user.id,
        login: user.login,
        email: user.email,
        role: user.role,
        firstName, // 
        profilePhoto: user.profile_photo || '' 
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

// REGISTER
exports.registerUser = async (req, res) => {
  const {
    login,
    email,
    password,
    role,
    firstname,
    lastname,
    phone,
    pays,
    type_artisanat
  } = req.body;

  if (!login || !email || !password || !role || !firstname || !lastname || !phone) {
    return res.status(400).json({ message: 'Tous les champs requis.' });
  }

  const allowedRoles = ['client', 'artisan'];
  if (!allowedRoles.includes(role.toLowerCase())) {
    return res.status(403).json({ message: 'Rôle non autorisé.' });
  }

  try {
    const existing = await UserModel.findByLoginOrEmail(login);
    if (existing) {
      return res.status(409).json({ message: 'Email ou login déjà utilisé.' });
    }

    const userId = await UserModel.create({ login, email, password, role });

    if (role.toLowerCase() === 'client') {
      await db.query(
        `INSERT INTO clients (nom, prenom, bankInfo, numeroTelephone, user_id)
         VALUES (?, ?, '', ?, ?)`,
        [lastname, firstname, phone, userId]
      );
    } else if (role.toLowerCase() === 'artisan') {
      if (!pays || !type_artisanat) {
        return res.status(400).json({ message: 'Pays et type d’artisanat requis pour les artisans.' });
      }

      // Insert into artisans table
      const [artisanResult] = await db.query(
        `INSERT INTO artisans (nom, prenom, bio, bankInfo, numeroTelephone, pays, type_artisanat, user_id)
         VALUES (?, ?, '', '', ?, ?, ?, ?)`,
        [lastname, firstname, phone, pays, type_artisanat, userId]
      );

      const artisanId = artisanResult.insertId;

      // Create linked boutique automatically
      const boutiqueName = `${firstname} ${lastname}'s Boutique`;
      const boutiqueDesc = `Bienvenue dans la boutique de ${firstname}`;
      await db.query(
        `INSERT INTO boutiques (nom, description, artisan_id)
         VALUES (?, ?, ?)`,
        [boutiqueName, boutiqueDesc, artisanId]
      );
    }

    const token = jwt.sign(
      { id: userId, role: role.toLowerCase() },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(201).json({
      message: 'Inscription réussie.',
      token,
      user: {
        id: userId,
        login,
        email,
        role: role.toLowerCase(),
        firstName: firstname
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

