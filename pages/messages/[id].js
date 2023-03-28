import { MessagesLayout } from '.';
// import andrew from '../../../public/img/team/andrew.png';
import Image from 'next/image';
import Arrow from '../../public/img/icons/arrow-back.svg';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import SendIcon from '../../public/img/icons/send-message.svg';
import FormInput from '../../components/FormComponents/FormInput';
import Cookies from 'js-cookie';
// import { fetchMessages, sendMessage } from '../../api/onboarding';

const MessageDetails = () => {
  const router = useRouter();
  const uid = Cookies.get('uid');

  const [message, setMessage] = useState('');
  const [chats, setChats] = useState([]);

  const callback = (e) => setChats(e);
  // const fetchUserMessages = async () => {
  //   try {
  //     const res = await fetchMessages(uid, callback);
  //     console.log(res);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   fetchUserMessages();
  // }, []);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   console.log(message);
  //   try {
  //     const res = await sendMessage(uid, message);
  //     console.log(res);
  //     setMessage('');
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  return (
    <div className="relative flex h-full flex-col justify-between">
      <div className="flex items-center">
        <button
          className="block pr-s2 brightness-0 invert md:hidden"
          onClick={() => router.back()}
        >
          <Image src={Arrow} alt="" with={10} height={20} />
        </button>
        <div>
          {/* <Image
            src={andrew}
            alt="Profile Picture"
            width={32}
            height={32}
            className="rounded-full"
          /> */}
        </div>
        <p className="ml-s1 text-2xl">Andrew Qiao</p>
      </div>
      <div className="">
        <div>
          {chats.map((item, index) => (
            <SingleMessage key={`message-${index}`} {...item} />
          ))}
        </div>
        <form className="relative flex w-full" onSubmit={handleSubmit}>
          <FormInput
            placeholder="Type something..."
            extraClasses="mb-0"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            type="submit"
            className="mx-s1 flex items-center justify-center
          p-s1"
          >
            <Image src={SendIcon} alt="" width={24} height={24} />
          </button>
        </form>
      </div>
    </div>
  );
};

MessageDetails.getLayout = MessagesLayout;
export default MessageDetails;

const SingleMessage = ({ timeStamp, message }) => (
  <div className="my-s3 flex text-sm">
    <div>
      <Image src={andrew} alt="" width={40} height={40} />
    </div>
    <div>
      <p>
        Andrew Qiao{' '}
        <span className="pl-s2">
          {new Date(timeStamp).toLocaleString('en-US', {
            // day: '2-digit',
            // month: 'short',
            // year: 'numeric',
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
