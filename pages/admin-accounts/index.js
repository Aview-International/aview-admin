import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import DashboardButton from '../../components/UI/DashboardButton';
import { getAllAdmins } from '../api/firebase';
import CopyToClipboard from '../../public/img/icons/copy-to-clipboard.svg';
import { toast } from 'react-toastify';

const AdminAccounts = () => {
  const [accounts, setAccounts] = useState([]);

  const getAdminAccount = async () => {
    const res = await getAllAdmins();
    setAccounts(Object.values(res));
  };

  useEffect(() => {
    getAdminAccount();
  }, []);
  return (
    <div>
      <h2 className="text-6xl">All admins</h2>
      <div>
        {accounts.map((account, index) => (
          <AccountInfo key={`account-${index}`} account={account} />
        ))}
      </div>
    </div>
  );
};

const AccountInfo = ({ account }) => {
  const [modal, setModal] = useState(false);
  return (
    <div className="my-s4 flex w-[30rem] items-center gap-12">
      {modal && <AccountDetails account={account} setModal={setModal} />}
      <div>
        <Image
          loader={() => user.picture}
          unoptimized
          width={100}
          height={100}
          className="rounded-full"
          src={account.picture}
          alt={account.lastName}
        />
      </div>
      <div className="w-1/2">{account.firstName + ' ' + account.lastName}</div>
      <div className="w-1/2">
        <DashboardButton onClick={() => setModal(true)}>
          View Profile
        </DashboardButton>
      </div>
    </div>
  );
};

const AccountDetails = ({ account, setModal }) => {
  const emailRef = useRef(null);
  const passwwordRef = useRef(null);

  return (
    <div className="place-contents-center fixed top-0 left-0 z-10 flex flex h-screen w-screen items-center justify-center bg-black">
      <div>
        <div
          className="cursor-pointer text-right text-8xl"
          onClick={() => setModal(false)}
        >
          x
        </div>
        <div>
          <Image
            width={100}
            height={100}
            className="rounded-full"
            src={account.picture}
            alt={account.lastName}
          />
        </div>
        <div>
          Full Name:
          <span className="pl-s2">
            {account.firstName + ' ' + account.lastName}
          </span>
        </div>

        <div className="my-s3">
          Country: <span className="pl-s2">{account.country}</span>
        </div>

        <div className="flex justify-between">
          Email:
          <span className="pl-s2">
            <input
              type="text"
              ref={emailRef}
              readOnly
              value={account.email}
              className="bg-black focus:outline-none"
            />
          </span>
          <CopyText contentRef={emailRef} />
        </div>

        <div className="my-s3 flex justify-between">
          Password:
          <span className="pl-s2">
            <input
              type="text"
              ref={passwwordRef}
              readOnly
              value={account.password}
              className="bg-black focus:outline-none"
            />
          </span>
          <CopyText contentRef={passwwordRef} />
        </div>

        <div>
          Role: <span className="pl-s2">{account.role}</span>
        </div>
      </div>
    </div>
  );
};
const CopyText = ({ contentRef }) => {
  const handleClick = async () => {
    contentRef.current.select();
    navigator.clipboard
      .writeText(contentRef.current.value)
      .then(() => {
        toast.success('Copied to clipboard');
      })
      .catch(() => {
        toast.error('Something went wrong');
      });
  };

  return (
    <div className="group flex items-center pl-s1" onClick={handleClick}>
      <Image
        src={CopyToClipboard}
        alt="Copy"
        width={20}
        height={20}
        className="group-hover:opacity-60"
      />
      <span className="invisible pl-s2 text-xs group-hover:visible">
        Copy to clipboard
      </span>
    </div>
  );
};
AdminAccounts.getLayout = DashboardLayout;

export default AdminAccounts;
