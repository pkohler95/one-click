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

        console.log(existingUser); // Check if userType exists in the user object

        if (!existingUser) {
          return null;
        }

        const passwordMatch = await compare(
          credentials.password,
          existingUser.password
        );

        if (!passwordMatch) {
          return null;
        }

        // Ensure that name is always a string (fallback to empty string if null)
        return {
          id: `${existingUser.id}`,
          name: existingUser.name || '', // Provide a fallback for name if null
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
        token.name = user.name;
        token.email = user.email;
        token.userType = user.userType; // Add userType to the token
      }
      // console.log(token); // Log the token for debugging purposes
      return token;
    },
    // Session callback to include userType and other data in the session
    async session({ session, token }) {
      session.user.id = token.id; // Make sure to include id
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.userType = token.userType; // Add userType to the session
      return session;
    },
  },
};
