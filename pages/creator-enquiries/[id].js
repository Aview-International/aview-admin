import DashboardLayout from '../../components/dashboard/DashboardLayout';
import PageTitle from '../../components/SEO/PageTitle';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Logo from '../../public/img/aview/logo.svg';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCreatorEnquiries } from '../../store/reducers/senders.reducer';
import {
  getSenders,
  markTicketAsResolved,
  sendEnquiryMessage,
} from '../../services/api';
import ErrorHandler from '../../utils/errorHandler';
import Textarea from '../../components/FormComponents/Textarea';
import SendIcon from '../../public/img/icons/send-message.svg';
import Modal from '../../components/UI/Modal';
import DashboardButton from '../../components/UI/DashboardButton';
import { toast } from 'react-toastify';
import Link from 'next/link';

const Messages = () => {
  const enquiries = useSelector((state) => state.creatorEnquiries);
  const [singleEnquiry, setSingleEnquiry] = useState({
    _id: '',
    createdAt: '',
    creatorId: '',
    creatorPicture: '',
    firstName: '',
    lastName: '',
    messages: [],
    resolved: false,
    updatedAt: '',
  });
  const router = useRouter();
  const dispatch = useDispatch();
  const fetchAllSenders = async () => {
    try {
      const response = await getSenders();
      dispatch(setCreatorEnquiries(response));
    } catch (error) {
      ErrorHandler(error);
    }
  };

  useEffect(() => {
    fetchAllSenders();
  }, []);

  useEffect(() => {
    if (router.query.id) {
      const data = enquiries.find((query) => query._id === router.query.id);
      setSingleEnquiry(data);
    }
  }, [router.query, enquiries]);

  return (
    <>
      <PageTitle title="Messages" />
      <div className="flex h-full rounded-2xl bg-white-transparent text-white">
        <div className="w-full rounded-l-2xl md:w-60 md:bg-white-transparent">
          <div className="flex items-center justify-between px-s2 py-s3">
            <p className="text-2xl">Enquiries</p>
          </div>
          {enquiries.map((data, i) => (
            <Sender key={i} router={router} data={data} dispatch={dispatch} />
          ))}
        </div>

        {router.query.id ? (
          <div className="w-full p-s2 md:w-[calc(100%-240px)]">
            <CreatorEnquiry
              data={singleEnquiry}
              fetchAllSenders={fetchAllSenders}
            />
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </>
  );
};

const EmptyState = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <Image src={Logo} alt="Aview" width={120} height={120} />
      <p className="mt-s3 text-2xl">Select a message to view the content</p>
    </div>
  );
};

const CreatorEnquiry = ({ data, fetchAllSenders }) => {
  const [message, setMessage] = useState('');
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (router.query.id) {
        await sendEnquiryMessage(message, router.query.id);
        setMessage('');
        toast.success('Message sent successfully!');
        await fetchAllSenders();
      }
    } catch (error) {
      ErrorHandler(error);
    }
  };

  const handleResolve = async () => {
    try {
      setLoading(true);
      await markTicketAsResolved(router.query.id);
      setModal(false);
      router.push('/creator-enquiries');
      await fetchAllSenders();
    } catch (error) {
      setLoading(false);
      ErrorHandler(error);
    }
  };

  return (
    <>
      <PageTitle title="Messages" />
      {modal && (
        <Modal closeModal={() => setModal(false)}>
          <p className="mb-s4 min-w-[200px]">Mark enquiry as resolved?</p>
          <DashboardButton onClick={handleResolve} isLoading={loading}>
            Continue
          </DashboardButton>
        </Modal>
      )}
      <div className="mx-auto flex h-full w-full max-w-[1200px] rounded-2xl bg-gradient-to-b from-[#ffffff26] to-[#ffffff0D] text-white">
        <div className="relative h-full w-full p-s2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image
                src={Logo}
                alt="Profile Picture"
                width={32}
                height={32}
                className="rounded-full"
              />
              <p className="ml-s1 text-2xl font-bold">
                {data?.firstName} {data?.lastName}
              </p>
            </div>
            <div>
              <DashboardButton onClick={() => setModal(true)}>
                mark as resolved
              </DashboardButton>
            </div>
          </div>
          <div>
            <div>
              {data?.messages &&
                data?.messages.map((item, i) => (
                  <SingleMessage
                    key={i}
                    lastName={data.lastName}
                    firstName={data.firstName}
                    creatorPicture={data.creatorPicture}
                    {...item}
                  />
                ))}
            </div>

            <form className="relative flex w-full" onSubmit={handleSubmit}>
              <Textarea
                placeholder="Type message..."
                value={message}
                name="Support Form"
                onChange={(e) => setMessage(e.target.value)}
              ></Textarea>
              <button
                type="submit"
                className="mx-s1 flex items-center justify-center p-s1"
              >
                <Image src={SendIcon} alt="Send" width={24} height={24} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

const SingleMessage = ({
  message,
  sender,
  timestamp,
  lastName,
  firstName,
  creatorPicture,
}) => (
  <div
    className={`my-s3 flex items-start text-sm ${
      sender === 'creator' ? 'flex-row-reverse' : 'flex-row'
    }`}
  >
    <div className="mx-s2">
      <Image
        src={sender === 'admin' ? Logo : creatorPicture}
        alt=""
        width={40}
        height={40}
        className="rounded-full"
      />
    </div>
    <div>
      <p>
        {sender === 'admin' ? 'Julia from Aview' : firstName + ' ' + lastName}
        <span className="pl-s2 font-light">
          {new Date(timestamp).toLocaleString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          })}
        </span>
      </p>
      <p className="mt-s1">{message}</p>
    </div>
  </div>
);

const Sender = ({ router, data, width }) => {
  return (
    <Link
      href={`/creator-enquiries/${data._id}`}
      className={`hover:gradient-1 flex cursor-pointer items-center rounded p-s1 md:my-s1 md:px-s2 ${
        router.query.id && router.query.id === data._id && 'gradient-1'
      }`}
    >
      <div className="mr-s1 flex items-center justify-center">
        <Image
          src={data.creatorPicture}
          alt="Profile Photo"
          width={width > 767 ? 24 : 48}
          height={width > 767 ? 24 : 48}
          className="rounded-full"
        />
      </div>
      <p className="w-full border-y border-white-transparent py-s1 text-lg md:border-none">
        {data.firstName} {data.lastName}
        <br />
        <span className="inline text-sm text-gray-2 md:hidden">
          Reply {data.firstName}.
        </span>
      </p>
    </Link>
  );
};

Messages.getLayout = DashboardLayout;

export default Messages;

export const MessagesLayout = (page) =>
  DashboardLayout(<Messages>{page}</Messages>);
