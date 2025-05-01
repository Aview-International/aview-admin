import { Fragment, useEffect, useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import PageTitle from '../../components/SEO/PageTitle';
import { getUserProfile, subscribeToAllJobs } from '../../services/firebase';
import { setPendingJobs } from '../../store/reducers/jobs.reducer';
import { useDispatch, useSelector } from 'react-redux';
import ErrorHandler from '../../utils/errorHandler';
import Image from 'next/image';
import Avatar from '../../public/img/icons/avatar.webp';
import {
  deleteJob,
  generateEditorLink,
  rerunStuckJobs,
} from '../../services/api';
import DashboardButton from '../../components/UI/DashboardButton';
import Modal from '../../components/UI/Modal';
import { toast } from 'react-toastify';

const DashboardHome = () => {
  const dispatch = useDispatch();
  const [selectedJob, setSelectedJob] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
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

  const handleDeleteJob = async () => {
    try {
      setDeleteLoading(true);
      await deleteJob(selectedJob.creatorId, selectedJob.jobId);
    } catch (error) {
      ErrorHandler(error);
    } finally {
      setDeleteLoading(false);
      setSelectedJob(null);
    }
  };

  return (
    <>
      <PageTitle title="Dashboard" />
      {selectedJob && (
        <Modal closeModal={() => setSelectedJob(null)}>
          <p className="mb-s3">Delete this job?</p>
          <div className="flex w-64 items-center justify-between">
            <div className="w-28">
              <DashboardButton onClick={() => setSelectedJob(null)}>
                Cancel
              </DashboardButton>
            </div>
            <div className="w-28">
              <DashboardButton
                onClick={handleDeleteJob}
                theme="error"
                isLoading={deleteLoading}
              >
                Delete
              </DashboardButton>
            </div>
          </div>
        </Modal>
      )}
      <h2 className="text-6xl">Creator Running Jobs</h2>
      {Object.keys(pendingJobs).map((creator, i) => (
        <Fragment key={i}>
          <CreatorJobData
            creator={creator}
            pendingJobs={pendingJobs}
            setSelectedJob={setSelectedJob}
          />
          {/* <hr className="my-s2" /> */}
        </Fragment>
      ))}
    </>
  );
};

const CreatorJobData = ({ creator, pendingJobs, setSelectedJob }) => {
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
    jobId,
    translatedLanguage
  ) => {
    setLoading(jobId);
    try {
      await rerunStuckJobs(stage, creatorId, jobId, translatedLanguage);
      setLoading(null);
    } catch (error) {
      ErrorHandler(error, 'Something went wrong');
      setLoading(null);
    }
  };

  const getEditLink = async (jobId) => {
    try {
      const link = await generateEditorLink(jobId);
      navigator.clipboard
        .writeText(link.link)
        .then(() => {
          toast.success('Copied editor link to clipboard');
        })
        .catch((e) => {
          throw e;
        });
    } catch (error) {
      ErrorHandler(error, 'Something went wrong');
    }
  };

  return (
    <div className="py-s2">
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
        <div key={idx} className="my-s3 pl-s12">
          <p>Status : {job.status}</p>
          <p>Task Id : {job.jobId}</p>
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
            onClick={() =>
              loading
                ? null
                : handleRerunJobs(
                    job.status,
                    job.creatorId,
                    job.jobId,
                    job.translatedLanguage
                  )
            }
            className="cursor-pointer text-blue underline"
          >
            {loading === job.jobId ? 'Loading...' : 'Rerun current stage'}
          </button>
          <div className="flex gap-8">
            <div className="mt-s3 w-28">
              <DashboardButton
                onClick={() => setSelectedJob(job)}
                theme="error"
              >
                Delete Job
              </DashboardButton>
            </div>
            {![
              'retrieving video',
              'queued',
              'audio-separation',
              'transcription',
              // 'translation',
            ].includes(job.status) && (
              <div className="mt-s3 w-40">
                <DashboardButton
                  onClick={() => getEditLink(job.jobId)}
                  theme="light"
                  extraClasses="text-sm"
                >
                  Generator Editor Link
                </DashboardButton>
              </div>
            )}
          </div>
          <hr className="my-s3" />
        </div>
      ))}
    </div>
  );
};

DashboardHome.getLayout = DashboardLayout;

export default DashboardHome;
