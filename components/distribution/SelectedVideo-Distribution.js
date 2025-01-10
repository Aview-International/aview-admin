import { useEffect, useState } from 'react';
import Button from '../UI/Button';
import { downloadS3Object } from '../../services/api';
import Check from '../../public/img/icons/check-circle-green.svg';
import Download from '../../public/img/icons/download.svg';ß
import Image from 'next/image';
import { useRouter } from 'next/router';
import { getUserProfile } from '../../services/firebase';

const SelectedVideo = ({ selectedJob, setReloadTrigger }) => {
  const router = useRouter();
  const [button, setButton] = useState('');
  const [loader, setLoader] = useState('');
  const [creatorData, setCreatorData] = useState({
    name: '',
    picture: '',
  });

  const getProfile = async () => {
    const res = await getUserProfile(selectedJob.creatorId);
    setCreatorData({
      name: res?.firstName + ' ' + res?.lastName,
      picture: res?.picture,
    });
  };

  useEffect(() => {
    getProfile();
  }, [selectedJob.creatorId]);

  const handleDownload = async (date, key) => {
    setButton(key);
    setLoader('download');
    const { data } = await downloadS3Object(
      date,
      key,
      selectedJob.creatorId,
      'video'
    );
    setLoader('');
    window.open(data, '_blank');
  };

  const handleApproval = async (videoId, date, key) => {
    router.push(
      `/distribution/${selectedJob.jobId}?video-id=${videoId}&date=${date}&${key}`
    );
  };

  return (
    <div className="rounded-md bg-white-transparent p-s2">
      {selectedJob.videoData.map((vid, i) => (
        <div key={i}>
          <h2 className="text-2xl font-semibold">{vid.caption}</h2>
          <p className="my-s2 text-lg font-medium">{creatorData.name}</p>

          <iframe
            width="100%"
            height="300"
            src={`https://www.youtube.com/embed/${vid.id}`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>

          {vid.finalVideoKeys &&
            vid.finalVideoKeys.map((lang, i) => (
              <div className="my-s3" key={i}>
                <p>{lang.split('-')[0].substring(5)} - Video</p>
                <div className="flex justify-center gap-s2">
                  <Button
                    theme="light"
                    classes="flex justify-center items-center"
                    onClick={() => handleDownload(vid.date, lang)}
                    isLoading={loader === 'download' && button === lang}
                  >
                    <span className="mr-2">Download</span>
                    <Image src={Download} alt="" width={22} height={22} />
                  </Button>

                  <Button
                    theme="success"
                    classes="flex justify-center items-center"
                    onClick={() => handleApproval(vid.id, vid.date, lang)}
                    isLoading={loader === 'approve' && button === lang}
                  >
                    <span className="mr-2">Post to youtube</span>
                    <Image src={Check} alt="" width={24} height={24} />
                  </Button>
                </div>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
};

export default SelectedVideo;
