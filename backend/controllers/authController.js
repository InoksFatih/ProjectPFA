const db = require('../config/db'); // your MySQL connection
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.loginUser = async (req, res) => {
  const { login, password } = req.body;

  try {
    const [userRows] = await db.query(
      'SELECT * FROM users WHERE login = ? OR email = ?',
      [login, login]
    );

    if (userRows.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }

    const user = userRows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
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
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.registerUser = async (req, res) => {
  const { login, email, password, role } = req.body;

  if (!login || !email || !password || !role) {
    return res.status(400).json({ message: 'Tous les champs sont requis.' });
  }

  try {
    // Check if login or email already exists
    const [existingUser] = await db.query(
      'SELECT * FROM users WHERE login = ? OR email = ?',
      [login, email]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({ message: 'Email ou login déjà utilisé.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [result] = await db.query(
      `INSERT INTO users (login, password, email, role, created_at) 
       VALUES (?, ?, ?, ?, NOW())`,
      [login, hashedPassword, email, role]
    );

    const newUser = {
      id: result.insertId,
      login,
      email,
      role,
    };

    // Optional: generate token
    const token = jwt.sign(
      { id: newUser.id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      message: 'Inscription réussie.',
      token,
      user: newUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};