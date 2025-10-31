import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Alert, Table } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import api from '../api'; // ✅ NUEVA IMPORTACIÓN

// ... (interfaces y código anterior igual)

const AdminSettings: React.FC = () => {
  // ... (estados y hooks anteriores iguales)

  const loadProductos = async () => {
    try {
      // ✅ CAMBIO: api.get en lugar de fetch
      const response = await api.get('/productos');
      if (response.status === 200) {
        setProductos(response.data);
      } else {
        setError('Error al cargar productos');
      }
    } catch (error) {
      setError('Error de conexión');
      console.log(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const url = editingProduct 
        ? `/productos/${editingProduct.idProducto}`
        : '/productos';
      
      // ✅ CAMBIO: api.post o api.put en lugar de fetch
      if (editingProduct) {
        await api.put(url, {
          ...formData,
          precio: parseFloat(formData.precio),
          cantidadDisponible: parseInt(formData.cantidadDisponible)
        });
      } else {
        await api.post(url, {
          ...formData,
          precio: parseFloat(formData.precio),
          cantidadDisponible: parseInt(formData.cantidadDisponible)
        });
      }

      setSuccess(editingProduct ? 'Producto actualizado' : 'Producto creado');
      loadProductos();
      handleCloseModal();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        // ✅ CAMBIO: api.delete en lugar de fetch
        await api.delete(`/productos/${id}`);
        setSuccess('Producto eliminado');
        loadProductos();
      } catch (error) {
        setError('Error de conexión');
      }
    }
  };

  // ... (resto del código igual)
};

export default AdminSettings;