import { MessagesLayout } from '.';
import Image from 'next/image';
import Arrow from '../../public/img/icons/arrow-back.svg';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import SendIcon from '../../public/img/icons/send-message.svg';
import FormInput from '../../components/FormComponents/FormInput';
import { getUserMessages, getUserProfile } from '../../services/api';
import { ErrorHandler } from '../../utils/errorHandler';
import {
  setSenderProfile,
  setUserMessages,
} from '../../store/reducers/messages.reducer';
import { useDispatch, useSelector } from 'react-redux';
import { useSocket } from '../../socket';
import Logo from '../../public/img/aview/logo.svg';

const MessageDetails = () => {
  const socket = useSocket();
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query;
  const [message, setMessage] = useState('');
  const { messages, user } = useSelector((state) => state.userMessages);

  const fetchUserMessages = async () => {
    try {
      const res = await getUserMessages(id);
      dispatch(setUserMessages(res));
    } catch (error) {
      ErrorHandler(error);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const res = await getUserProfile(id);
      dispatch(setSenderProfile(res));
    } catch (error) {
      ErrorHandler(error);
    }
  };

  useEffect(() => {
    if (id) fetchUserMessages();
    if (id && !user.firstName) fetchUserProfile();
  }, [id]);

  useEffect(() => {
    socket.on('new_message', () => {
      console.log('new new_message');
      if (id) fetchUserMessages();
    });
  }, []);

  const handleTypeEvent = () => {
    // socket.emit('typing', 'admin is typing');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    socket.emit('admin_message', {
      userId: id,
      timeStamp: Date.now(),
      message,
    });
    setMessage('');
  };

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
          <Image
            src={user.picture}
            alt="Profile Picture"
            width={32}
            height={32}
            className="rounded-full"
          />
        </div>
        <p className="ml-s1 text-2xl">
          {user.firstName} {user.lastName}
        </p>
      </div>
      <div className="">
        <div>
          {messages.map((item, index) => (
            <SingleMessage
              key={`message-${index}`}
              picture={user.picture}
              name={user.firstName + ' ' + user.lastName}
              {...item}
            />
          ))}
        </div>
        <form className="relative flex w-full" onSubmit={handleSubmit}>
          <FormInput
            placeholder="Type something..."
            extraClasses="mb-0"
            handleFocus={handleTypeEvent}
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

const SingleMessage = ({ timeStamp, message, picture, name, sender }) => (
  <div
    className={`my-s3 flex items-start text-sm ${
      sender === 'user' ? 'flex-row-reverse' : 'flex-row'
    }`}
  >
    <Image
      src={sender === 'admin' ? Logo : picture}
      alt=""
      width={40}
      height={40}
      className="rounded-full"
    />
    <div className="ml-3">
      <p>
        {sender === 'admin' ? 'Julia from Aview' : name}
        <span className="pl-s2">
          {new Date(timeStamp).toLocaleString('en-US', {
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
