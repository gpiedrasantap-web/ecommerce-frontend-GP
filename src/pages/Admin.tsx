import { useLocation } from 'react-router-dom';
import { Col, Container, Row, Table, Button, Form } from 'react-bootstrap';
import '../styles/Category.css'; 
import { useEffect, useState } from 'react';
import api from '../api'; // ✅ NUEVA IMPORTACIÓN

function Admin() { 
    const { pathname } = useLocation(); 

    interface Pedido {
        idPedido: number;
        fechaPedido: string;
        estadoPedido: string;
        total: number;
        metodoPago: string;
        direccionEntrega: string;
        idCliente: string;
    }

    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingPedidoId, setEditingPedidoId] = useState<number | null>(null);
    const [updatedEstado, setUpdatedEstado] = useState<string>('');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]); 

    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                // ✅ CAMBIO: api.get en lugar de fetch
                const response = await api.get('/todosLosPedidos');
                setPedidos(response.data);
            } catch (error) {
                console.error('Error fetching pedidos:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchDevoluciones = async () => {
            try {
                // ✅ CAMBIO: api.get en lugar de fetch
                const response = await api.get('/todasLasDevoluciones');
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching devoluciones:', error);
            }
        };

        fetchDevoluciones();
        fetchPedidos();
    }, []);

    const handleSaveClick = async (pedidoId: number) => {
        try {
            // ✅ CAMBIO: api.put en lugar de fetch
            await api.put('/actualizarEstadoPedido', {
                idPedido: pedidoId,
                estadoPedido: updatedEstado,
            });

            // Update the local state after a successful update
            setPedidos((prevPedidos) =>
                prevPedidos.map((pedido) =>
                    pedido.idPedido === pedidoId ? { ...pedido, estadoPedido: updatedEstado } : pedido
                )
            );

            setEditingPedidoId(null);
        } catch (error) {
            console.error('Error updating pedido:', error);
            alert('Failed to update pedido. Please try again.');
        }
    };

    // ... (resto del código igual)
}

export default Admin;