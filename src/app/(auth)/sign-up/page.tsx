import SignUpFlow from '@/components/auth/SignUpFlow';
import SignUpForm from '@/components/auth/SignUpForm';

const page = () => {
  return (
    <div className="w-full">
      {/* <SignUpForm /> */}
      <SignUpFlow />
    </div>
  );
};

export default page;
