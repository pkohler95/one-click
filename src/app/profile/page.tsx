import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import ProfilePageClient from '@/components/ProfilePageClient';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const ProfilePage = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return <p className="text-white">You need to sign in</p>;
  }

  return <ProfilePageClient session={session} />;
};

export default ProfilePage;
