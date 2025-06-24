'use client';

import { Box, Paper, Typography, CircularProgress, Snackbar, Alert, Button } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { es } from 'date-fns/locale';
import { format, isSameDay } from 'date-fns';
import useAgenda from '@/app/hooks/agenda/useAgenda';
import ReservationDialog from '@/app/components/ReservationDialog';

export default function AgendaPage() {
  const {
    state,
    handleDateChange,
    handleCopyLink,
    handleBookSlot,
    handleAddAppointment,
    handleMonthChange,
    closeDialogs,
  } = useAgenda();

  const {
    selectedDate,
    isMobile,
    loading,
    error,
    showError,
    showSuccess,
    showCopied,
    slotToBook,
    clientName,
    clientPhone,
    setClientName,
    setClientPhone,
    setOpenDialog,
    openDialog,
    timeSlots,
    isDayAvailable,
    isDayFull,
    isSlotTaken,
    getSlotClient,
  } = state;


  return (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      <Typography variant="h4" gutterBottom>
        Agenda mensual
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, maxWidth: 1200, mx: 'auto' }}>
        <Paper sx={{ p: isMobile ? 1 : 2, maxWidth: 700, flex: 1 }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
              <CircularProgress />
            </Box>
          ) : (
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
              <DateCalendar
                value={selectedDate}
                onChange={handleDateChange}
                onMonthChange={handleMonthChange}
                sx={{ width: '100%' }}
                slots={{
                  day: (props) => {
                    const { day } = props;
                    const isSelected = isSameDay(day, selectedDate);
                    const bgcolor = isSelected
                      ? isDayFull(day)
                        ? 'error.main'
                        : isDayAvailable(day)
                        ? 'success.main'
                        : undefined
                      : undefined;

                    return (
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          bgcolor,
                          color: isSelected && bgcolor ? '#fff' : undefined,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: isSelected ? 'bold' : undefined,
                          cursor: "pointer",
                          border: isSelected ? '2px solid' : undefined,
                          borderColor: isSelected ? (isDayFull(day) ? 'error.dark' : 'success.dark') : undefined,
                        }}
                        onClick={() => handleDateChange(day)}
                      >
                        {format(day, "d")}
                      </Box>
                    );
                  },
                }}
              />
            </LocalizationProvider>
          )}
        </Paper>

        <Paper sx={{ p: isMobile ? 1 : 2, minWidth: isMobile ? '100%' : 320, flex: 1, maxHeight: 420, overflowY: 'auto' }}>
          <Button variant="outlined" sx={{ mb: 2, alignSelf: 'flex-end' }} onClick={handleCopyLink}>
            Generar link
          </Button>
          <Typography variant="h6" gutterBottom>
            Turnos del día {selectedDate ? format(selectedDate, 'dd/MM/yyyy') : ''}
          </Typography>
          {loading ? (
            <CircularProgress />
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxHeight: 340, overflowY: 'auto' }}>
              {timeSlots.length === 0 ? (
                <Typography color="text.secondary">No hay horarios configurados para este día</Typography>
              ) : (
                timeSlots.map(slot => {
                  const taken = isSlotTaken(selectedDate, slot.start, slot.end);
                  const client = getSlotClient(selectedDate, slot.start, slot.end);
                  return (
                    <Box
                      key={slot.start + slot.end}
                      sx={{
                        bgcolor: taken ? 'error.main' : 'success.main',
                        color: '#fff',
                        borderRadius: 1,
                        px: 2,
                        py: 1,
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: taken ? 'not-allowed' : 'pointer',
                        opacity: taken ? 0.7 : 1
                      }}
                      onClick={() => !taken && handleBookSlot(slot)}
                    >
                      <span>
                        {slot.start} - {slot.end} {taken ? `(Tomado${client ? ': ' + client : ''})` : '(Disponible)'}
                      </span>
                    </Box>
                  );
                })
              )}
            </Box>
          )}
        </Paper>
      </Box>

      <ReservationDialog
        open={openDialog}
        slot={slotToBook}
        clientName={clientName}
        clientPhone={clientPhone}
        setClientName={setClientName}
        setClientPhone={setClientPhone}
        setOpenDialog={setOpenDialog}
        onClose={closeDialogs}
        onConfirm={handleAddAppointment}
      />

      {/* Snackbars */}
      <Snackbar open={showError} autoHideDuration={6000} onClose={closeDialogs} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={closeDialogs} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      <Snackbar open={showSuccess} autoHideDuration={4000} onClose={closeDialogs} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={closeDialogs} severity="success" sx={{ width: '100%' }}>
          Turno reservado con éxito
        </Alert>
      </Snackbar>
      <Snackbar open={showCopied} autoHideDuration={3000} onClose={closeDialogs} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={closeDialogs} severity="success" sx={{ width: '100%' }}>
          ¡Link copiado al portapapeles!
        </Alert>
      </Snackbar>
    </Box>
  );
}
