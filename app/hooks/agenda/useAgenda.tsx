'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useTheme, useMediaQuery } from '@mui/material';
import { format } from 'date-fns';
import { createAppointment, getAppointmentsByDate, getSchedules, getSettings } from '@/app/(private)/agenda/service/agendaService';
import { getSlotClientFn, getTimeSlotsForDay, isDayAvailableFn, isDayFullFn, isSlotTakenFn } from '@/app/utils/slotUtils';
import { sendSMSMessage, generateConfirmationMessage } from '@/app/services/appointments/sendSMS';

type Appointment = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  clientName: string;
  clientPhone: string;
};
interface Schedule {
  id: string;
  date: string; 
  startTime: string;
  endTime: string;
  userId: string;
}



export default function useAgenda() {
  const { data: session } = useSession();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [minDuration, setMinDuration] = useState<number>(30);

  const [openDialog, setOpenDialog] = useState(false);
  const [slotToBook, setSlotToBook] = useState<{ start: string; end: string } | null>(null);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');

  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCopied, setShowCopied] = useState(false);

  // Fetch duración mínima
  useEffect(() => {
    getSettings().then((data) => {
      setMinDuration(data.minAppointmentDuration || 30);
    });
  }, []);

  // Fetch de datos
  useEffect(() => {
    if (!session?.user?.email || !selectedDate) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        const [appts, scheds] = await Promise.all([
          getAppointmentsByDate(dateStr),
          getSchedules(),
        ]);
        setAppointments(appts);
        setSchedules(scheds);
      } catch {
        setAppointments([]);
        setSchedules([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session?.user?.email, selectedDate]);

  // Slots generados
  const timeSlots = useMemo(
    () => getTimeSlotsForDay(selectedDate, schedules, minDuration),
    [selectedDate, schedules, minDuration]
  );

  const isDayAvailable = (date: Date) => isDayAvailableFn(date, schedules, appointments);
  const isDayFull = (date: Date) => isDayFullFn(date, schedules, appointments);
  const isSlotTaken = (date: Date, start: string, end: string) =>
    isSlotTakenFn(date, start, end, appointments);
  const getSlotClient = (date: Date, start: string, end: string) =>
    getSlotClientFn(date, start, end, appointments);

  const handleDateChange = (date: Date | null) => {
    if (date) setSelectedDate(date);
  };
 function handleMonthChange(month: Date): void {
    // Update the selected date to the first day of the new month
    handleDateChange(new Date(month.getFullYear(), month.getMonth(), 1));
  }
  const handleBookSlot = (slot: { start: string; end: string }) => {
    setSlotToBook(slot);
    setOpenDialog(true);
  };

  const handleAddAppointment = async () => {
    if (!slotToBook || !clientName || !clientPhone) {
      setError('Por favor complete todos los campos');
      setShowError(true);
      return;
    }

    try {
      const newAppointment = await createAppointment({
        date: format(selectedDate, 'yyyy-MM-dd'),
        startTime: slotToBook.start,
        endTime: slotToBook.end,
        clientName,
        clientPhone,
      });

      setOpenDialog(false);
      setClientName('');
      setClientPhone('');
      setSlotToBook(null);
      setShowSuccess(true);

      // Generar link de confirmación
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
      const confirmationLink = `${baseUrl}/confirm-appointment/${newAppointment.id}`;
      
      // Generar mensaje de SMS
      const message = generateConfirmationMessage(
        clientName,
        format(selectedDate, 'dd/MM/yyyy'),
        `${slotToBook.start} - ${slotToBook.end}`,
        confirmationLink
      );

      // Enviar mensaje de SMS
      try {
        await sendSMSMessage(clientPhone, message);
      } catch (smsError) {
        console.error('Error al enviar SMS:', smsError);
        // No mostrar error al usuario, solo log
      }

      // Refrescar turnos
      const appts = await getAppointmentsByDate(format(selectedDate, 'yyyy-MM-dd'));
      setAppointments(appts);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Error al crear el turno');
      } else {
        setError('Error al crear el turno');
      }
      setShowError(true);
    }
  };

  const handleCopyLink = () => {
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    const url = `${baseUrl}${window.location.pathname}?date=${dateStr}`;
    navigator.clipboard.writeText(url);
    setShowCopied(true);
  };

  const closeDialogs = () => {
    setShowError(false);
    setShowSuccess(false);
    setShowCopied(false);
    setOpenDialog(false);
  };

  return {
    state: {
      selectedDate,
      isMobile,
      loading,
      error,
      showError,
      showSuccess,
      showCopied,
      slotToBook,
      appointments,
      schedules,
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
    },
    handleDateChange,
    handleCopyLink,
    handleBookSlot,
    handleMonthChange,
    handleAddAppointment,
    closeDialogs,
  };
}
