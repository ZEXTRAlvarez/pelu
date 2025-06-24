'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Snackbar,
  Alert,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { format, parse } from 'date-fns';

interface UserSettings {
  id: string;
  minAppointmentDuration: number;
}

interface Schedule {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  userId: string;
}

interface Appointment {
  id: string;
  startTime: string;
  endTime: string;
  clientName: string;
  clientPhone: string;
  date: string;
}

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [error, setError] = useState('');
  const [settings, setSettings] = useState<UserSettings>({
    id: '',
    minAppointmentDuration: 15
  });
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  const fetchAppointments = useCallback(async (date: Date) => {
    try {
      const formattedDate = format(date, 'yyyy-MM-dd');

      const response = await fetch(`/api/appointments?date=${formattedDate}`);
      
      if (!response.ok) {
        setSnackbar({ open: true, message: `Error al cargar las citas`, severity: 'error' });
        return;
      }

      const data = await response.json();
      
      // Asegurarnos de que las fechas estén en el formato correcto
      const formattedAppointments = data.map((appointment: Appointment) => ({
        ...appointment,
        date: format(new Date(appointment.date), 'yyyy-MM-dd')
      }));
      
      setAppointments(formattedAppointments);
    } catch (error) {
      setSnackbar({ open: true, message: `Error al cargar las citas ${error}`, severity: 'error' });
    }
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.email) {
      console.log('Email del usuario:', session.user.email);
      fetchUserConfig();
      fetchSchedules();
    }
  }, [session?.user?.email]);

  const fetchUserConfig = async () => {
    try {
      console.log('Iniciando fetchUserConfig...');
      const response = await fetch('/api/settings');
      console.log('Respuesta de configuración:', response);
      
      if (!response.ok) {
        setSnackbar({ open: true, message: 'Error al cargar la configuración', severity: 'error' });
      }

      const data = await response.json();

      if (!data.id) {
        setSnackbar({ open: true, message: 'Error en la configuración del usuario', severity: 'error' });
      }

      setSettings({
        id: data.id,
        minAppointmentDuration: data.minAppointmentDuration || 15
      });
    } catch {
      setSnackbar({ open: true, message: 'Error al cargar la configuración', severity: 'error' });
    }
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      fetchAppointments(date);
    } else {
      setAppointments([]);
    }
  };

  useEffect(() => {
    if (selectedDate && session?.user?.email) {
      fetchAppointments(selectedDate);
    }
  }, [selectedDate, session?.user?.email, fetchAppointments]);

  const handleAddSchedule = async () => {
    if (!startTime || !endTime || !selectedDate) {
      setError('Por favor complete todos los campos');
      return;
    }
    try {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const response = await fetch('/api/schedules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: formattedDate,
          startTime,
          endTime
        }),
      });
      if (!response.ok) {
        throw new Error('Error al agregar horario');
      }
      setSnackbar({ open: true, message: `Horario cargado con éxito`, severity: 'success' });
      const newSchedule = await response.json();
      setSchedules(prev => [...prev, newSchedule]);
      setStartTime('');
      setEndTime('');
    } catch {
      setSnackbar({ open: true, message: `Error al agregar horario`, severity: 'error' });
      setError('Error al agregar horario');
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    try {
      const response = await fetch(`/api/schedules?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        setSnackbar({ open: true, message: `Error al eliminar el horario`, severity: 'error' });
        return;
      }

      setSchedules(prev => prev.filter(schedule => schedule.id !== id));
    } catch {
      setSnackbar({ open: true, message: `Error al eliminar el horario`, severity: 'error' });
      setError('Error al eliminar el horario');
      setOpenDialog(true);
    }
  };

  const handleUpdateSettings = async () => {
  try {
    const response = await fetch('/api/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        minDuration: settings.minAppointmentDuration,
      }),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar la configuración');
    }

    const updatedSettings = await response.json();

    setSettings(prev => ({
      ...prev,
      minAppointmentDuration: updatedSettings.minAppointmentDuration,
    }));

    setIsEditing(false); // Salimos del modo edición
    setSnackbar({ open: true, message: `Configuración actualizada con éxito`, severity: 'success' });
    setError('');
  } catch {
    setSnackbar({ open: true, message: `Error al actualizar la configuración`, severity: 'error' });
    setError('Error al actualizar la configuración');
  }
};

  const fetchSchedules = async () => {
    try {
      const response = await fetch('/api/schedules');
      if (!response.ok) {
        throw new Error('Error al cargar los horarios');
      }
      const data = await response.json();
      console.log('Horarios cargados:', data); // Para debugging
      setSchedules(data);
    } catch {
      console.error('Error al cargar horarios');
      setError('Error al cargar los horarios');
      setOpenDialog(true);
    }
  };

  if (status === 'loading') {
    return <Box sx={{ p: 3 }}>Cargando...</Box>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Configuración
      </Typography>

      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' },
        gap: 3
      }}>
        {/* Calendario */}
        <Paper sx={{ p: 2, width: { xs: '100%', md: '400px' } }}>
          <Typography variant="h6" gutterBottom>
            Calendario
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
            <DateCalendar
              value={selectedDate}
              onChange={handleDateChange}
              sx={{ width: '100%' }}
            />
          </LocalizationProvider>
        </Paper>

        {/* Horarios y Configuración */}
        <Box sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 3
        }}>
          {/* Horarios */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Horarios para {selectedDate ? format(selectedDate, 'EEEE d MMMM', { locale: es }) : ''}
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              mb: 2
            }}>
              <TextField
                label="Hora de inicio"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Hora de fin"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <Button
                variant="contained"
                onClick={handleAddSchedule}
                sx={{ minWidth: '120px' }}
              >
                Agregar
              </Button>
            </Box>

            <List sx={{ 
              maxHeight: '300px',
              overflow: 'auto',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1
            }}>
              {/* Mostrar citas existentes */}
              {appointments.length > 0 ? (
                <>
                  <ListItem>
                    <ListItemText 
                      primary="Turnos programados" 
                      sx={{ fontWeight: 'bold' }}
                    />
                  </ListItem>
                  {appointments.map((appointment) => {
                    console.log('Renderizando cita:', appointment);
                    return (
                      <ListItem
                        key={appointment.id}
                        divider
                        sx={{ bgcolor: 'action.hover' }}
                      >
                        <ListItemText
                          primary={`${format(parse(appointment.startTime, 'HH:mm', new Date()), 'HH:mm')} - ${format(parse(appointment.endTime, 'HH:mm', new Date()), 'HH:mm')}`}
                          secondary={`Cliente: ${appointment.clientName} - Tel: ${appointment.clientPhone}`}
                        />
                      </ListItem>
                    );
                  })}
                </>
              ) : (
                <ListItem>
                  <ListItemText 
                    primary="No hay turnos programados para este día" 
                    sx={{ color: 'text.secondary' }}
                  />
                </ListItem>
              )}

              {/* Mostrar horarios disponibles */}
              {selectedDate && (
                <>
                  <ListItem>
                    <ListItemText
                      primary="Horarios del día"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </ListItem>
                  <List>
                    {schedules.filter(schedule => schedule.date === format(selectedDate, 'yyyy-MM-dd')).map((schedule) => (
                      <ListItem key={schedule.id} divider>
                        <ListItemText
                          primary={`${format(parse(schedule.startTime, 'HH:mm', new Date()), 'HH:mm')} - ${format(parse(schedule.endTime, 'HH:mm', new Date()), 'HH:mm')}`}
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => handleDeleteSchedule(schedule.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
            </List>
          </Paper>

          {/* Configuración */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Duración mínima de los turnos
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                alignItems: 'center'
              }}
            >
              <TextField
                label="Duración mínima (minutos)"
                type="number"
                value={settings.minAppointmentDuration}
                onChange={(e) =>
                  setSettings({ ...settings, minAppointmentDuration: parseInt(e.target.value) })
                }
                fullWidth
                InputProps={{ inputProps: { min: 15, step: 15 } }}
                disabled={!isEditing}
              />
              <Button
                variant="contained"
                onClick={() => {
                  if (isEditing) {
                    handleUpdateSettings();
                  } else {
                    setIsEditing(true);
                  }
                }}
                sx={{ minWidth: '120px' }}
              >
                {isEditing ? 'Guardar' : 'Editar'}
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <DialogContentText>{error}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
} 