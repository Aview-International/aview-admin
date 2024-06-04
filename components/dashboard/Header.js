import { useContext, useEffect, useState } from 'react';
import MenuOpenContext from '../../store/menu-open-context';
import MenuButtonIcon from '../navigation/MenuButtonIcon';
import { customGreeting } from '../../utils/greeting';
import { useSelector } from 'react-redux';

const DashBoardHeader = () => {
  const [time, setTime] = useState(customGreeting());
  const messageStatus = useSelector((state) => state.messages?.status);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(customGreeting());
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const menuOpenCtx = useContext(MenuOpenContext);

  return (
    <header className="relative flex w-full items-center justify-between px-s4 py-s3 text-white md:px-s9">
      <MenuButtonIcon
        handler={menuOpenCtx.openMenuHandler}
        styles={'absolute left-6'}
      />
      <div className="hidden md:block">
        <h3 className="text-xl">{time}!</h3>
        <p className="text-lg text-gray-2">Welcome to your Aview Dashboard</p>
      </div>
    </header>
  );
};

export default DashBoardHeader;
