// components/ClerkAuth.jsx
import { SignedIn, SignedOut, SignIn, SignUp, UserButton } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

export const AuthButtons = () => {
  const navigate = useNavigate();

  return (
    <div className='relative flex justify-center gap-2'>
      <SignedOut>
        <button 
          onClick={() => navigate('/sign-in')}
          className="text-white bg-dark-100 rounded-full p-3 cursor-pointer"
        >
          Sign In
        </button>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
      <h5 className='font-bold text-gradient text-3xl'>StreamSquard</h5>
    </div>
  );
};

// Rest of your code remains the same...

export const SignInPage = () => {
  return (
    <div className="border border-red-50 p-2 hover:bg-black">
      <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
    </div>
  );
};

export const SignUpPage = () => {
  return (
    <div className="auth-container">
      <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
    </div>
  );
};