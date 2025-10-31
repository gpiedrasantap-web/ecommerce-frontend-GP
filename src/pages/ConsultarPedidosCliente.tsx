import { useLocation } from 'react-router-dom';
import { Col, Container, Row, Table, Button } from 'react-bootstrap';
import '../styles/Category.css'; 
import { useEffect, useState } from 'react';
import api from '../api'; // ✅ NUEVA IMPORTACIÓN

function ConsultarPedidosCliente() {
    // ... (interface y estados anteriores iguales)

    useEffect(() => {  
        const fetchPedidos = async () => {
            try {
                // ✅ CAMBIO: api.get en lugar de fetch
                const response = await api.get('/pedidosCliente?idCliente=1');
                setPedidos(response.data);
            } catch (error) {
                console.error('Error fetching pedidos:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const solicitarDevolucion = async (pedido: Pedido) => {
        console.log('Solicitando devolución para el pedido:', pedido);
        try {
            // ✅ CAMBIO: api.post en lugar de fetch
            await api.post('/devolucion', {  
                idPedido: pedido.idPedido,
                idCliente: 1,
                fechaSolicitud: '2021-10-01',
                estadoDevolucion: 'EnProceso', 
            });
            
            alert('Devolución solicitada con éxito');
        } catch (error) {
            console.error('Error solicitando devolución:', error);
            alert('Ocurrió un error al solicitar la devolución');
        }
    };

    // ... (resto del código igual)
}

export default ConsultarPedidosCliente;