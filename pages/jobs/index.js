import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import PageTitle from '../../components/SEO/PageTitle';
import { getUserProfile, subscribeToAllJobs } from '../../services/firebase';
import { setPendingJobs } from '../../store/reducers/jobs.reducer';
import { useDispatch, useSelector } from 'react-redux';
import ErrorHandler from '../../utils/errorHandler';
import Image from 'next/image';
import Avatar from '../../public/img/icons/avatar.webp';
import { rerunStuckJobs } from '../../services/api';

const DashboardHome = () => {
  const dispatch = useDispatch();
  const pendingJobs = useSelector((el) => el.jobs.pendingJobs);
  useEffect(() => {
    try {
      const unsubscribe = subscribeToAllJobs((data) => {
        dispatch(setPendingJobs(data));
      });

      return () => unsubscribe(); // cleanup
    } catch (error) {
      ErrorHandler(error);
    }
  }, []);

  return (
    <>
      <PageTitle title="Dashboard" />
      <h2 className="text-6xl">Creator Running Jobs</h2>

      {Object.keys(pendingJobs).map((creator, i) => (
        <CreatorJobData key={i} creator={creator} pendingJobs={pendingJobs} />
      ))}
    </>
  );
};

const CreatorJobData = ({ creator, pendingJobs }) => {
  const [creatorProfile, setCreatorProfile] = useState(null);
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getUserProfile(creator);
        setCreatorProfile(data);
      } catch (error) {
        ErrorHandler(error, 'Error fetching user profile');
      }
    })();
  }, [creator]);

  const handleRerunJobs = async (
    stage,
    creatorId,
    timestamp,
    translatedLanguage
  ) => {
    setLoading(timestamp);
    try {
      console.log(stage, creatorId, timestamp, translatedLanguage);
      // await rerunStuckJobs(stage, creatorId, timestamp, translatedLanguage);
      setLoading(null);
    } catch (error) {
      ErrorHandler(error, 'Something went wrong');
      setLoading(null);
    }
  };

  return (
    <div className="border-b border-[rgba(252,252,252,0.2)] py-s2">
      <p className="pb-s4">
        <Image
          src={creatorProfile?.picture ?? Avatar}
          className="rounded-full"
          alt=""
          width={50}
          height={50}
        />
        {creatorProfile?.firstName} {creatorProfile?.lastName}
      </p>
      {Object.values(pendingJobs[creator]).map((job, idx) => (
        <div key={idx} className="my-s3">
          <p>Status : {job.status}</p>
          <p>Caption : {job.videoData?.caption}</p>
          <p>
            Date :{' '}
            {new Date(+job.timestamp).toLocaleString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
          <button
            onClick={
              () => (loading ? null : console.log(job))
              // : handleRerunJobs(
              //     job.status,
              //     job.creatorId,
              //     job.timestamp,
              //     job.translatedLanguage
              //   )
            }
            className="cursor-pointer text-blue underline"
          >
            {loading === job.timestamp ? 'Loading...' : 'Rerun current stage'}
          </button>
        </div>
      ))}
    </div>
  );
};

DashboardHome.getLayout = DashboardLayout;

export default DashboardHome;
