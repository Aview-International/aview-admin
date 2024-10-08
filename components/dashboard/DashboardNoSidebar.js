import aviewLogo from '../../public/img/aview/logo.svg';
import Image from 'next/image';
import Link from 'next/link';
import defaultProfilePicture from '../../public/img/graphics/default.png';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import ReviewerSettingsPopup from './ReviewerSettingsPopup';

const DashboardNoSidebar = ({ children }) => {
  const translator = useSelector((data) => data.user);
  const [settings, setSettings] = useState(false);

  return (
    <div>
      <ReviewerSettingsPopup
        show={settings}
        onClose={() => {
          setSettings(false);
        }}
        translator={translator}
      />
      <header className="flex w-full items-center justify-between py-s2 px-s4">
        <div className="flex">
          <Link href="/dashboard">
            <a className="mx-s4 capitalize">
              <Image
                src={aviewLogo}
                alt="AVIEW International logo"
                width={56}
                height={56}
              />
            </a>
          </Link>
          <div className="pt-[9px]">
            <h3>Hello {translator ? translator.name : ''}!</h3>
            <h3 className="text-gray-2">Welcome to your AVIEW dashboard</h3>
          </div>
        </div>
        <Image
          src={
            translator?.profilePicture ? profilePicture : defaultProfilePicture
          }
          alt="settings button"
          width={52}
          height={52}
          className="cursor-pointer rounded-full"
          onClick={() => {
            setSettings(true);
          }}
        />
      </header>
      <div className="h-[1px] w-full bg-gray-1"></div>

      <main className="relative">{children}</main>
    </div>
  );
};

export default DashboardNoSidebar;
