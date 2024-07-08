import Image from 'next/image';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import Border from '../components/UI/Border';
import Shadow from '../components/UI/Shadow';
import Google from '../public/img/icons/google.svg';
import { UserContext } from '../store/user-profile';
import ButtonLoader from '../public/loaders/ButtonLoader';
import { toast } from 'react-toastify';
import PageTitle from '../components/SEO/PageTitle';
import Cookies from 'js-cookie';
import { signInWithGoogle, createNewSuperAdmin } from '../services/firebase';

const Login = () => {
  const router = useRouter();
  const { user, updateUser } = useContext(UserContext); //error 
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    const emails = JSON.parse(process.env.NEXT_PUBLIC_ALLOWED_EMAILS);
    setIsLoading(true);
    const { _tokenResponse } = await signInWithGoogle();
    updateUser({
      ...user,
      email: _tokenResponse.email,
      firstName: _tokenResponse.firstName,
      lastName: _tokenResponse.lastName,
      picture: _tokenResponse.photoUrl,
    });
    if (emails.includes(_tokenResponse.email)) {
      createNewSuperAdmin(
        _tokenResponse.localId,
        _tokenResponse.firstName,
        _tokenResponse.lastName,
        _tokenResponse.email,
        _tokenResponse.photoUrl
      );

      Cookies.set('uid', _tokenResponse.localId);
      Cookies.set('token', _tokenResponse.idToken);
      toast.success('Login successful');
      const prevRoute = Cookies.get('redirectUrl');
      if (prevRoute) {
        Cookies.remove('redirectUrl');
        router.push(decodeURIComponent(prevRoute));
      } else router.push('/dashboard');
    } else {
      toast.error('Authentication failed');
    }
  };

  return (
    <>
      <PageTitle title="Super Admin Console - Aview International" />
      <div className="fixed top-2/4 left-2/4 w-[min(400px,90%)] -translate-x-2/4 -translate-y-2/4 text-white">
        <h2 className="mb-8 text-center text-7xl md:text-8xl">Log In</h2>
        <Shadow classes="w-full">
          <Border borderRadius="full" classes="w-full">
            <button
              className="flex w-full items-center justify-center rounded-full bg-black p-2 text-white md:p-3"
              onClick={handleSubmit}
            >
              {isLoading ? (
                <ButtonLoader />
              ) : (
                <>
                  <span className="flex items-center justify-center pr-s1">
                    <Image src={Google} alt="Google" />
                  </span>
                  Continue with Google
                </>
              )}
            </button>
          </Border>
        </Shadow>
      </div>
    </>
  );
};

export default Login;
