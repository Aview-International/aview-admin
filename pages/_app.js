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
import { setAuthState } from '../store/reducers/user.reducer';
import { setAllLanguages } from '../store/reducers/aview.reducer';
import { auth } from '../services/firebase';

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
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss={false}
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
  const dispatch = useDispatch();
  useEffect(() => {
    // handle auth
    dispatch(setAllLanguages());
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) dispatch(setAuthState(true));
      else {
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
