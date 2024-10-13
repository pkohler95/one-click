import { authOptions } from '../../lib/auth';
import { getServerSession } from 'next-auth';
import CustomerProfileClient from '../../components/customer/profile/CustomerProfileClient';

const CustomerProfile = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return <p className="text-white">You need to sign in</p>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <CustomerProfileClient session={session} />
    </div>
  );
};

export default CustomerProfile;
