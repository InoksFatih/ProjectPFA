import React, { useState } from 'react';
import './Contact.css';
import axios from 'axios';

const Contact: React.FC = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    category: '',
    message: ''
  });
  const [status, setStatus] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/contact', form);
      setStatus('✅ Message envoyé avec succès !');
      setForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        category: '',
        message: ''
      });
    } catch (err) {
      console.error(err);
      setStatus("❌ Erreur lors de l'envoi du message.");
    }
  };

  return (
    <div className="contact-page-container">

    <div className="container py-5 mt-5"> {/* mt-5 to push from navbar */}
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow contact-card">
            
            <div className="card-body">
              <h2 className="text-center contact-title mb-3">Contactez-nous</h2>
              <p className="text-center contact-subtitle mb-4">
                Nous serons ravis de vous lire.
              </p>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Votre nom complet"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="Votre adresse email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="tel"
                    name="phone"
                    className="form-control"
                    placeholder="Votre numéro de téléphone"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    name="subject"
                    className="form-control"
                    placeholder="Sujet de la demande"
                    value={form.subject}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <select
                    name="category"
                    className="form-select"
                    value={form.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Type de demande</option>
                    <option value="Collaboration">Collaboration</option>
                    <option value="Devenir Artisan">Devenir Artisan</option>
                    <option value="Support Technique">Support Technique</option>
                    <option value="Partenariat">Partenariat</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
                <div className="mb-4">
                  <textarea
                    name="message"
                    className="form-control"
                    placeholder="Expliquez votre demande ici..."
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-africart">
                    Envoyer
                  </button>
                </div>
                {status && <p className="text-center mt-3 status-msg">{status}</p>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Contact;
