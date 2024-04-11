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
    socket.auth = { userId: 'admin' };
    socket.on('connect', () => {
      return;
    });
    socket.on('disconnect', () => {
      return;
    });

    socket.on('new_user_message', async (data) => {
      console.log(data);
      try {
        const res = await getUserMessages(id);
        dispatch(setUserMessages(res));
      } catch (error) {
        ErrorHandler(error);
      }
      // if (id) fetchUserMessages();
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
