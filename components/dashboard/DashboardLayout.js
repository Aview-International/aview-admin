import { useContext, useEffect, useState } from 'react';
import { getAdminProfile } from '../../services/firebase';
import { UserContext } from '../../store/user-profile';
import FullScreenLoader from '../../public/loaders/FullScreenLoader';
import DashBoardHeader from './Header';
import DashboardSidebar from './Sidebar';
import Cookies from 'js-cookie';

const DashboardStructure = ({ children }) => {
  // const { user, updateUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const getProfile = async () => {
    try {
      const _id = Cookies.get('uid');
      const res = await getAdminProfile(_id);
      // updateUser({
      //   ...user,
      //   email: res.email,
      //   picture: res.picture,
      //   firstName: res.firstName,
      //   lastName: res.lastName,
      // });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };
  const [user, updateUser] = useState({
    email: '',
    firstName: '',
    lastName: '',
    picture: '',
  });
  useEffect(() => {
    getProfile();
  }, []);

  return (
    <>
      {isLoading ? (
        <FullScreenLoader />
      ) : (
        <main className="gradient-dark flex min-h-screen w-full text-white">
          <DashboardSidebar user={user} />
          <div className="ml-auto w-[calc(100%-170px)]">
            <DashBoardHeader user={user} />
            <div className="max-h-[calc(100%-116px)] overflow-y-auto bg-black p-s4">
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
