import React, { useState } from 'react';
import type { FormEvent } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import './LoginSignup.css';
import googleIcon from '../../assets/icons/icons8-google-48.png';

interface SignupData {
  role: string;
  firstname: string;
  lastname: string;
  email: string;
}

interface LoginData {
  email: string;
  password: string;
}

const LoginSignup: React.FC = () => {
  const [signupData, setSignupData] = useState<SignupData>({ role: 'Client', firstname: '',lastname:'', email: '' });
  const [loginData, setLoginData] = useState<LoginData>({ email: '', password: '' });

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSignup = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Signup Data:', signupData);
    // TODO: Implement email verification logic and redirection
  };

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Login Data:', loginData);
    // TODO: Implement login logic and redirection
  };

  return (
    <Container fluid className="auth-container">
      <Row className="auth-row">
        <Col md={6} className="auth-section">
          <h2>Inscription</h2>
          <Form onSubmit={handleSignup}>
            <Form.Group>
              <Form.Label>S’inscrire en tant que</Form.Label>
              <Form.Control as="select" name="role" value={signupData.role} onChange={handleSignupChange}>
                <option>Client</option>
                <option>Vendeur</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Prenom</Form.Label>
              <Form.Control type="text" name="name" value={signupData.firstname} onChange={handleSignupChange} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Nom</Form.Label>
              <Form.Control type="text" name="name" value={signupData.lastname} onChange={handleSignupChange} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Adresse e-mail</Form.Label>
              <Form.Control type="email" name="email" value={signupData.email} onChange={handleSignupChange} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Mot de passe</Form.Label>
              <Form.Control type="password" name="password" value={loginData.password} onChange={handleLoginChange} required />
            </Form.Group>
             <Form.Group>
              <Form.Label>Confimation de Mot de passe</Form.Label>
              <Form.Control type="password" name="password" value={loginData.password} onChange={handleLoginChange} required />
            </Form.Group>
            <Button type="submit" className="auth-button">S’inscrire</Button>
            
          </Form>
          <div className="social-login">
            <p>OU</p>
            <Button variant="light" className="social-btn">
              <img src={googleIcon} alt="Google" /> Continuer avec Google
            </Button>
          </div>
        </Col>

        <Col md={6} className="auth-section">
          <h2>Connexion</h2>
          <Form onSubmit={handleLogin}>
            <Form.Group>
              <Form.Label>Adresse e-mail</Form.Label>
              <Form.Control type="email" name="email" value={loginData.email} onChange={handleLoginChange} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Mot de passe</Form.Label>
              <Form.Control type="password" name="password" value={loginData.password} onChange={handleLoginChange} required />
            </Form.Group>
            <Button type="submit" className="auth-button">Se connecter</Button>
          </Form>
          <a href='' className="forgot-password">Mot de passe oublié ?</a>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginSignup;