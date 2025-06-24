import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getUserSettings } from '@/app/services/settings/getuserSettings';
import { authorizeHairdresser } from '@/app/utils/authorizeHairdresser';
import { updateUserSettings } from '@/app/services/settings/updateUserSettings';


export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('No autorizado', { status: 401 });
    }

    const settings = await getUserSettings(session.user.email);
    return NextResponse.json(settings);
  } catch {
    return new NextResponse('Error al obtener la configuración', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await authorizeHairdresser();
    const body = await request.json();
    if (!user.email) {
      return NextResponse.json({ error: 'Email de usuario no encontrado' }, { status: 400 });
    }
    const result = await updateUserSettings(user.email, body.minDuration);
    return NextResponse.json(result);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
  }
}
