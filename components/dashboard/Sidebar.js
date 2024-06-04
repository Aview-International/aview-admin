import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { DASHBOARD_NAVLINKS } from '../../constants/constants';
import aviewLogo from '../../public/img/aview/logo.svg';
import signout from '../../public/img/icons/signout.svg';

const DashboardSidebar = () => {
  return (
    <aside className="fixed top-0 left-0 flex max-h-screen w-[170px] flex-col items-center overflow-y-auto py-s4 text-white">
      <div>
        <Link href="/dashboard">
          <Image
            src={aviewLogo}
            alt="AVIEW International logo"
            width={56}
            height={56}
          />
        </Link>
      </div>
      <Profile />
      <Navlink />
      <Signout />
    </aside>
  );
};

const Profile = () => {
  return (
    <div className="justify-content mt-s8 mb-s5">
      <p className="text-sm">Super Admin</p>
    </div>
  );
};

const Navlink = () => {
  const { route } = useRouter();

  return (
    <div className="w-full text-sm">
      {DASHBOARD_NAVLINKS.map((link, index) => (
        <Link
          href={link.route}
          key={`sidebar-link-${index}`}
          className={`hover:gradient-dark group relative mb-s2 flex items-center py-s1 px-s3 ${
            route === link.route && 'gradient-dark'
          }`}
        >
          <span
            className={`gradient-1 absolute right-0 top-1/4 block h-5 w-1 rounded-md group-hover:animate-dropin ${
              route === link.route ? 'visible' : 'invisible group-hover:visible'
            }`}
          ></span>
          <span
            className={`mr-5 group-hover:animate-popup ${
              route === link.route ? 'animate-popup' : ''
            }`}
          >
            <Image src={link.image} alt={link.text} width={20} height={20} />
          </span>
          <span
            className={route === link.route ? 'gradient-text gradient-1' : ''}
          >
            {link.text}
          </span>
        </Link>
      ))}
    </div>
  );
};

const Signout = () => {
  const handleLogout = () => {
    localStorage.removeItem('uid');
    localStorage.removeItem('token');
    window.location.href = '/';
  };
  return (
    <button
      className="mt-s8 flex w-full items-center px-s3 text-sm"
      onClick={handleLogout}
    >
      <span className="mr-5">
        <Image src={signout} alt="Sign out" width={20} height={20} />
      </span>
      Sign Out
    </button>
  );
};

export default DashboardSidebar;
