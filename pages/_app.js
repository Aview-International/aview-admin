import { useEffect } from 'react';
import UserContextProvider from '../store/user-profile';
import { MenuOpenContextProvider } from '../store/menu-open-context';
import '../styles/globals.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import store from '../store';
import { Provider, useDispatch } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import Cookies from 'js-cookie';
import { setAuthState, setUser } from '../store/reducers/user.reducer';
import { auth } from '../services/firebase';
import useUserProfile from '../hooks/useUserProfile';

const MyApp = ({ Component, pageProps }) => {
  useEffect(() => {
    const setViewportHeight = () => {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    setViewportHeight();
    window.onresize = setViewportHeight;
  }, []);

  return (
    <Provider store={store}>
      <MenuOpenContextProvider>
        <UserContextProvider>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
          <Layout Component={Component} pageProps={pageProps} />
        </UserContextProvider>
      </MenuOpenContextProvider>
    </Provider>
  );
};

const Layout = ({ Component, pageProps }) => {
  useUserProfile();
  const dispatch = useDispatch();
  useEffect(() => {
    // handle auth
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(
          setUser({
            email: user.email,
            firstName: user.displayName,
            picture: user.photoURL,
            uid: user.uid,
          })
        );
        dispatch(setAuthState(true));
        Cookies.set('token', user.accessToken);
      } else {
        Cookies.remove('uid');
        Cookies.remove('token');
      }
    });

    return () => unsubscribe();
  }, []);

  if (Component.getLayout) {
    return Component.getLayout(<Component {...pageProps} />);
  } else {
    return <Component {...pageProps} />;
  }
};

export default MyApp;
