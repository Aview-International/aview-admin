import Button from '../UI/Button';
import Image from 'next/image';
import Check from '../../public/img/icons/check-circle-green.svg';
import { downloadS3Object } from '../../services/apis';
import ErrorHandler from '../../utils/errorHandler';
import { useEffect, useRef, useState } from 'react';

const S3VideoPlayer = ({
  creatorData,
  vidData,
  loader,
  selectedJob,
  setLoader,
}) => {
  const [streamUrl, setStreamUrl] = useState('');
  const playerRef = useRef(null);
  useEffect(() => {
    (async () => {
      try {
        const res = await downloadS3Object(
          `creator-videos/${selectedJob.creatorId}/${vidData.date}/${vidData.caption}`
        );
        setStreamUrl(res.data);
      } catch (error) {
        setLoader('');
        ErrorHandler(error);
      }
    })();
  }, [vidData.id]);

  useEffect(() => {
    playerRef.current.src = streamUrl;
    playerRef.current.addEventListener('error', (e) => {
      console.error('Video playback error:', e);
    });
    playerRef.current.addEventListener('play', () => {
      console.log('Video started playing.');
    });
    playerRef.current.addEventListener('pause', () => {
      console.log('Video paused.');
    });
  }, [streamUrl, playerRef.current]);

  const handleDownload = () => {
    window.open(streamUrl, '_blank');
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold">{vidData.caption}</h2>
      <p className="my-s2 text-lg font-medium">{creatorData.name}</p>
      {/* {streamUrl && ( */}
      <video controls width="100%" height="300" ref={playerRef}>
        <source src={streamUrl} type="video" />
      </video>
      {/* )} */}

      <div className="my-s3 grid grid-cols-3 gap-s2">
        <Button
          theme="light"
          onClick={handleDownload}
          isLoading={loader === 'download'}
        >
          Download
        </Button>
        <Button theme="dark">Upload</Button>
        <Button
          theme="success"
          classes="flex items-center"
          onClick={() => handleApproval(vidData.objectS3Key)}
          isLoading={loader === 'approve'}
        >
          <Image src={Check} alt="" width={24} height={24} />
          <span className="ml-2">Approve</span>
        </Button>
      </div>
    </div>
  );
};

export default S3VideoPlayer;
