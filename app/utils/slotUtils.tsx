import { format } from "date-fns";

interface Schedule {
  id: string;
  date: string; 
  startTime: string;
  endTime: string;
  userId: string;
}

interface Appointment {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  clientName: string;
  clientPhone: string;
}

  function getTimeSlotsForDay(date: Date, schedules : Schedule[], minDuration: number) {
    const dateStr = format(date, "yyyy-MM-dd");
    const daySchedules = schedules.filter(s => s.date === dateStr);
    if (daySchedules.length === 0) return [];
    const slots: { start: string; end: string }[] = [];
    daySchedules.forEach(schedule => {
      const [startHour, startMinute] = schedule.startTime.split(":").map(Number);
      const [endHour, endMinute] = schedule.endTime.split(":").map(Number);
      let time = startHour * 60 + startMinute;
      const end = endHour * 60 + endMinute;
      while (time + minDuration <= end) {
        const slotStart = format(new Date(2000, 0, 1, Math.floor(time / 60), time % 60), "HH:mm");
        const slotEnd = format(new Date(2000, 0, 1, Math.floor((time + minDuration) / 60), (time + minDuration) % 60), "HH:mm");
        slots.push({ start: slotStart, end: slotEnd });
        time += minDuration;
      }
    });
    return slots;
  }

  function isDayFullFn(date: Date, schedules : Schedule[], appointments : Appointment[]) {
    const dateStr = format(date, "yyyy-MM-dd");
    const daySchedules = schedules.filter(s => s.date === dateStr);
    if (daySchedules.length === 0) return false; // No hay horarios, se considera disponible
    const dayAppointments = appointments.filter(a => a.date === dateStr);
    let totalMinutes = 0;
    dayAppointments.forEach(app => {
      const [sh, sm] = app.startTime.split(":").map(Number);
      const [eh, em] = app.endTime.split(":").map(Number);
      totalMinutes += (eh * 60 + em) - (sh * 60 + sm);
    });
    let availableMinutes = 0;
    daySchedules.forEach(sch => {
      const [sh, sm] = sch.startTime.split(":").map(Number);
      const [eh, em] = sch.endTime.split(":").map(Number);
      availableMinutes += (eh * 60 + em) - (sh * 60 + sm);
    });
    return totalMinutes >= availableMinutes && availableMinutes > 0;
  }
  
  function isDayAvailableFn(date: Date, schedules : Schedule[], appointments : Appointment[]) {
    const dateStr = format(date, "yyyy-MM-dd");
    const daySchedules = schedules.filter(s => s.date === dateStr);
    return daySchedules.length > 0 && !isDayFullFn(date, schedules, appointments);
  }

    function isSlotTakenFn(date: Date, start: string, end: string, appointments : Appointment[]) {
    const dateStr = format(date, "yyyy-MM-dd");
    return appointments.some(app =>
      app.date === dateStr &&
      app.startTime === start &&
      app.endTime === end
    );
  }
  function getSlotClientFn(date: Date, start: string, end: string, appointments : Appointment[]) {
    const dateStr = format(date, "yyyy-MM-dd");
    const app = appointments.find(app =>
      app.date === dateStr &&
      app.startTime === start &&
      app.endTime === end
    );
    return app ? app.clientName : null;
  }
  export { getTimeSlotsForDay, isDayAvailableFn, isDayFullFn, isSlotTakenFn, getSlotClientFn };