export async function getAppointmentsByDate(dateStr: string) {
  const res = await fetch(`/api/appointments?date=${dateStr}`);
  return res.ok ? await res.json() : [];
}

export async function getSchedules() {
  const res = await fetch('/api/schedules');
  return res.ok ? await res.json() : [];
}

export async function getSettings() {
  const res = await fetch('/api/settings');
  return res.ok ? await res.json() : { minAppointmentDuration: 30 };
}

export async function createAppointment(data: {
  date: string;
  startTime: string;
  endTime: string;
  clientName: string;
  clientPhone: string;
}) {
  const res = await fetch('/api/appointments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || 'Error al crear el turno');
  }

  return await res.json();
}
