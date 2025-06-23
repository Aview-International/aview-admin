import { use, useEffect, useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { downloadVideoFromS3, getJobsHistory } from '../../services/api';
import { useDispatch, useSelector } from 'react-redux';
import { setCompletedJobs } from '../../store/reducers/history.reducer';
import PageTitle from '../../components/SEO/PageTitle';
import {
  subscribeToHistory,
  subscribeToPodcast,
} from '../../services/firebase';

const History = () => {
  const dispatch = useDispatch();
  const { completedJobs } = useSelector((el) => el.history);
  const [podcast, setPodcast] = useState([]);
  const [pendingJobs, setPendingJobs] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeToHistory(async (data) => {
      const pendingArray = data
        ? Object.values(data).sort(
            (a, b) => parseInt(b.timestamp) - parseInt(a.timestamp)
          )
        : [];
      setPendingJobs(pendingArray);
      dispatch(setCompletedJobs(await getJobsHistory()));
    });

    return () => unsubscribe(); // cleanup
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToPodcast(async (data) => {
      const pendingArray = data
        ? Object.values(data).sort(
            (a, b) => parseInt(b.timestamp) - parseInt(a.timestamp)
          )
        : [];
      setPodcast(pendingArray);
    });

    return () => unsubscribe(); // cleanup
  }, []);

  return (
    <>
      <PageTitle title="History" />
      <h2 className="mt-s2 text-4xl">History</h2>
      <Container
        pendingJobs={pendingJobs}
        completedJobs={completedJobs}
        podcast={podcast}
      />
    </>
  );
};

const Container = ({ pendingJobs, completedJobs, podcast }) => {
  const handleDownload = async (job) => {
    const downloadLink = await downloadVideoFromS3(
      job.jobId,
      job.videoData.caption,
      job.translatedLanguage
    );
    if (downloadLink) {
      const anchor = document.createElement('a');
      anchor.href = downloadLink;
      anchor.download = job.s3ObjectKey || 'download';
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    }
  };

  return (
    <div className="w-full rounded-2xl bg-gradient-to-b from-[#ffffff26] to-[#ffffff0D] p-s3">
      <div className="grid grid-cols-[20%_15%_15%_23%_9%_9%_9%]">
        <p>Name</p>
        <p>Date</p>
        <p>Languages</p>
        <p>ID</p>
        <p>Type</p>
        <p className="text-center">Status</p>
        <p>Download Link</p>
      </div>
      <hr className="my-s2 border-[rgba(255,255,255,0.6)]" />
      {(pendingJobs.length > 0 || completedJobs.length > 0) &&
        [...podcast, ...pendingJobs, ...completedJobs].map((job, i) => (
          <div
            className="grid grid-cols-[20%_15%_15%_23%_9%_9%_9%] border-b border-[rgba(252,252,252,0.2)] py-s2"
            key={i}
          >
            <div>{job.videoData?.caption.replace(/\.mp4$/i, '')}</div>
            <p>{new Date(+job.timestamp).toDateString()}</p>
            <div>
              {job?.translatedLanguage
                ? job.translatedLanguage
                : typeof job?.languages === 'string'
                ? job.languages
                : job?.languages?.map((lang, idx) => (
                    <p key={idx} className="mb-s1">
                      {lang}
                    </p>
                  ))}
            </div>
            <p>{job.jobId}</p>
            <p>{job.videoData?.type}</p>
            <div className="text-center text-[#eab221]">
              {job.status === 'complete' || job.status === 'under review'
                ? 'complete'
                : job.status}
            </div>
            <div>
              {job.status === 'complete' || job.status === 'under review' ? (
                <button
                  onClick={() => handleDownload(job)}
                  className="cursor-pointer text-blue underline"
                >
                  Download
                </button>
              ) : (
                'Processing...'
              )}
            </div>
          </div>
        ))}
    </div>
  );
};

History.getLayout = DashboardLayout;

export default History;
