'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Box, Paper, Typography, Button, CircularProgress, Alert } from '@mui/material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Appointment {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  clientName: string;
  clientPhone: string;
  confirmed: boolean;
}

export default function ConfirmAppointmentPage() {
  const params = useParams();
  const appointmentId = params.id as string;
  
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await fetch(`/api/appointments/${appointmentId}`);
        if (!response.ok) {
          throw new Error('Turno no encontrado');
        }
        const data = await response.json();
        setAppointment(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el turno');
      } finally {
        setLoading(false);
      }
    };

    if (appointmentId) {
      fetchAppointment();
    }
  }, [appointmentId]);

  const handleConfirm = async () => {
    setConfirming(true);
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirmed: true }),
      });

      if (!response.ok) {
        throw new Error('Error al confirmar el turno');
      }

      setSuccess(true);
      setAppointment(prev => prev ? { ...prev, confirmed: true } : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al confirmar el turno');
    } finally {
      setConfirming(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!appointment) {
    return (
      <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
        <Alert severity="warning">Turno no encontrado</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Confirmar Turno
        </Typography>
        
        <Box sx={{ my: 3 }}>
          <Typography variant="h6" gutterBottom>
            Hola {appointment.clientName}!
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 2 }}>
            Detalles del turno:
          </Typography>
          
          <Box sx={{ 
            bgcolor: 'background.paper', 
            p: 2, 
            borderRadius: 1, 
            mb: 3, 
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: 1
          }}>
            <Typography variant="body1" sx={{ 
              fontWeight: 500,
              fontSize: '1rem',
              lineHeight: 1.5
            }}>
              📅 <strong>Fecha:</strong> {format(new Date(appointment.date), 'EEEE dd/MM/yyyy', { locale: es })}
            </Typography>
            <Typography variant="body1" sx={{ 
              fontWeight: 500,
              fontSize: '1rem',
              lineHeight: 1.5
            }}>
              ⏰ <strong>Horario:</strong> {appointment.startTime} - {appointment.endTime}
            </Typography>
          </Box>

          {appointment.confirmed ? (
            <Alert severity="success" sx={{ mb: 3 }}>
              ¡Turno confirmado exitosamente!
            </Alert>
          ) : (
            <>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Por favor confirma tu turno para mantenerlo reservado.
              </Typography>
              
              <Button
                variant="contained"
                size="large"
                onClick={handleConfirm}
                disabled={confirming}
                sx={{ mb: 2 }}
              >
                {confirming ? <CircularProgress size={24} /> : 'Confirmar Turno'}
              </Button>
            </>
          )}

          {success && (
            <Alert severity="success">
              ¡Gracias por confirmar tu turno! Te esperamos.
            </Alert>
          )}
        </Box>
      </Paper>
    </Box>
  );
} 