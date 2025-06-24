import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import prisma from './prisma';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      try {
        if (!user.email) {
          console.error('No email provided by Google');
          return false;
        }
        
        // Asegurarse de que el usuario existe en la base de datos
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email }
        });

        if (!dbUser) {
          // Crear el usuario si no existe
          await prisma.user.create({
            data: {
              email: user.email,
              name: user.name || 'Usuario',
              role: 'PELUQUERO',
              minAppointmentDuration: 15
            }
          });
        }

        return true;
      } catch (error) {
        console.error('Error during sign in:', error);
        return false;
      }
    },
    async session({ session, token }) {
      try {
        if (session.user?.email) {
          const dbUser = await prisma.user.findUnique({
            where: { email: session.user.email }
          });

          if (dbUser) {
            session.user.id = dbUser.id;
            session.user.role = dbUser.role;
          }
        }
        return session;
      } catch (error) {
        console.error('Error during session callback:', error);
        return session;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    }
  },
  pages: {
    signIn: '/signin',
    error: '/signin',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};