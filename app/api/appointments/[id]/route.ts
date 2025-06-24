import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { deleteAppointment } from '@/app/services/appointments/deleteAppointment';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      select: {
        id: true,
        date: true,
        startTime: true,
        endTime: true,
        clientName: true,
        clientPhone: true,
        confirmed: true,
      }
    });

    if (!appointment) {
      return new NextResponse('Turno no encontrado', { status: 404 });
    }

    return NextResponse.json(appointment);
  } catch (error) {
    return new NextResponse(`Error al obtener el turno: ${error}`, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('No autorizado', { status: 401 });
    }

    const body = await request.json();
    const { confirmed } = body;

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: { user: true }
    });

    if (!appointment) {
      return new NextResponse('Turno no encontrado', { status: 404 });
    }

    // Verificar que el usuario sea el propietario del turno
    if (appointment.user.email !== session.user.email) {
      return new NextResponse('No autorizado', { status: 401 });
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: { confirmed },
      select: {
        id: true,
        date: true,
        startTime: true,
        endTime: true,
        clientName: true,
        clientPhone: true,
        confirmed: true,
      }
    });

    return NextResponse.json(updatedAppointment);
  } catch (error) {
    return new NextResponse(`Error al actualizar el turno: ${error}`, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('No autorizado', { status: 401 });
    }

    await deleteAppointment(session.user.email, id);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return new NextResponse(`Error interno del servidor ${error}`, { status: 500 });
  }
}
