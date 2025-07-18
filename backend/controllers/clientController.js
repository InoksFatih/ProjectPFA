const ClientModel = require('../models/clientModel');

// GET client profile by user ID (protected)
exports.getClientByUserId = async (req, res) => {
  const userId = parseInt(req.params.userId);

  // Block if not requesting own profile
  if (req.user.id !== userId) {
    return res.status(403).json({ message: 'Accès interdit' });
  }

  try {
    const client = await ClientModel.getByUserId(userId);
    if (!client) {
      return res.status(404).json({ message: 'Client introuvable' });
    }

    // Convert BLOB to base64
    if (client.photo) {
      client.photo = Buffer.from(client.photo).toString('base64');
    }

    res.status(200).json(client);
  } catch (err) {
    console.error('Erreur getClientByUserId:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// UPDATE client profile (protected)
exports.updateClient = async (req, res) => {
  const userId = parseInt(req.params.userId);

  // Ensure user is updating their own profile
  if (req.user.id !== userId) {
    return res.status(403).json({ message: 'Accès interdit' });
  }

  const { nom, prenom, numeroTelephone } = req.body;
  const photo = req.file ? req.file.buffer : undefined;

  const updates = { nom, prenom, numeroTelephone };
  if (photo) updates.photo = photo;

  try {
    await ClientModel.updateProfile(userId, updates);
    res.status(200).json({ message: 'Profil client mis à jour avec succès' });
  } catch (err) {
    console.error('Erreur updateClient:', err);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du profil client' });
  }
};
