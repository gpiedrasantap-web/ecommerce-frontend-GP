import { useLocation } from 'react-router-dom';
import { Col, Container, Row, Table } from 'react-bootstrap';
import '../styles/Category.css'; 
import { useEffect, useState } from 'react';
import api from '../api'; // ✅ NUEVA IMPORTACIÓN

function SolicitarDevolucion() {
    const { pathname } = useLocation();

    interface Devolucion {
        idDevolucion: number;
        idPedido: number;
        idCliente: number;
        fechaSolicitud: string;
        estadoDevolucion: string;
    } 

    const [devoluciones, setDevoluciones] = useState<Devolucion[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(() => {  
        const fetchDevoluciones = async () => {
            try {
                // ✅ CAMBIO: api.get en lugar de fetch
                const response = await api.get('/devolucionesCliente?idCliente=1');
                setDevoluciones(response.data);
            } catch (error) {
                console.error('Error fetching devolucion:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchData = async () => {
            setLoading(true);
            await fetchDevoluciones();
        };

        fetchData();
    }, []);

    // ... (resto del código igual)
}

export default SolicitarDevolucion;