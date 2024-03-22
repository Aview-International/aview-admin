import DashboardLayout from '../../components/dashboard/DashboardLayout';
import PageTitle from '../../components/SEO/PageTitle';
import Image from 'next/image';
import Logo from '../../public/img/aview/logo.svg';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getReviewerMessages,
  markReviewerConcernAsCompleted,
} from '../../services/api';
import { errorHandler } from '../../utils/errorHandler';
import { setReviewerMessages } from '../../store/reducers/messages.reducer';
import CopyToClipboard from '../../public/img/icons/copy-to-clipboard.svg';
import { toast } from 'react-toastify';
import DashboardButton from '../../components/UI/DashboardButton';
import Modal from '../../components/UI/Modal';

const Messages = () => {
  const messages = useSelector((state) => state.userMessages.reviewersMessages);
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [index, setIndex] = useState(undefined);
  const fetchAllSenders = async () => {
    try {
      const res = await getReviewerMessages();
      dispatch(setReviewerMessages(res));
    } catch (error) {
      errorHandler(error);
    }
  };

  useEffect(() => {
    fetchAllSenders();
  }, []);

  const openModal = (idx) => {
    setIndex(idx);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const copyToClipboard = async (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success('Copied link to clipboard');
      })
      .catch(() => {
        toast.error('Something went wrong');
      });
  };

  return (
    <>
      <PageTitle title="Reviewers" />
      <div className="rounded-2xl bg-white-transparent px-s5 py-s4 text-white">
        <p className="text-2xl">Reviewers Inquiries</p>
        {modalOpen && (
          <MessageDetails
            closeModal={closeModal}
            messages={messages}
            index={index}
            copyToClipboard={copyToClipboard}
            fetchAllSenders={fetchAllSenders}
          />
        )}

        {messages.length > 0 ? (
          <ol className="list-decimal">
            {messages.map((data, idx) => (
              <li key={idx} className="group my-s3">
                <div className="flex h-16 items-center">
                  <p className="mr-s2 text-xl">{data.email} </p>
                  <div className="max-w-20 hidden group-hover:block">
                    <DashboardButton onClick={() => openModal(idx)}>
                      Open Message
                    </DashboardButton>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <EmptyState />
        )}
      </div>
    </>
  );
};

const MessageDetails = ({
  closeModal,
  messages,
  index,
  copyToClipboard,
  fetchAllSenders,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const resolve = async () => {
    try {
      setIsLoading(true);
      await markReviewerConcernAsCompleted(messages[index]._id);
      fetchAllSenders();
      setIsLoading(false);
      closeModal();
    } catch (error) {
      setIsLoading(false);
      errorHandler(error);
    }
  };
  return (
    <Modal closeModal={closeModal}>
      <div className="min-w-[35rem]">
        <div className="flex items-center">
          <p className="mr-s2 text-2xl">From {messages[index].email}</p>
          <button onClick={() => copyToClipboard(messages[index].email)}>
            <Image src={CopyToClipboard} alt="" />
          </button>
        </div>
        <p className="mt-s2 mb-s1">Message</p>
        <p className="mb-s3 rounded-md bg-white-transparent p-s2">
          {messages[index].message}
        </p>
        <div className="mx-auto max-w-[13rem]">
          <DashboardButton onClick={resolve} isLoading={isLoading}>
            Mark as resolved
          </DashboardButton>
        </div>
      </div>
    </Modal>
  );
};

const EmptyState = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <Image src={Logo} alt="Aview" width={120} height={120} />
      <p className="mt-s3 text-2xl">No reviewers inquiries yet</p>
    </div>
  );
};

Messages.getLayout = DashboardLayout;

export default Messages;
