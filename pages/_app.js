import { useEffect } from 'react';
import UserContextProvider from '../store/user-profile';
import { MenuOpenContextProvider } from '../store/menu-open-context';
import '../styles/globals.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import store from '../store';
import { Provider, useDispatch } from 'react-redux';
import { SocketProvider, useSocket } from '../socket';
import { setIncomingMessages } from '../store/reducers/messages.reducer';

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
  useEffect(() => {
    socket.auth = { userId: 'admin' };

    socket.on('connect', () => {
      console.log('socket connected, id: ' + socket.id, socket.auth);
    });

    socket.on('disconnect', () => {
      console.log('socket disconnected, id:' + socket.id);
    });

    socket.on('new_user_message', (message) => {
      dispatch(setIncomingMessages(message));
    });

    socket.on('new_user_message', (message) => {
      dispatch(setIncomingMessages(message));
    });
  }, []);

  if (Component.getLayout) {
    return Component.getLayout(<Component {...pageProps} />);
  } else {
    return <Component {...pageProps} />;
  }
};

export default MyApp;
