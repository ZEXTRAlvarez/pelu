import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getAppointments } from '@/app/services/appointments/getAppointments';
import { createAppointment } from '@/app/services/appointments/createAppointment';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('No autorizado', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    if (!date) {
      return new NextResponse('Fecha no proporcionada', { status: 400 });
    }

    const response = await getAppointments(session.user.email, date);
    return NextResponse.json(response);
  } catch (error) {
    return new NextResponse(`Error al obtener las citas: ${error}`, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('No autorizado', { status: 401 });
    }

    const body = await request.json();
    const newAppointment = await createAppointment(session.user.email, body);

    return NextResponse.json(newAppointment);
  } catch (error) {
    return new NextResponse(`Error al crear la cita: ${error}`, { status: 500 });
  }
}
