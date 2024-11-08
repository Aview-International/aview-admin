import { useEffect, useState } from 'react';
import {
  getAllModerationJobs,
  acceptJob,
  getDownloadLink,
} from '../../services/apis';
import ErrorHandler from '../../utils/errorHandler';
import { useDispatch } from 'react-redux';
import { setAllJobs } from '../../store/reducers/jobs.reducer';

const ModerationJobs = ({
  setPopupPreview,
  setPreviewJob,
  setPreviewJobType,
  setPreviewJobVideoLink,
}) => {
  const [jobs, setJobs] = useState([]);
  const dispatch = useDispatch();
  const getModerationJobs = async () => {
    const res = await getAllModerationJobs();
    const resData = res.data;
    const pending = resData
      ? Object.values(resData).map((item, i) => ({
          ...item,
          jobId: Object.keys(resData)[i],
        }))
      : [];
    dispatch(setAllJobs(pending));
    setJobs(pending);
  };

  const handleAccept = async (jobId) => {
    try {
      await acceptJob(jobId, 'moderation');
      window.open(`/moderation?jobId=${jobId}`, '_blank');
    } catch (error) {
      ErrorHandler(error);
    }
  };

  const handlePreview = async (job) => {
    const videoPath = `dubbing-tasks/${job.creatorId}/${job.jobId}/video.mp4`;
    const downloadLink = await getDownloadLink(videoPath);
    console.log(downloadLink.data);
    setPreviewJobVideoLink(downloadLink.data);
    setPreviewJob(job);
    setPreviewJobType('moderation');
    setPopupPreview(true);
  };

  useEffect(() => {
    getModerationJobs();
  }, []);

  return (
    <div className="rounded-2xl bg-white-transparent p-4">
      {jobs.length > 0 ? (
        <div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
              gap: '1rem',
              textAlign: 'center',
            }}
          >
            <div className="text-left text-lg font-bold text-white">Job ID</div>
            <div className="text-left text-lg font-bold text-white">Title</div>
            <div className="text-left text-lg font-bold text-white">
              Original Language
            </div>
            <div className="text-left text-lg font-bold text-white">
              Translated Language
            </div>
          </div>

          <div className="mt-s2 mb-s2 h-[1px] w-full bg-white"></div>
          {jobs.map((job) => (
            <div key={job.jobId} className="">
              <div className="py-s2 hover:bg-white-transparent">
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
                    gap: '1rem',
                    textAlign: 'left',
                  }}
                >
                  <div className="text-left text-white">{job.jobId}</div>
                  <div className="text-left text-white">
                    {job.videoData.caption}
                  </div>
                  <div className="text-left text-white">
                    {job.originalLanguage}
                  </div>
                  <div className="text-left text-white">
                    {job.translatedLanguage}
                  </div>
                  <div
                    className="cursor-pointer text-white underline"
                    onClick={() => {
                      handlePreview(job);
                    }}
                  >
                    Preview job
                  </div>
                </div>
                <div className="h-[1px] w-full bg-white bg-opacity-25"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-white">No jobs available.</p>
      )}
    </div>
  );
};

export default ModerationJobs;
