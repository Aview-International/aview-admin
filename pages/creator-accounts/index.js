import Image from 'next/image';
import { Fragment, useEffect, useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import DashboardButton from '../../components/UI/DashboardButton';
import { getAllCreators, updateAccountCharge } from '../api/firebase';
import Youtube from '../../public/img/icons/youtube.svg';
import Facebook from '../../public/img/icons/facebook.svg';
import Instagram from '../../public/img/icons/instagram.svg';
import FormInput from '../../components/FormComponents/FormInput';
import Check from '../../public/img/icons/check.svg';
import Cancel from '../../public/img/icons/cancel.svg';
import Edit from '../../public/img/icons/edit.svg';

const CreatorAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  const getAdminAccount = async () => {
    const res = await getAllCreators();
    setAccounts(Object.values(res));
  };

  useEffect(() => {
    getAdminAccount();
  }, [reloadTrigger]);

  return (
    <div className="text-white">
      <h2 className="text-6xl">All Creators</h2>
      <div>
        {accounts.map((account, index) => (
          <AccountInfo
            key={`account-${index}`}
            account={account}
            setReloadTrigger={setReloadTrigger}
          />
        ))}
      </div>
    </div>
  );
};

const AccountInfo = ({ account, setReloadTrigger }) => {
  const [modal, setModal] = useState(false);
  return (
    <div className="my-s4 flex w-4/5 items-center gap-12">
      {modal && (
        <AccountDetails
          account={account}
          setModal={setModal}
          setReloadTrigger={setReloadTrigger}
        />
      )}
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

const AccountDetails = ({ account, setModal, setReloadTrigger }) => {
  const [accountCharge, setAccountCharge] = useState(account.charge ?? 12);
  const [editCharge, setEditCharge] = useState(false);

  const handleEditCharge = async () => {
    try {
      await updateAccountCharge(account._id, accountCharge);
      setReloadTrigger(Math.random());
      setEditCharge(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="place-contents-center fixed top-0 left-0 z-10 flex flex h-screen w-screen items-center justify-center bg-black text-lg">
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

        <div className="my-s3 flex items-center">
          Charge:
          <span className="flex items-center px-s2">
            <span className="pr-1">$</span>
            {editCharge && (
              <FormInput
                value={accountCharge}
                onChange={(e) => setAccountCharge(e.target.value)}
              />
            )}
            {!editCharge && (account.charge ?? 12)}
          </span>
          {!editCharge && (
            <button onClick={() => setEditCharge(true)}>
              <Image src={Edit} alt="" width={25} height={25} />
            </button>
          )}
          {editCharge && (
            <Fragment>
              <button className="mr-s2" onClick={handleEditCharge}>
                <Image src={Check} alt="" width={25} height={25} />
              </button>
              <button onClick={() => setEditCharge(false)}>
                <Image src={Cancel} alt="" width={25} height={25} />
              </button>
            </Fragment>
          )}
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
