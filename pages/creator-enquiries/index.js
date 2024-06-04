import DashboardLayout from '../../components/dashboard/DashboardLayout';
import PageTitle from '../../components/SEO/PageTitle';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Logo from '../../public/img/aview/logo.svg';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCreatorEnquiries } from '../../store/reducers/senders.reducer';
import { getSenders } from '../../services/api';
import ErrorHandler from '../../utils/errorHandler';
import Link from 'next/link';

const Messages = () => {
  const enquiries = useSelector((state) => state.creatorEnquiries);
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

        <EmptyState />
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
