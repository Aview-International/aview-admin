import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import PageTitle from '../../components/SEO/PageTitle';
import { getDownloadLink } from '../../services/apis';
import { SupportedLanguages } from '../../constants/constants';
import { getFlaggedSubtitledAndCaptionedJobs } from '../../services/firebase';

const Subtitling = () => {
  const [jobs, setJobs] = useState([]);

  const getPendingJobs = async () => {
    const res = await getFlaggedSubtitledAndCaptionedJobs();

    const pending = res
      ? Object.values(res).map((item, i) => ({
          ...item,
          jobId: Object.keys(res)[i],
        }))
      : [];
    setJobs(pending);
  };

  useEffect(() => {
    // getPendingJobs();
  }, []);

  useEffect(() => {
    console.log(jobs);
  }, [jobs]);

  const handleDownloadVideo = async (jobId, creatorId, translatedLanguage) => {
    const videoPath = `dubbing-tasks/${creatorId}/${jobId}/${translatedLanguage}.mp4`;

    const res = await getDownloadLink(videoPath);
    const downloadLink = res.data;

    const link = document.createElement('a');
    link.href = downloadLink;
    link.setAttribute('download', '');
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };

  const handleDownloadSrt = async (jobId, creatorId, translatedLanguage) => {
    const translatedLanguageCode = SupportedLanguages.find(
      (language) => language.languageName === translatedLanguage
    ).translateCode;
    const videoPath = `dubbing-tasks/${creatorId}/${jobId}/${translatedLanguageCode}.srt`;

    const res = await getDownloadLink(videoPath);
    const downloadLink = res.data;

    const link = document.createElement('a');
    link.href = downloadLink;
    link.setAttribute('download', '');
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };

  const handleUpload = async (jobId, creatorId, translatedLanguage) => {};

  return (
    <>
      <PageTitle title="Captions & Subtitles" />
      <div className="flex w-full flex-col justify-center text-white">
        <p className="text-4xl">Jobs</p>
        <div className="rounded-2xl bg-white-transparent p-4">
          {jobs.length > 0 ? (
            <div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr',
                  gap: '1rem',
                  textAlign: 'center',
                }}
              >
                <p className="text-left font-bold">Job ID</p>
                <p className="text-left font-bold">Title</p>
                <p className="text-left font-bold">Translated Language</p>
              </div>

              <div className="mt-s2 mb-s2 h-[1px] w-full bg-white"></div>
              {jobs.map((job) => (
                <div key={job.jobId} className="">
                  <div className="py-s2 hover:bg-white-transparent">
                    {' '}
                    {/* Replace p-s2 with actual padding if needed */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr',
                        gap: '1rem',
                        textAlign: 'left',
                      }}
                    >
                      <p className="text-left">{job.jobId}</p>
                      <p className="text-left">{job.videoData.caption}</p>
                      <p className="text-left">{job.translatedLanguage}</p>
                      <div
                        className="cursor-pointer underline"
                        onClick={() => {
                          handleDownloadVideo(
                            job.jobId,
                            job.creatorId,
                            job.translatedLanguage
                          );
                        }}
                      >
                        Video Download
                      </div>
                      <div
                        className="cursor-pointer underline"
                        onClick={() => {
                          handleDownloadSrt(
                            job.jobId,
                            job.creatorId,
                            job.translatedLanguage
                          );
                        }}
                      >
                        Srt Download
                      </div>
                      <p className="cursor-pointer underline">Video Upload</p>
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
      </div>
    </>
  );
};

Subtitling.getLayout = DashboardLayout;

export default Subtitling;
