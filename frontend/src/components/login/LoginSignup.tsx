import React, { useState } from 'react';
import type { FormEvent } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import './LoginSignup.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from '../footer/footer';

const API_URL = 'http://localhost:5000/api/auth'; 




interface LoginData {
  login: string;
  password: string;
}

const LoginSignup: React.FC = () => {
  const [loginData, setLoginData] = useState<LoginData>({ login:'', password: '' });

  
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };


  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  try {
    const res = await axios.post(`${API_URL}/login`, {
      login: loginData.login,
      password: loginData.password,
    });

    const { token, user } = res.data;

    // 🔐 Store token (for later authenticated requests)
    localStorage.setItem('token', token);

    // 🎉 Success feedback
    toast.success(`Bienvenue ${user.login} 🎉`, {
      className: 'toast-success-custom',
      autoClose: 3000,
    });

    console.log('Login success:', user);

  } catch (err: any) {
    console.error('Login error:', err);
    toast.error(err.response?.data?.message || 'Erreur lors de la connexion ❌', {
      autoClose: 3000,
    });
  }
};

  return (
      <>
    
    <Container fluid className="auth-container">
      <Row className="auth-row">
      
        <Col md={6} className="auth-section">
          <h2>Connexion</h2>
          <Form onSubmit={handleLogin}>
            <Form.Group>
              <Form.Label>Nom d'utilisateur ou adresse e-mail</Form.Label>
              <Form.Control type="text" name="login" value={loginData.login} onChange={handleLoginChange} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Mot de passe</Form.Label>
              <Form.Control type="password" name="password" value={loginData.password} onChange={handleLoginChange} required />
            </Form.Group>
            <Button type="submit" className="auth-button">Se connecter</Button>
          </Form>
          <a href='' className="forgot-password">Mot de passe oublié ?</a>
          <a href='' className="forgot-password">Pas de compte ? Inscris-toi.</a>
        </Col>
      </Row>
    </Container>
    <Footer/>
    <ToastContainer position="top-right" autoClose={3000} />
  </>
  );
};

export default LoginSignup;