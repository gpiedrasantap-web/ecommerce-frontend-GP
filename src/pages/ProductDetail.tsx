import { useLocation, useParams } from 'react-router-dom';
import { Container, Row, Col, Button, Modal, Form, Alert, Spinner, Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/ProductDetails.css';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../api'; // ✅ NUEVA IMPORTACIÓN

// ... (código anterior igual)

function InnerProductDetails() {
  // ... (estados y hooks anteriores iguales)

  const loadProducto = async () => {
    try {
      setLoading(true);
      // ✅ CAMBIO: api.get en lugar de fetch
      const response = await api.get(`/productos/${id}`);
      if (response.status === 200) {
        setProducto(response.data);
      } else {
        setError('Producto no encontrado');
      }
    } catch (error) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const loadMetodosPago = async () => {
    try {
      // ✅ CAMBIO: api.get en lugar de fetch
      const response = await api.get('/metodos-pago');
      if (response.status === 200) {
        setMetodosPago(response.data);
      }
    } catch (error) {
      console.error('Error al cargar métodos de pago:', error);
    }
  };

  const loadDirecciones = async () => {
    try {
      // ✅ CAMBIO: api.get en lugar de fetch
      const response = await api.get(`/direcciones/${user?.id}`);
      if (response.status === 200) {
        setDirecciones(response.data);
      }
    } catch (error) {
      console.error('Error al cargar direcciones:', error);
    }
  };

  const handleContinuarEnvio = async () => {
    if (!direccionSeleccionada) {
      alert('Selecciona una dirección de envío');
      return;
    }
    setShowShippingModal(false);
    try {
      const total = producto ? Math.round(producto.precio * cantidad * 100) : 0;
      // ✅ CAMBIO: api.post en lugar de fetch
      const response = await api.post('/payment/create-payment-intent', { 
        amount: total 
      });
      
      if (response.data.clientSecret) {
        setClientSecret(response.data.clientSecret);
        setShowPaymentModal(true);
      } else {
        setError('Error al preparar el pago');
      }
    } catch (error) {
      setError('Error al conectar con el servidor de pagos');
    }
  };

  const handleConfirmarPedido = async () => {
    try {
      const pedidoData = {
        idCliente: user?.id,
        idMetodoPago: metodoPagoSeleccionado,
        idDireccionEntrega: direccionSeleccionada,
        total: producto ? producto.precio * cantidad : 0,
        productos: [{
          idProducto: producto?.idProducto,
          cantidad: cantidad,
          precioUnitario: producto?.precio
        }]
      };
      // ✅ CAMBIO: api.post en lugar de fetch
      await api.post('/pedidos', pedidoData);
      
      setShowConfirmationModal(false);
      setShowConfirmarEnvio(true);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al procesar el pedido');
    }
  };

  const handleAgregarDireccion = async () => {
    try {
      // ✅ CAMBIO: api.post en lugar de fetch
      await api.post('/direcciones', { 
        idCliente: user?.id, 
        ...nuevaDireccion 
      });
      
      loadDirecciones();
      setNuevaDireccion({ alias: '', calle: '', numero: '', ciudad: '', estado: '', codigoPostal: '', pais: '', telefonoContacto: '' });
      alert('Dirección agregada exitosamente');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al agregar dirección');
    }
  };

  // ... (resto del código igual)
}

export default ProductDetails;