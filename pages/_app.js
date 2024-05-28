import { useEffect } from 'react';
import UserContextProvider from '../store/user-profile';
import { MenuOpenContextProvider } from '../store/menu-open-context';
import '../styles/globals.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import store from '../store';
import { Provider, useDispatch } from 'react-redux';
import { SocketProvider, useSocket } from '../socket';
import { ErrorHandler } from '../utils/errorHandler';
import { setUserMessages } from '../store/reducers/messages.reducer';
import { getUserMessages } from '../services/api';
import { useRouter } from 'next/router';
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
          <SocketProvider>
            <Layout Component={Component} pageProps={pageProps} />
          </SocketProvider>
        </UserContextProvider>
      </MenuOpenContextProvider>
    </Provider>
  );
};

const Layout = ({ Component, pageProps }) => {
  const socket = useSocket();
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query;
  useEffect(() => {
    // handle auth
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) dispatch(setAuthState(true));
      else {
        Cookies.remove('uid');
        Cookies.remove('session');
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    dispatch(setAllLanguages());
    socket.auth = { userId: 'admin' };
    socket.on('connect', () => {
      return;
    });
    socket.on('disconnect', () => {
      return;
    });

    socket.on('new_user_message', async (data) => {
      try {
        const res = await getUserMessages(id);
        dispatch(setUserMessages(res));
      } catch (error) {
        ErrorHandler(error);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  if (Component.getLayout) {
    return Component.getLayout(<Component {...pageProps} />);
  } else {
    return <Component {...pageProps} />;
  }
};

export default MyApp;
