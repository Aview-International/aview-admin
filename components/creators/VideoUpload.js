import Image from 'next/image';
import DottedBorder from '../UI/DottedBorder';
import Download from '../../public/img/icons/download.svg';
import Border from '../UI/Border';

const VideoUpload = ({}) => {
  return (
    <DottedBorder>
      <div className="flex flex-col items-center py-s3">
        <div className="flex h-[160px] w-[160px] place-content-center rounded-full bg-gray-1">
          <Image src={Download} alt="Upload" width={80} height={80} />
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
