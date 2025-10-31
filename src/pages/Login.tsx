import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Login.css';
import api from '../api'; // ✅ NUEVA IMPORTACIÓN

interface LoginData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginData>({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Enviando datos de login:', formData);
      
      // ✅ CAMBIO: api.post en lugar de fetch
      const response = await api.post('/auth/login', formData);
      console.log('Respuesta del servidor:', response.data);

      if (response.status === 200) {
        console.log('Login exitoso, guardando datos...');
        // Usar el context para login
        login(response.data.token, response.data.user);
        
        console.log('Redirigiendo a la página principal...');
        // Redirigir a la página principal
        navigate('/');
      } else {
        console.log('Error en login:', response.data.message);
        setError(response.data.message || 'Error en el login');
      }
    } catch (error: any) {
      console.error('Error en login:', error);
      setError(error.response?.data?.message || 'Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  // ... (resto del código igual)
};

export default Login;