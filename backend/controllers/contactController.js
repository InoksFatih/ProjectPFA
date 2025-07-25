const nodemailer = require('nodemailer'); // ✅ Don't forget this


exports.sendContactMail = async (req, res) => {
  const { name, email, message, phone, subject, category } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Champs requis manquants.' });
  }
console.log("🔐 OUTLOOK_PASS =", process.env.OUTLOOK_PASS);
  const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false, // TLS
  auth: {
    user: 'Africart12@outlook.com',
    pass: process.env.OUTLOOK_PASS
  }
});

  const mailOptions = {
    from: email,
    to: 'africart12@outlook.com',
    subject: `📩 ${subject || 'Nouveau message de contact'} - ${name}`,
    text: `
Nom: ${name}
Email: ${email}
Téléphone: ${phone || 'Non fourni'}
Catégorie: ${category || 'Non spécifiée'}

Message:
${message}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Message envoyé avec succès.' });
  } catch (err) {
    console.error('❌ Erreur mail:', err);
    return res.status(500).json({ error: 'Erreur lors de l’envoi du message.' });
  }
};
