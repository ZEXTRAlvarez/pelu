'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import {
  Box,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Alert,
  Snackbar,
  MenuItem,
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { format, addMinutes } from 'date-fns';
import { useRouter } from 'next/navigation';

interface Appointment {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  clientName: string;
  clientPhone: string;
  notes?: string;
}

interface Schedule {
  id: string;
  date: string; // yyyy-MM-dd
  startTime: string;
  endTime: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface ScheduleValidation {
  isValid: boolean;
  schedules: Schedule[];
  error?: string;
}

interface User {
  id: string;
  minAppointmentDuration: number;
}

export default function AppointmentsPage() {
  const { data: session, status } = useSession();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [showError, setShowError] = useState(false);
  const router = useRouter();
  const [userConfig, setUserConfig] = useState<User | null>(null);

  const fetchAppointments = useCallback(async () => {
    if (!selectedDate) return;
    
    try {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const response = await fetch(`/api/appointments?date=${formattedDate}`);
      
      if (!response.ok) {
        throw new Error('Error al obtener los turnos');
      }
      const data = await response.json();
      setAppointments(data);
    } catch {
      setError('Error al cargar los turnos');
      setShowError(true);
    }
  }, [selectedDate]);

  useEffect(() => {
    console.log('Estado de la sesión:', { status, session });
    
    if (status === 'loading') {
      console.log('Cargando sesión...');
      return;
    }

    if (status === 'unauthenticated') {
      console.log('Usuario no autenticado, redirigiendo a login...');
      router.push('/signin');
      return;
    }

    const fetchData = async () => {
      try {
        console.log('Iniciando carga de datos...');
        
        // Cargar configuración del usuario
        const settingsResponse = await fetch('/api/settings');
        console.log('Respuesta de settings:', settingsResponse);
        
        if (settingsResponse.ok) {
          const settingsData = await settingsResponse.json();
          console.log('Configuración cargada:', settingsData);
          setUserConfig({
            id: session?.user?.id || '',
            minAppointmentDuration: settingsData.minAppointmentDuration || 30
          });
        } else {
          console.error('Error al cargar configuración:', await settingsResponse.text());
        }

        // Cargar horarios
        const schedulesResponse = await fetch('/api/schedules');
        console.log('Respuesta de schedules:', schedulesResponse);
        
        if (schedulesResponse.ok) {
          const schedulesData = await schedulesResponse.json();
          console.log('Horarios cargados:', schedulesData);
          setSchedules(schedulesData);
        } else {
          console.error('Error al cargar horarios:', await schedulesResponse.text());
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };

    if (session?.user?.email) {
      fetchData();
    }
  }, [session, status, router]);

  useEffect(() => {
    if (selectedDate && session?.user?.email) {
      fetchAppointments();
    }
  }, [selectedDate, session?.user?.email, fetchAppointments]);

  const isWithinSchedule = (date: string, startTime: string, endTime: string): ScheduleValidation => {
    console.log('Validando horario:', { date, startTime, endTime });
    console.log('Horarios disponibles:', schedules);
    
    // Buscar horarios para la fecha específica
    const daySchedules = schedules.filter((s: Schedule) => s.date === date);
    console.log('Horarios del día:', daySchedules.length);
  
    if (daySchedules.length === 0) {
      return {
        isValid: false,
        schedules: [],
        error: 'No hay horario configurado para este día'
      };
    }
  
    // Convertir todo a minutos para comparación
    const toMinutes = (time: string) => {
      const [h, m] = time.split(':').map(Number);
      return h * 60 + m;
    };
  
    const startMinutes = toMinutes(startTime);
    const endMinutes = toMinutes(endTime);
  
    const isValid = daySchedules.some(schedule => {
      const schedStart = toMinutes(schedule.startTime);
      const schedEnd = toMinutes(schedule.endTime);
      return startMinutes >= schedStart && endMinutes <= schedEnd;
    });
  
    return {
      isValid,
      schedules: daySchedules,
      error: isValid ? undefined : 'El horario seleccionado está fuera del horario de atención configurado'
    };
  };

  const handleAddAppointment = async () => {
    try {
      if (!selectedDate || !selectedTime || !clientName || !clientPhone) {
        setError('Por favor complete todos los campos');
        setShowError(true);
        return;
      }
  
      const startTime = selectedTime.padStart(5, '0');
      const endTime = format(addMinutes(new Date(`2000-01-01T${startTime}`), userConfig?.minAppointmentDuration || 15), 'HH:mm');
      const date = format(selectedDate, 'yyyy-MM-dd');
      
      console.log('Datos del turno:', { date, startTime, endTime });
  
      // Validar que el horario esté dentro del horario configurado
      const scheduleValidation = isWithinSchedule(date, startTime, endTime);
      console.log('Resultado de la validación:', scheduleValidation);
  
      if (!scheduleValidation.isValid) {
        setError(scheduleValidation.error || 'El horario seleccionado no está disponible');
        setShowError(true);
        return;
      }

      if (!scheduleValidation.isValid) {
        setError(scheduleValidation.error || 'El horario seleccionado no está disponible');
        setShowError(true);
        return;
      }

      const appointmentData = {
        date,
        startTime,
        endTime,
        clientName,
        clientPhone,
        userId: session?.user?.id
      };

      console.log('Enviando datos al backend:', appointmentData);

      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Error del backend:', errorData);
        throw new Error(errorData);
      }

      const newAppointment = await response.json();
      setAppointments([...appointments, newAppointment]);
      setClientName('');
      setClientPhone('');
      setSelectedTime('');
      setError('');
      setOpenDialog(false);
    } catch (error) {
      console.error('Error completo:', error);
      setError(error instanceof Error ? error.message : 'Error al crear el turno');
      setShowError(true);
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el turno');
      }

      await fetchAppointments();
    } catch {
      setError('Error al eliminar el turno');
      setShowError(true);
    }
  };

  const formatTime = (time: string) => {
    return time.padStart(5, '0');
  };

  const generateTimeSlots = (date: Date) => {
    console.log('=== INICIO generateTimeSlots ===');
    console.log('Fecha recibida:', date);
    
    if (!userConfig) {
      console.log('No hay configuración de usuario');
      return [];
    }
  
    const formattedDate = format(date, 'yyyy-MM-dd');
    console.log(schedules);
    console.log(formattedDate);
    const daySchedules = schedules.filter(s => s.date === formattedDate);
    console.log('Horarios del día:', daySchedules);
    
    if (daySchedules.length === 0) {
      console.log('No hay horarios configurados para este día');
      return [];
    }
  
    const slots: string[] = [];
    const minDuration = userConfig.minAppointmentDuration;
    console.log('Duración mínima:', minDuration);
  
    // Obtener las citas del día seleccionado
    const dayAppointments = appointments.filter(app => app.date === formattedDate);
    console.log('Citas del día:', dayAppointments);
  
    daySchedules.forEach(schedule => {
      console.log('Procesando horario:', schedule);
      
      // Convertir horarios a minutos para facilitar cálculos
      const [startHour, startMinute] = schedule.startTime.split(':').map(Number);
      const [endHour, endMinute] = schedule.endTime.split(':').map(Number);
      
      const startMinutes = startHour * 60 + startMinute;
      const endMinutes = endHour * 60 + endMinute;
      
      console.log('Horario en minutos:', { start: startMinutes, end: endMinutes });
  
      // Generar slots cada minDuration minutos
      for (let time = startMinutes; time + minDuration <= endMinutes; time += minDuration) {
        const slotStart = format(new Date(2000, 0, 1, Math.floor(time / 60), time % 60), 'HH:mm');
        const slotEnd = format(new Date(2000, 0, 1, Math.floor((time + minDuration) / 60), (time + minDuration) % 60), 'HH:mm');
        
        // Verificar si el slot está ocupado
        const isSlotAvailable = !dayAppointments.some(app => {
          const [appStartHour, appStartMinute] = app.startTime.split(':').map(Number);
          const [appEndHour, appEndMinute] = app.endTime.split(':').map(Number);
          
          const appStartMinutes = appStartHour * 60 + appStartMinute;
          const appEndMinutes = appEndHour * 60 + appEndMinute;
          
          return (time >= appStartMinutes && time < appEndMinutes) ||
                 (time + minDuration > appStartMinutes && time + minDuration <= appEndMinutes) ||
                 (time <= appStartMinutes && time + minDuration >= appEndMinutes);
        });
  
        if (isSlotAvailable) {
          console.log('Slot disponible:', { start: slotStart, end: slotEnd });
          slots.push(slotStart);
        }
      }
    });
  
    return slots;
  };

  return (
    <Box sx={{ p: 3, maxWidth: '100%', mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Turnos
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          sx={{ minWidth: 'auto', px: 2 }}
        >
          Agregar Turno
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        <Box sx={{ width: { xs: '100%', md: '66%' } }}>
          <Paper sx={{ p: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
              <DateCalendar
                value={selectedDate}
                onChange={(newValue) => {
                  console.log('Fecha seleccionada:', newValue);
                  setSelectedDate(newValue);
                }}
                sx={{ width: '100%' }}
              />
            </LocalizationProvider>
          </Paper>
        </Box>

        <Box sx={{ width: { xs: '100%', md: '34%' } }}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">
                Turnos para {selectedDate?.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
              </Typography>
            </Box>

            <List>
              {appointments.map((appointment) => (
                <ListItem key={appointment.id}>
                  <ListItemText
                    primary={`${appointment.clientName} - ${formatTime(appointment.startTime)}`}
                    secondary={`Tel: ${appointment.clientPhone}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDeleteAppointment(appointment.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>
      </Box>

      <Dialog 
        open={openDialog} 
        onClose={() => {
          setOpenDialog(false);
          setError('');
          setClientName('');
          setClientPhone('');
          setSelectedTime('');
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Agregar Nuevo Turno</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <Typography variant="subtitle1">
              Fecha seleccionada: {selectedDate ? format(selectedDate, 'dd/MM/yyyy') : ''}
            </Typography>

            {selectedDate && (
              <TextField
                select
                label="Horario"
                value={selectedTime}
                onChange={(e) => {
                  console.log('Horario seleccionado:', e.target.value);
                  setSelectedTime(e.target.value);
                }}
                fullWidth
                required
                helperText="Seleccione el horario de inicio del turno"
              >
                {generateTimeSlots(selectedDate).map((slot) => {
                  const endTime = format(
                    addMinutes(new Date(`2000-01-01T${slot}`), userConfig?.minAppointmentDuration || 15),
                    'HH:mm'
                  );
                  return (
                    <MenuItem key={slot} value={slot}>
                      {slot} - {endTime}
                    </MenuItem>
                  );
                })}
              </TextField>
            )}

            <TextField
              label="Nombre del Cliente"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              fullWidth
              required
            />

            <TextField
              label="Teléfono del Cliente"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              fullWidth
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setOpenDialog(false);
              setError('');
              setClientName('');
              setClientPhone('');
              setSelectedTime('');
            }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleAddAppointment}
            variant="contained"
            color="primary"
            disabled={!selectedDate || !selectedTime || !clientName || !clientPhone}
          >
            Agregar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowError(false)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
} 