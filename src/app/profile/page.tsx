import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import ProfilePageClient from '@/components/ProfilePageClient';

const ProfilePage = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return <p>You need to sign in</p>;
  }

  return <ProfilePageClient session={session} />;
};

export default ProfilePage;
