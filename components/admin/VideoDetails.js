import Mockup from '../../public/img/mockups/sample-video.png';
import Image from 'next/image';

const VideoDetails = ({ name }) => {
  return (
    <div className="text-white">
      <h2 className="text-6xl">{name}</h2>
      <div className="mt-s5 flex gap-4">
        <div>
          <Image src={Mockup} alt="" width={192} height={107} />
        </div>
        <div>
          <p className="text-2xl">Logan Paul Vine Compilation</p>
          <p className="mt-s1 text-sm text-gray-2">
            Logan Paul • 100K Views • 1 month ago
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoDetails;
