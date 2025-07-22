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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData); // tu pourras envoyer via API ici plus tard
    alert("Message envoyé !");
  };

  return (
    <div className="contact-container">
      <div className="contact-left">
        <h1>have a question?</h1>
        <p>
         Nous sommes là pour vous aider ! Remplissez le formulaire ou contactez-nous par e-mail ou par téléphone.
          Notre service client est à votre disposition pour vous offrir la meilleure expérience possible.
        </p>
        <p>📧 Africart12@outlook.com<br />📞  />💬 chat with us</p>
      </div>
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="row">
          <input type="text" name="firstName" placeholder="*First Name" onChange={handleChange} required />
          <input type="text" name="lastName" placeholder="*Last Name" onChange={handleChange} required />
        </div>
        <input type="email" name="email" placeholder="*Email" onChange={handleChange} required />
        <input type="text" name="phone" placeholder="Phone Number (optional)" onChange={handleChange} />
        <select name="topic" required onChange={handleChange}>
          <option value="">Sélectionnez votre sujet</option>
          <option value="order">Problème de commande</option>
          <option value="general">Demande générale</option>
        </select>
        <input type="text" name="orderNumber" placeholder="Order Number (optional)" onChange={handleChange} />
        <input type="text" name="salonName" placeholder="Salon Name (if applicable)" onChange={handleChange} />
        <textarea name="message" placeholder="*Message" required onChange={handleChange} />
        <button type="submit">SUBMIT</button>
      </form>
    </div>
  );
};

export default Contact;
