import Image from 'next/image';
import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import DashboardButton from '../../components/UI/DashboardButton';
import Youtube from '../../public/img/icons/youtube.svg';
import { getAllCreators } from '../../services/firebase';

const CreatorAccounts = () => {
  const [accounts, setAccounts] = useState([]);

  const getAdminAccount = async () => {
    const res = await getAllCreators();
    setAccounts(Object.values(res));
  };

  useEffect(() => {
    getAdminAccount();
  }, []);

  return (
    <div>
      <h2 className="text-6xl">All Creators</h2>
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
    <div className="my-s4 flex w-4/5 items-center gap-12">
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
      {account.youtubeChannelId && (
        <a
          href={`https://www.youtube.com/channel/${account.youtubeChannelId}`}
          target="_blank"
          rel="noreferrer"
        >
          <Image src={Youtube} alt="" width={25} height={25} />
        </a>
      )}
      <div className="w-[200px]">
        <DashboardButton onClick={() => setModal(true)}>
          View Profile
        </DashboardButton>
      </div>
    </div>
  );
};

const AccountDetails = ({ account, setModal }) => {
  return (
    <div className="place-contents-center fixed top-0 left-0 z-10 flex h-screen w-screen items-center justify-center bg-black text-lg">
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
        <div className="my-s3">
          Full Name:
          <span className="pl-s2">
            {account.firstName + ' ' + account.lastName}
          </span>
        </div>

        <div>
          Email:
          <span className="pl-s2">{account.email}</span>
        </div>

        {account.youtubeChannelId && (
          <a
            href={`https://www.youtube.com/channel/${account.youtubeChannelId}`}
            target="_blank"
            rel="noreferrer"
            className="inline"
          >
            <Image src={Youtube} alt="" width={25} height={25} />
          </a>
        )}
      </div>
    </div>
  );
};

CreatorAccounts.getLayout = DashboardLayout;

export default CreatorAccounts;
