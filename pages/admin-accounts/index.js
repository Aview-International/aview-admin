import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import DashboardButton from '../../components/UI/DashboardButton';
import CopyToClipboard from '../../public/img/icons/copy-to-clipboard.svg';
import { toast } from 'react-toastify';
import ErrorHandler from '../../utils/errorHandler';
import { approveReviewerAccount, getAllAdmins } from '../../services/api';
import defaultPhoto from '../../public/img/people/default.png';
import OutsideClickHandler from 'react-outside-click-handler';
import CustomSelectInput from '../../components/FormComponents/CustomSelectInput';

const AdminAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [accountType, setAccountType] = useState('All Accounts');

  useEffect(() => {
    (async () => {
      try {
        const res = await getAllAdmins();
        setAccounts(res);
      } catch (error) {
        ErrorHandler(error);
      }
    })();
  }, []);

  return (
    <div>
      <div>
        <h2 className="text-6xl">All admins</h2>
        <div className='my-s3 w-1/2'>
          <CustomSelectInput
            text={'Accounts to display'}
            options={['Approved', 'Pending', 'All Accounts']}
            onChange={(el) => setAccountType(el)}
            hasSubmitted={false}
            defaultData={'All Accounts'}
          />
        </div>
      </div>
      <div>
        {accounts
          .filter((acct) =>
            accountType === 'Approved'
              ? acct.accountVerifiedByAview
              : accountType === 'Pending'
              ? !acct.accountVerifiedByAview
              : true
          )
          .map((account, index) => (
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
          src={account.picture ?? defaultPhoto}
          alt=""
        />
      </div>
      <div className="w-1/2">{account.name}</div>
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
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    try {
      setLoading(true);
      await approveReviewerAccount(account._id);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      ErrorHandler(error);
    }
  };

  return (
    <div className="fixed top-0 left-0 z-10 h-screen w-screen items-center justify-center bg-black/90">
      <OutsideClickHandler onOutsideClick={() => setModal(false)}>
        <div className="z-100 fixed top-1/2 left-1/2 max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-lg bg-gray-1 p-s4">
          <div>
            <Image
              width={100}
              height={100}
              className="rounded-full"
              src={account.picture ?? defaultPhoto}
              alt={account.lastName}
            />
          </div>
          <div>
            Name:
            <span className="pl-s2">{account.name}</span>
          </div>

          <div className="my-s3">
            Country: <span className="pl-s2">{account.country}</span>
          </div>

          <div className="flex justify-between">
            Email:
            <span className="pl-s2" ref={emailRef}>
              {account.email}
            </span>
            <CopyText contentRef={emailRef} />
          </div>
          <br />
          {account.accountVerifiedByAview ? (
            <p className="text-green">Account has been approved</p>
          ) : (
            <button
              onClick={handleApprove}
              className={`rounded-2xl p-s1 text-white ${
                loading ? 'bg-gray-1' : 'bg-green'
              }`}
              disabled={loading}
            >
              {loading ? 'Please wait' : 'Approve'}
            </button>
          )}
        </div>
      </OutsideClickHandler>
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
