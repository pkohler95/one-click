import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import db from '@/lib/db';
import EmailProvider from 'next-auth/providers/email';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  secret: process.env.SECRET,
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER, // SMTP server configuration
      from: process.env.EMAIL_FROM, // Sender's email address
    }),
  ],
  pages: {
    signIn: '/auth/signin', // Custom sign-in page
  },
  session: {
    strategy: 'jwt',
  },
};
