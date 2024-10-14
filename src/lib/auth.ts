import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import db from '@/lib/db';
import { compare } from 'bcrypt';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  secret: process.env.SECRET,
  session: {
    strategy: 'jwt',
  },
  pages: { signIn: '/sign-in' },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'jsmith@gmail.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const existingUser = await db.user.findUnique({
          where: { email: credentials?.email },
        });

        if (!existingUser) {
          return null;
        }

        if (!credentials || !credentials.password) {
          throw new Error('Credentials are missing');
        }

        const passwordMatch = await compare(
          credentials.password,
          existingUser.password
        );

        if (!passwordMatch) {
          return null;
        }

        // Return the relevant user information
        return {
          id: `${existingUser.id}`,
          email: existingUser.email,
          userType: existingUser.userType, // Ensure userType is included
        };
      },
    }),
  ],
  callbacks: {
    // JWT callback to include all relevant user data in the token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.userType = user.userType; // Add userType to the token
      }
      return token;
    },
    // Session callback to include userType and other data in the session
    async session({ session, token }) {
      session.user.id = token.id; // Make sure to include id
      session.user.email = token.email;
      session.user.userType = token.userType; // Add userType to the session
      return session;
    },
  },
};
