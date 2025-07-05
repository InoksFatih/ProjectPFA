const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// LOGIN
exports.loginUser = async (req, res) => {
  const { login, password } = req.body;

  try {
    const [userRows] = await db.query(
      'SELECT * FROM users WHERE login = ? OR email = ?',
      [login, login]
    );

    if (userRows.length === 0) {
      return res.status(401).json({ message: 'Utilisateur introuvable.' });
    }

    const user = userRows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Identifiants invalides.' });
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
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

// REGISTER
exports.registerUser = async (req, res) => {
  const { login, email, password, role, firstname, lastname } = req.body;

  if (!login || !email || !password || !role || !firstname || !lastname) {
    return res.status(400).json({ message: 'Tous les champs sont requis.' });
  }

  const allowedRoles = ['client', 'artisan'];
  if (!allowedRoles.includes(role.toLowerCase())) {
    return res.status(403).json({ message: 'Rôle non autorisé.' });
  }

  try {
    const [existingUser] = await db.query(
      'SELECT * FROM users WHERE login = ? OR email = ?',
      [login, email]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({ message: 'Email ou login déjà utilisé.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      `INSERT INTO users (login, password, email, role, created_at) 
       VALUES (?, ?, ?, ?, NOW())`,
      [login, hashedPassword, email, role.toLowerCase()]
    );

    const newUser = {
      id: result.insertId,
      login,
      email,
      role: role.toLowerCase(),
    };

    if (newUser.role === 'client') {
      await db.query(
        `INSERT INTO clients (nom, prenom, bankInfo, numeroTelephone, user_id)
         VALUES (?, ?, ?, ?, ?)`,
        [lastname, firstname, '', '', newUser.id]
      );
    } else if (newUser.role === 'artisan') {
      await db.query(
        `INSERT INTO artisans (nom, prenom, bio, bankInfo, numeroTelephone, user_id)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [lastname, firstname, '', '', '', newUser.id]
      );
    }

    const token = jwt.sign(
      { id: newUser.id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(201).json({
      message: 'Inscription réussie.',
      token,
      user: newUser,
      firstname,
      lastname,
      email,
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};
