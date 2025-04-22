import Image from 'next/image';
import DottedBorder from '../UI/DottedBorder';
import Download from '../../public/img/icons/download.svg';
import Border from '../UI/Border';
import { useRouter } from 'next/router';

const VideoUpload = ({}) => {
  const router = useRouter();

  return (
    <DottedBorder>
      <div className="flex flex-col items-center py-s3">
        <div className="flex h-[200px] rounded-full bg-white-transparent">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${router.query['video-id']}`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full"
          ></iframe>
        </div>
        <p className="py-s2 text-xl text-white">Download Video to preview</p>
        <Border borderRadius="md">
          <div className="gradient-dark block p-2">
            <button>Download</button>
          </div>
        </Border>
      </div>
    </DottedBorder>
  );
};

export default VideoUpload;
