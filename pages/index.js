import { useState, useEffect } from 'react';
import PageTitle from '../components/SEO/PageTitle';
import Button from '../components/UI/Button';
import FormInput from '../components/FormComponents/FormInput';
import { emailValidator } from '../utils/regex';
import ErrorHandler from '../utils/errorHandler';
import { singleSignOnLogin } from '../services/apis';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import CircleLoader from '../public/loaders/CircleLoader';

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(true);
  const { isAuthChecking, isLoggedIn } = useSelector((state) => state.user);
  const router = useRouter();

  const handleSSO = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      localStorage.setItem('emailForSignIn', email);
      await singleSignOnLogin(email, window.location.origin);
      setHasSubmitted(true);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      ErrorHandler(error);
    }
  };

  useEffect(() => {
    if (!isAuthChecking) {
      if (isLoggedIn) {
        setIsRedirecting(true);
        router.push('/dashboard').then(() => setIsRedirecting(false));
      } else {
        setIsRedirecting(false);
      }
    }
  }, [isLoggedIn, isAuthChecking, router]);

  if (isAuthChecking || isRedirecting) {
   
    return (
      <div className="fixed top-0 left-0 flex h-screen w-screen items-center justify-center bg-black text-white">
        <CircleLoader />
      </div>
    );
  }

  return (
    <>
      <PageTitle title="Login" />
      <div className="fixed top-2/4 left-2/4 w-[min(400px,90%)] -translate-x-2/4 -translate-y-2/4 text-white">
        <h2 className="text-center text-7xl md:text-8xl">Log In</h2>
        {!hasSubmitted ? (
          <form onSubmit={handleSSO}>
            <FormInput
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isValid={emailValidator(email)}
              hideCheckmark
              type="email"
              name="email"
            />
            <Button isLoading={isLoading} type>
              Continue
            </Button>
          </form>
        ) : (
          <p className="text-center text-xl">
            An email is on the way 🚀
            <br />
            Check your inbox to proceed
          </p>
        )}
      </div>
    </>
  );
};

export default Home;
