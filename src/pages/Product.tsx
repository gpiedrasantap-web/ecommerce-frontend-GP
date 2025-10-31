import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import '../styles/Product.css';  
import api from '../api'; // ✅ NUEVA IMPORTACIÓN

interface Producto {
  idProducto: number;
  nombre: string;
  descripcion: string;
  precio: number;
  cantidadDisponible: number;
  enStock: boolean;
  imagen: string;
}

function Product() { 
    const navigate = useNavigate();
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        loadProductos();
    }, []);

    const loadProductos = async () => {
        try {
            setLoading(true);
            // ✅ CAMBIO: api.get en lugar de fetch
            const response = await api.get('/productos');
            
            if (response.status === 200) {
                // Mostrar solo los primeros 6 productos en la página principal
                setProductos(response.data.slice(0, 6));
            } else {
                setError('Error al cargar productos');
            }
        } catch (error) {
            console.log(error);
            setError('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    // ... (resto del código igual)
}

export default Product;