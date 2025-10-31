import { useState, useEffect } from 'react';
import {
  Container,
  Table,
  Button,
  Alert,
  Modal,
  Card,
  Row,
  Col,
  Form,
  Spinner,
} from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import api from '../api'; // ✅ NUEVA IMPORTACIÓN

// ... (código anterior igual)

function Carrito() {
  // ... (estados y hooks anteriores iguales)

  const loadMetodosPago = async () => {
    try {
      // ✅ CAMBIO: api.get en lugar de fetch
      const response = await api.get('/metodos-pago');
      setMetodosPago(response.data);
    } catch (err) {
      console.error('Error al cargar métodos de pago:', err);
    }
  };

  const loadDirecciones = async () => {
    try {
      // ✅ CAMBIO: api.get en lugar de fetch
      const response = await api.get(`/direcciones/${user?.id}`);
      setDirecciones(response.data);
    } catch (err) {
      console.error('Error al cargar direcciones:', err);
    }
  };

  const handleContinuarEnvio = async () => {
    if (!direccionSeleccionada) {
      alert('Selecciona una dirección de envío');
      return;
    }

    setShowShippingModal(false);
    try {
      const amount = Math.round(total * 100);
      // ✅ CAMBIO: api.post en lugar de fetch
      const response = await api.post('/payment/create-payment-intent', { 
        amount 
      });
      
      if (response.data.clientSecret) {
        setClientSecret(response.data.clientSecret);
        setShowPaymentModal(true);
      } else {
        setPaymentError('Error al generar el pago');
      }
    } catch (err) {
      console.error(err);
      setPaymentError('Error al conectar con el servidor de pagos');
    }
  };

  const handleConfirmarPedido = async () => {
    try {
      const pedidoData = {
        idCliente: user?.id,
        idMetodoPago: metodoPagoSeleccionado,
        idDireccionEntrega: direccionSeleccionada,
        total,
        productos: cartItems.map((item) => ({
          idProducto: item.idProducto,
          cantidad: item.cantidad,
          precioUnitario: item.precio,
        })),
      };
      
      // ✅ CAMBIO: api.post en lugar de fetch
      await api.post('/pedidos', pedidoData);

      clearCart();
      setShowConfirmationModal(false);
      setShowSuccessModal(true);
    } catch (err) {
      console.error(err);
      alert('Error al confirmar el pedido');
    }
  };

  // ... (resto del código igual)
}

export default CarritoWrapper;