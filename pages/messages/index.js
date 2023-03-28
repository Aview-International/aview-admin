import DashboardLayout from '../../components/dashboard/DashboardLayout';
import PageTitle from '../../components/SEO/PageTitle';
import defaultPicture from '../../public/img/team/default.png';
import Edit from '../../public/img/icons/edit.svg';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import useWindowSize from '../../hooks/useWindowSize';
import Logo from '../../public/img/aview/logo.svg';
import { fetchSenders, getSenders } from '../api/firebase';
import { useEffect, useMemo, useState } from 'react';

const EmptyState = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <Image src={Logo} alt="Aview" width={120} height={120} />
      <p className="mt-s3 text-2xl">Select a message to view the content</p>
    </div>
  );
};

const Sender = ({ lastName, firstName, picture, _id, query, width }) => {
  return (
    <Link href={`/messages/${_id}`}>
      <a
        className={`flex items-center rounded md:my-s1 md:px-s2 ${
          query.id === _id && 'gradient-1'
        }`}
      >
        <div className="mr-s1 flex items-center justify-center">
          <Image
            src={picture}
            alt={firstName}
            width={width > 767 ? 24 : 48}
            height={width > 767 ? 24 : 48}
            className="rounded-full"
          />
        </div>
        <p className="w-full border-y border-white-transparent py-s1 text-lg md:border-none">
          {firstName} {lastName}
          <br />
          <span className="inline text-sm text-gray-2 md:hidden">
            Start a conversation with David.
          </span>
        </p>
      </a>
    </Link>
  );
};

const Messages = ({ children }) => {
  // const { width } = useWindowSize();
  const router = useRouter();
  const [senders, setSenders] = useState([]);

  let allsenders = [];
  // const callback = (e) => setSenders(e);

  const fetchAllSenders = async () => {
    try {
      // await fetchSenders(callback);
      const response = await getSenders();
      for (let i = 0; i < response.length; i++) {
        allsenders.push(response[i]);
      }
      response.map((item) => allsenders.push(item));
      setSenders(response);
    } catch (error) {
      console.log(error);
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
            <p className="text-2xl">Messages</p>
            <Image src={Edit} alt="Edit" width={40} height={40} />
          </div>

          {allsenders.map((item, index) => (
            <p>{item.email}</p>
            // <Sender key={`sender-${index}`} query={router.query} {...item} />
          ))}
        </div>
        {/* {router.query.id && (
          <div className="w-full p-s2 md:w-[calc(100%-240px)]">{children}</div>
        )} */}
        {/* {width > 768 && !router.query.id && <EmptyState />} */}
      </div>
    </>
  );
};

Messages.getLayout = DashboardLayout;

export default Messages;

export const MessagesLayout = (page) =>
  DashboardLayout(<Messages>{page}</Messages>);
