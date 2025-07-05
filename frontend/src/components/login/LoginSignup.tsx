import React, { useState } from 'react';
import type { FormEvent } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import './LoginSignup.css';
import googleIcon from '../../assets/icons/icons8-google-48.png';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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



interface LoginData {
  login: string;
  password: string;
}

const LoginSignup: React.FC = () => {
  const [signupData, setSignupData] = useState<SignupData>({  login: '',
 role: 'Client', firstname: '',lastname:'', email: '' , password:'', confirmPassword:''});
  const [loginData, setLoginData] = useState<LoginData>({ login:'', password: '' });

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

 const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (signupData.password !== signupData.confirmPassword) {
    toast.error('Erreur lors de l’inscription ❌', {
  autoClose: 3000,
});
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

   toast.success('Inscription réussie ✅', {
  className: 'toast-success-custom',
  autoClose: 3000,
});

    setSignupData({
      login: '',
      role: 'Client',
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      confirmPassword: '',
    });

    console.log(res.data);
  } catch (err: any) {
    console.error(err);
    toast.error(err.response?.data?.message || 'Erreur lors de l’inscription ❌');
  }
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

    // TODO: redirect to homepage/dashboard later
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
                <Form.Control type="text" name="login" value={signupData.login} onChange={handleSignupChange} required autoComplete="off"/>
              </Form.Group>
            <Form.Group>
              <Form.Label>Prenom</Form.Label>
              <Form.Control type="text" name="firstname" value={signupData.firstname} onChange={handleSignupChange} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Nom</Form.Label>
              <Form.Control type="text" name="lastname" value={signupData.lastname} onChange={handleSignupChange} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Adresse e-mail</Form.Label>
              <Form.Control type="email" name="email" value={signupData.email} onChange={handleSignupChange} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Mot de passe</Form.Label>
              <Form.Control type="password" name="password" value={signupData.password} onChange={handleSignupChange} required />
            </Form.Group>
             <Form.Group>
              <Form.Label>Confimation de Mot de passe</Form.Label>
              <Form.Control type="password" name="confirmPassword" value={signupData.confirmPassword} onChange={handleSignupChange} required />
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
        </Col>
      </Row>
    </Container>
    
    <ToastContainer position="top-right" autoClose={3000} />
  </>
  );
};

export default LoginSignup;