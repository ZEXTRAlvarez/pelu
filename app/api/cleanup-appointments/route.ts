import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { cleanupUnconfirmedAppointments } from '@/app/services/appointments/cleanupUnconfirmedAppointments';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('No autorizado', { status: 401 });
    }

    const result = await cleanupUnconfirmedAppointments();
    
    return NextResponse.json({
      success: true,
      message: `Se eliminaron ${result.deleted} turnos no confirmados`,
      deleted: result.deleted
    });
  } catch (error) {
    return new NextResponse(`Error al limpiar turnos: ${error}`, { status: 500 });
  }
} 