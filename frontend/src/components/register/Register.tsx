 import React, { useState } from 'react';
import type { FormEvent } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import './Register.css';
import googleIcon from '../../assets/icons/icons8-google-48.png';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api/auth'; 

interface SignupData {
  login: string;
  role: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string; 
}


const Register: React.FC = () => {
    const navigate = useNavigate();

  const [signupData, setSignupData] = useState<SignupData>({  login: '',
 role: 'Client', firstname: '',lastname:'', email: '' , password:'', confirmPassword:''});


  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

 

const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (signupData.password !== signupData.confirmPassword) {
    toast.error('Erreur lors de l’inscription ❌', { autoClose: 3000 });
    return;
  }

  try {
    const res = await axios.post(`${API_URL}/register`, {
      login: signupData.login,
      email: signupData.email,
      password: signupData.password,
      role: signupData.role.toLowerCase(),
      firstname: signupData.firstname,
      lastname: signupData.lastname
    });

    const { token, user } = res.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    toast.success('Inscription réussie ✅', {
      className: 'toast-success-custom',
      autoClose: 2000,
    });

    setTimeout(() => {
      navigate('/');
      window.location.reload();
    }, 2000);

  } catch (err: any) {
    console.error(err);
    toast.error(err.response?.data?.message || 'Erreur lors de l’inscription ❌');
  }
};

  return (
      <>
    <Container fluid className="auth-container">
      <Row className="auth-row">
        <Col md={6} className="auth-section">
          <h2>Inscription</h2>
          <Form onSubmit={handleSignup}>
  <Form.Group>
    <Form.Label>S'inscrire en tant que</Form.Label>
    <Form.Control as="select" name="role" value={signupData.role} onChange={handleSignupChange}>
      <option>Client</option>
      <option>Artisan</option>
    </Form.Control>
  </Form.Group>

  <Form.Group>
    <Form.Label>Nom d'utilisateur</Form.Label>
    <Form.Control type="text" name="login" value={signupData.login} onChange={handleSignupChange} required autoComplete="off" />
  </Form.Group>

  <Row>
    <Col md={6}>
      <Form.Group>
        <Form.Label>Prénom</Form.Label>
        <Form.Control type="text" name="firstname" value={signupData.firstname} onChange={handleSignupChange} required />
      </Form.Group>
    </Col>
    <Col md={6}>
      <Form.Group>
        <Form.Label>Nom</Form.Label>
        <Form.Control type="text" name="lastname" value={signupData.lastname} onChange={handleSignupChange} required />
      </Form.Group>
    </Col>
  </Row>

  <Form.Group>
    <Form.Label>Adresse e-mail</Form.Label>
    <Form.Control type="email" name="email" value={signupData.email} onChange={handleSignupChange} required />
  </Form.Group>

  <Row>
    <Col md={6}>
      <Form.Group>
        <Form.Label>Mot de passe</Form.Label>
        <Form.Control type="password" name="password" value={signupData.password} onChange={handleSignupChange} required />
      </Form.Group>
    </Col>
    <Col md={6}>
      <Form.Group>
        <Form.Label>Confirmation mot de passe</Form.Label>
        <Form.Control type="password" name="confirmPassword" value={signupData.confirmPassword} onChange={handleSignupChange} required />
      </Form.Group>
    </Col>
  </Row>

  <Button type="submit" className="auth-button">S’inscrire</Button>
</Form>

          <div className="social-login">
            <p>OU</p>
            <Button variant="light" className="social-btn">
              <img src={googleIcon} alt="Google" /> Continuer avec Google
            </Button>
          </div>
        </Col>

        
      </Row>
    </Container>
    
    <ToastContainer position="top-right" autoClose={3000} />
    
  </>
  );
};

export default Register;