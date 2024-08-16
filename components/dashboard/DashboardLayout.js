import { useEffect, useState } from 'react';
import { getAdminProfile } from '../../services/firebase';
import FullScreenLoader from '../../public/loaders/FullScreenLoader';
import DashBoardHeader from './Header';
import DashboardSidebar from './Sidebar';
import Cookies from 'js-cookie';
import ErrorHandler from '../../utils/errorHandler';

const DashboardStructure = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const getProfile = async () => {
    try {
      const uid = Cookies.get('uid');
      await getAdminProfile(uid);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      ErrorHandler(error);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <>
      {isLoading ? (
        <FullScreenLoader />
      ) : (
        <main className="gradient-dark flex min-h-screen w-full text-white">
          <DashboardSidebar />
          <div className="ml-auto w-[calc(100%-170px)]">
            <DashBoardHeader />
            <div className="h-full max-h-full overflow-y-auto bg-black p-s4">
              {children}
            </div>
          </div>
        </main>
      )}
    </>
  );
};

const DashboardLayout = (page) => (
  <DashboardStructure>{page}</DashboardStructure>
);
export default DashboardLayout;
