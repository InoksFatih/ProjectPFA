// page/contact.tsx
import React, { useState } from 'react';
import './contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    topic: '',
    orderNumber: '',
    salonName: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Construction du corps de l'email
      const emailBody = `
        Nouveau message de contact:
        
        Nom: ${formData.firstName} ${formData.lastName}
        Email: ${formData.email}
        Téléphone: ${formData.phone || 'Non fourni'}
        Sujet: ${formData.topic}
        Numéro de commande: ${formData.orderNumber || 'Non fourni'}
        Nom du salon: ${formData.salonName || 'Non fourni'}
        
        Message:
        ${formData.message}
      `;

      // Envoi vers un service d'email (exemple avec EmailJS)
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: 'Africart12@outlook.com',
          subject: `Contact Form - ${formData.topic || 'Nouveau message'}`,
          message: emailBody,
          from: formData.email,
          name: `${formData.firstName} ${formData.lastName}`
        })
      });

      if (response.ok) {
        alert("Message envoyé avec succès !");
        // Reset du formulaire
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          topic: '',
          orderNumber: '',
          salonName: '',
          message: ''
        });
      } else {
        throw new Error('Erreur lors de l\'envoi');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert("Erreur lors de l'envoi du message. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-left">
        <h1>Avez-vous des questions?</h1>
        <p>
          Nous sommes là pour vous aider ! Remplissez le formulaire ou contactez-nous par e-mail ou par téléphone. 
          Notre service client est à votre disposition pour vous offrir la meilleure expérience possible.
        </p>
        <p>📧 Africart12@outlook.com<br />💬 chat with us</p>
      </div>
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="row">
          <input 
            type="text" 
            name="firstName" 
            placeholder="*First Name" 
            value={formData.firstName}
            onChange={handleChange} 
            required 
          />
          <input 
            type="text" 
            name="lastName" 
            placeholder="*Last Name" 
            value={formData.lastName}
            onChange={handleChange} 
            required 
          />
        </div>
        <input 
          type="email" 
          name="email" 
          placeholder="*Email" 
          value={formData.email}
          onChange={handleChange} 
          required 
        />
        <input 
          type="text" 
          name="phone" 
          placeholder="Phone Number (optional)" 
          value={formData.phone}
          onChange={handleChange} 
        />
        <select 
          name="topic" 
          value={formData.topic}
          required 
          onChange={handleChange}
        >
          <option value="">Sélectionnez votre sujet</option>
          <option value="Problème de commande">Problème de commande</option>
          <option value="Demande générale">Demande générale</option>
          <option value="Support technique">Support technique</option>
          <option value="Partenariat">Partenariat</option>
        </select>
        <input 
          type="text" 
          name="orderNumber" 
          placeholder="Order Number (optional)" 
          value={formData.orderNumber}
          onChange={handleChange} 
        />
        <input 
          type="text" 
          name="salonName" 
          placeholder="Salon Name (if applicable)" 
          value={formData.salonName}
          onChange={handleChange} 
        />
        <textarea 
          name="message" 
          placeholder="*Message" 
          value={formData.message}
          required 
          onChange={handleChange} 
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'ENVOI EN COURS...' : 'SUBMIT'}
        </button>
      </form>
    </div>
  );
};

export default Contact;