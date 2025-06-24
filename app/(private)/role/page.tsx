'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';

export default function RolePage() {
  const [role, setRole] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentRole, setCurrentRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentRole = async () => {
      try {
        const response = await fetch('/api/user/settings');
        if (!response.ok) throw new Error('Error al cargar la configuración');
        const data = await response.json();
        setCurrentRole(data.role);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentRole();
  }, []);

  const handleUpdateRole = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user/role', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      setSuccess(true);
      setCurrentRole(role);
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Error al actualizar el rol');
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Actualizar Rol de Usuario
        </Typography>

        {currentRole && (
          <Typography variant="body1" sx={{ mb: 2 }}>
            Rol actual: {currentRole}
          </Typography>
        )}

        <Box sx={{ mt: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Rol</InputLabel>
            <Select
              value={role}
              label="Rol"
              onChange={(e) => setRole(e.target.value)}
            >
              <MenuItem value="user">Peluquero</MenuItem>
              <MenuItem value="admin">Administrador</MenuItem>
              <MenuItem value="client">Cliente</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            onClick={handleUpdateRole}
            disabled={!role || loading}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Actualizar Rol'}
          </Button>
        </Box>

        <Snackbar
          open={showError}
          autoHideDuration={6000}
          onClose={() => setShowError(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setShowError(false)}
            severity="error"
            sx={{ width: '100%' }}
          >
            {error}
          </Alert>
        </Snackbar>

        <Snackbar
          open={success}
          autoHideDuration={6000}
          onClose={() => setSuccess(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setSuccess(false)}
            severity="success"
            sx={{ width: '100%' }}
          >
            Rol actualizado correctamente
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
} 