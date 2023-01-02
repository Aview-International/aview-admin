import Link from 'next/link';
import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { getAllAdmins } from '../api/firebase';

const AdminAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const getAdminAccount = async () => {
    const res = await getAllAdmins();
    console.log(Object.values(res));

    setAccounts(Object.values(res));
  };
  useEffect(() => {
    getAdminAccount();
  }, []);
  return (
    <>
      <div className="text-white">
        <h2 className="text-6xl">All admins</h2>
        <div>
          {accounts.map((item, index) => (
            <div className="my-s4">
              <div>Name: {item.firstName + ' ' + item.lastName}</div>
              <div>Email: {item.email}</div>
              <div>Role: {item.role}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

AdminAccounts.getLayout = DashboardLayout;

export default AdminAccounts;
