import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getRoles } from '@/app/services/roles/getRoles';
import { createRole } from '@/app/services/roles/createRole';
import { deleteRole } from '@/app/services/roles/deleteRole';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('No autorizado', { status: 401 });
    }

    const roles = await getRoles();
    return NextResponse.json(roles);
  } catch {
    return new NextResponse('Error interno del servidor', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('No autorizado', { status: 401 });
    }

    const body = await request.json();
    const newRole = await createRole(body);
    return NextResponse.json(newRole);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error interno del servidor';
    return new NextResponse(message, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('No autorizado', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return new NextResponse('Email requerido', { status: 400 });
    }

    await deleteRole(email);
    return new NextResponse(null, { status: 204 });
  } catch {
    return new NextResponse('Error interno del servidor', { status: 500 });
  }
}
