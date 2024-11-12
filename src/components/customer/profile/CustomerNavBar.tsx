'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from 'next-auth/react';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';

interface CustomerNavBarProps {
  email: string;
}

export const CustomerNavBar: React.FC<CustomerNavBarProps> = ({ email }) => {
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      setSession(session);
    };

    fetchSession();
  }, []);

  return (
    <div className="flex justify-between pt-5">
      <button className="py-2 text-3xl font-bold text-black">OneClick</button>
      <div className="flex text-sm justify-center items-center">
        {session?.user ? (
          <div className="flex">
            <p className="mr-4">{email}</p>
            <button
              onClick={() =>
                signOut({
                  redirect: true,
                  callbackUrl: '/',
                })
              }
            >
              Sign out
            </button>
          </div>
        ) : (
          <div>
            <button
              onClick={() => router.push('/sign-in')}
              className="mx-2 py-2 w-28 rounded-lg hover:bg-white text-black"
            >
              Login
            </button>
            <button
              onClick={() => router.push('/sign-up')}
              className="mx-2 py-2 w-28 rounded-lg text-white bg-black "
            >
              Sign up
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
