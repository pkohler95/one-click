// app/components/UserProfile.tsx

interface UserProfileProps {
  name: string;
  email: string;
}

export default function UserProfile({ name, email }: UserProfileProps) {
  return (
    <div className="flex flex-col items-center p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-2">{name}</h2>
      <p className="text-gray-600 mb-4">{email}</p>
    </div>
  );
}
