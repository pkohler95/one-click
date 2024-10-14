// next-auth.d.ts
import NextAuth from 'next-auth';

// Extend the User type
declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    userType: string; // Add userType to the User object
  }

  interface Session {
    user: {
      id: string;
      email: string;
      userType: string; // Add userType to the Session object
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    userType: string; // Add userType to the JWT token
  }
}
