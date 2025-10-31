import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Login.css';
import api from '../api'; // ✅ NUEVA IMPORTACIÓN

interface RegisterData {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  confirmPassword: string;
  telefono: string;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterData>({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefono: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    if (formData.nombre.length < 2) {
      setError('El nombre debe tener al menos 2 caracteres');
      return false;
    }
    if (formData.apellido.length < 2) {
      setError('El apellido debe tener al menos 2 caracteres');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      console.log('Enviando datos de registro:', formData);
      
      // ✅ CAMBIO: api.post en lugar de fetch
      const response = await api.post('/auth/register', {
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        password: formData.password,
        telefono: formData.telefono
      });

      console.log('Respuesta del servidor:', response.data);

      if (response.status === 201 || response.status === 200) {
        console.log('Registro exitoso, guardando datos...');
        // Usar el context para login automático
        login(response.data.token, response.data.user);
        
        setSuccess('¡Registro exitoso! Redirigiendo...');
        console.log('Redirigiendo a la página principal...');
        // Redirigir a la página principal
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        console.log('Error en registro:', response.data.message);
        setError(response.data.message || 'Error en el registro');
      }
    } catch (error: any) {
      console.error('Error en registro:', error);
      setError(error.response?.data?.message || 'Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  // ... (resto del código igual)
};

export default Register;