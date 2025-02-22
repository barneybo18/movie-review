// components/ClerkAuth.jsx
import { SignedIn, SignedOut, SignIn, SignInButton, SignUp, UserButton, useUser } from '@clerk/clerk-react';

export const AuthButtons = () => {
  return (
    <div className='relative flex justify-center gap-2'>
    <SignedOut>
        <SignInButton className="text-white  bg-dark-100 rounded-full p-3 cursor-pointer" />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
      <h5 className='font-bold text-gradient text-3xl'>StreamSquard</h5>
    </div>
  );
};

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