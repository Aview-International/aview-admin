import { useEffect, useState } from 'react';
import ErrorHandler from '../../utils/errorHandler';
import { getDownloadLink } from '../../services/apis';
import CircleLoader from '../../public/loaders/CircleLoader';
import { formatTimestamp } from '../../utils/formatDate';

const TableHeader = [
  'Job Type',
  'Date',
  'Title',
  'Original Language',
  'Translated Language',
  'Preview Link',
];

const AllJobs = ({
  jobs,
  setPopupPreview,
  setPreviewJob,
  setPreviewJobType,
  setPreviewJobVideoLink,
}) => {
  const handlePreview = async (job, jobType) => {
    try {
      const videoPath = `dubbing-tasks/${job.creatorId}/${job.jobId}/video.mp4`;
      const downloadLink = await getDownloadLink(videoPath);
      setPreviewJobVideoLink(downloadLink.data);
      setPreviewJob(job);
      setPreviewJobType(jobType);
      setPopupPreview(true);
    } catch (error) {
      console.error('Error setting up preview:', error);
      throw new Error('Unable to load preview. Please try again.');
    }
  };

  return (
    <div className="rounded-2xl bg-black p-4 text-white">
      {jobs.length > 0 ? (
        <div className="relative h-screen overflow-y-auto">
          <div className="sticky top-0">
            <div className="absolute inset-0 bg-white bg-opacity-20 backdrop-blur-sm" />

            <div className="relative grid grid-cols-6 gap-1 py-2 text-center">
              {TableHeader.map((headerItem, index) => (
                <div className="text-left text-lg font-bold" key={index}>
                  {headerItem}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-s2 mb-s2 h-[1px] w-full"></div>
          {jobs.map((job) => (
            <div key={job.jobId} className="">
              <div className="py-s2 hover:bg-white-transparent">
                <div className="grid grid-cols-6 gap-1 text-center">
                  <div className="text-left">
                    {job.status == 'moderation'
                      ? 'Moderation'
                      : job.status == 'subtitling'
                      ? 'Overlay'
                      : 'Pending'}
                  </div>
                  <div className="text-left">
                    {formatTimestamp(job.timestamp)}
                  </div>
                  <div className="text-left">{job.videoData?.caption}</div>
                  <div className="text-left">{job.originalLanguage}</div>
                  <div className="text-left">{job.translatedLanguage}</div>
                  <PreviewJob job={job} previewHandler={handlePreview} />
                </div>
                <div className="h-[1px] w-full bg-white bg-opacity-25"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No jobs available.</p>
      )}
    </div>
  );
};

const PreviewJob = ({ job, previewHandler }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePreviewClick = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const jobType =
        job.status === 'moderation'
          ? 'moderation'
          : job.status === 'subtitling'
          ? 'overlay'
          : 'pending';

      await previewHandler(job, jobType);
    } catch (error) {
      console.error('Error previewing job:', error);
      setError('Error loading preview. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <CircleLoader />;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="cursor-pointer underline" onClick={handlePreviewClick}>
      Preview Link
    </div>
  );
};

export default AllJobs;
