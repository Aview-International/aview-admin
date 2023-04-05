import Image from 'next/image';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import FormInput from '../../components/FormComponents/FormInput';
import DashboardButton from '../../components/UI/DashboardButton';
import YoutubeVideoFrame from '../../components/UI/YoutubeVideoFrame';
import {
  getAllPendingJobs,
  getUserProfile,
  markVideoAsCompleted,
} from '../api/firebase';

const PendingJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [modalIndex, setModalIndex] = useState(undefined);

  const getPendingJobs = async () => {
    const res = await getAllPendingJobs();
    setJobs(
      res
        ? Object.values(res).map((item, i) => ({
            ...item,
            jobId: Object.keys(res)[i],
          }))
        : []
    );
  };

  useEffect(() => {
    getPendingJobs();
  }, [reloadTrigger]);

  return (
    <div>
      <h2 className="mb-s5 text-2xl">Pending Jobs</h2>

      {jobs.map((job, i) => (
        <JobDesc
          job={job}
          key={i}
          index={i}
          modalIndex={modalIndex}
          setModalIndex={setModalIndex}
          setReloadTrigger={setReloadTrigger}
        />
      ))}
    </div>
  );
};

const JobDesc = ({
  job,
  index,
  modalIndex,
  setModalIndex,
  setReloadTrigger,
}) => {
  const [creatorData, setCreatorData] = useState({
    name: '',
    picture: '',
  });
  const getProfile = async () => {
    const res = await getUserProfile(job.creatorId);
    setCreatorData({
      name: res?.firstName + ' ' + res?.lastName,
      picture: res?.picture,
    });
  };
  useEffect(() => {
    getProfile();
  }, []);

  return (
    <div className="mb-s3">
      {index === modalIndex && (
        <JobDetails
          job={job}
          creatorData={creatorData}
          setModalIndex={setModalIndex}
          setReloadTrigger={setReloadTrigger}
        />
      )}
      <div className="flex items-center">
        <Image
          loader={() => creatorData.picture}
          unoptimized
          width={55}
          height={55}
          className="rounded-full"
          src={creatorData.picture}
          alt={creatorData.lastName ?? ''}
        />
        <p className="pl-s3">{creatorData?.name}</p>
        <p className="mx-s8">
          {job.videoData.length} video{job.videoData.length > 1 ? 's' : ''}{' '}
          pending
        </p>
        <div className="w-[160px]">
          <DashboardButton onClick={() => setModalIndex(index)}>
            View jobs
          </DashboardButton>
        </div>
      </div>
    </div>
  );
};

const JobDetails = ({ setModalIndex, job, creatorData, setReloadTrigger }) => {
  const [showInput, setShowInput] = useState(false);
  const [url, setUrl] = useState('');

  console.log(job);
  const handleSubmit = async () => {
    await markVideoAsCompleted(job.creatorId, job.jobId, {
      ...job,
      status: 'complete',
      jobUrl: url,
    });
    setModalIndex(undefined);
    setReloadTrigger(Math.random());
    toast.success('Job completed successfully');
  };

  return (
    <div className="place-contents-center fixed top-0 left-0 z-10 flex h-screen w-screen items-center justify-center bg-black text-lg">
      <div className="h-full w-full overflow-auto p-s8">
        <div
          className="cursor-pointer text-right text-8xl"
          onClick={() => setModalIndex(undefined)}
        >
          x
        </div>
        <div className="flex items-center">
          <Image
            width={100}
            height={100}
            className="rounded-full"
            src={creatorData.picture}
            alt={creatorData.lastName ?? ''}
          />
          <p className="mx-s4">{creatorData?.name}</p>
          <span
            className={`cursor-pointer rounded-full py-s1 px-s3 text-lg capitalize ${
              job.status === 'pending'
                ? 'bg-[rgba(234,178,33,0.23)] text-[#EAB221]'
                : ''
            }`}
          >
            {job.status}
          </span>
        </div>
        <div className="my-s3">
          Languages Selected:{' '}
          {job.languages.map((language, i) => (
            <span
              key={i}
              className={`mr-s1 mb-s1 cursor-pointer rounded-full bg-white py-s1 px-s3 text-lg text-black`}
            >
              {language}
            </span>
          ))}
        </div>
        <div className="my-s8">
          Services Selected:{' '}
          {job.services.map((service, i) => (
            <span
              key={i}
              className={`mr-s1 mb-s1 cursor-pointer rounded-full bg-white py-s1 px-s3 text-lg text-black`}
            >
              {service}
            </span>
          ))}
        </div>

        <div className="my-s8">
          Additional Notes:{'  '} {job.additionalNote}
        </div>

        <div>
          <p>Videos:</p>
          <div className="mt-s3 grid grid-cols-3 items-center gap-10">
            {job.videoData.map((video, i) => (
              <YoutubeVideoFrame
                thumbnail={video.thumbnail}
                channelTitle={video.channelTitle}
                publishedAt={video.publishedAt}
                title={video.title}
                videoId={video.videoId}
                key={i}
              />
            ))}
          </div>
        </div>
        {showInput ? (
          <div>
            <FormInput
              placeholder="Paste link to completed job"
              onChange={(e) => setUrl(e.target.value)}
              value={url}
            />
            <div className="my-s2 mx-auto w-[180px]">
              <DashboardButton onClick={handleSubmit}>Submit</DashboardButton>
            </div>
          </div>
        ) : (
          <div className="mx-auto mt-s5 w-[250px]">
            <DashboardButton onClick={() => setShowInput(true)}>
              Mark as completed
            </DashboardButton>
          </div>
        )}
      </div>
    </div>
  );
};

PendingJobs.getLayout = DashboardLayout;
export default PendingJobs;
