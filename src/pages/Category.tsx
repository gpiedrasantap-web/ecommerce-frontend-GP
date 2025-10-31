import { Link, useLocation, useParams } from "react-router-dom";
import { Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap";
import "../styles/Category.css";
import { useEffect, useState } from "react";
import api from '../api'; // ✅ NUEVA IMPORTACIÓN

// ... (interface Producto igual)

function Category() {
  // ... (estados y hooks anteriores iguales)

  const loadProductos = async () => {
    try {
      setLoading(true);

      let url = "/productos";
      if (filtro !== "Todos") {
        const params = new URLSearchParams();
        params.append("categoria", filtro);
        url += `?${params.toString()}`;
      }

      // ✅ CAMBIO: api.get en lugar de fetch
      const response = await api.get(url);
      
      if (response.status === 200) {
        setProductos(response.data);
      } else {
        setError("Error al cargar productos");
      }
    } catch (error) {
      setError("Error de conexión: " + error);
    } finally {
      setLoading(false);
    }
  };

  // ... (resto del código igual)
}

export default Category;