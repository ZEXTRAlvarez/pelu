import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { deleteScheduleById } from '@/app/services/schedules/deleteSchedules';

type RouteSegment = {
  params: Promise<{ id: string }>;
};

export async function DELETE(request: NextRequest, segment: RouteSegment): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('No autorizado', { status: 401 });
    }

    const { id } = await segment.params;

    await deleteScheduleById(session.user.email, id);

    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error interno del servidor';
    return new NextResponse(message, { status: 500 });
  }
}
