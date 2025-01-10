import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getUserProfile } from '../../services/firebase';
import { getS3DownloadLink } from '../../services/api';

const AllVideos = ({
  job,
  setSelectedJob,
  selectedJob,
  setVideoDownloadLink,
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
  }, [job.creatorId]);

  return (
    <div
      className={`cursor-pointer p-s2 hover:bg-white-transparent ${
        selectedJob?.jobId === job?.jobId ? 'bg-white-transparent' : ''
      }`}
      onClick={async () => {
        setSelectedJob(job);
        setVideoDownloadLink(
          await getS3DownloadLink({
            userId: job.creatorId,
            timestamp: job.timestamp,
            lang: job.translatedLanguage,
          })
        );
      }}
    >
      <div className="flex flex-row items-center">
        <div>
          {creatorData.picture && (
            <Image
              src={creatorData.picture}
              alt=""
              width={56}
              height={56}
              className="rounded-full"
            />
          )}
        </div>
        <div className="ml-s2">
          <p className="text-lg font-semibold">{job.videoData.caption}</p>
          <p className="text-base">{creatorData.name}</p>
        </div>
      </div>
    </div>
  );
};

export default AllVideos;
