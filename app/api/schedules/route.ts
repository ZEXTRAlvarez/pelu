import { createSchedule } from '@/app/services/schedules/createSchedules';
import { deleteScheduleById } from '@/app/services/schedules/deleteSchedules';
import { getSchedules } from '@/app/services/schedules/getSchedules';
import { authorizeHairdresser } from '@/app/utils/authorizeHairdresser';
import { NextResponse } from 'next/server';


export async function GET() {
  try {
    const user = await authorizeHairdresser();
    const schedules = await getSchedules(user.id);
    return NextResponse.json(schedules);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await authorizeHairdresser();
    const body = await request.json();
    const newSchedule = await createSchedule(user.id, body);
    return NextResponse.json(newSchedule);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await authorizeHairdresser();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID es requerido' }, { status: 400 });
    }

    await deleteScheduleById(user.id, id);
    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
  }
}
