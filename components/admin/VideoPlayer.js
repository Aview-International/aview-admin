import Image from 'next/image';
import PlayButton from '../../public/img/icons/play-button.svg';
import Playback from '../../public/img/icons/video-playback.svg';
import OnboardingButton from '../UI/DashboardButton';

const VideoPlayer = () => {
  return (
    <>
      <p className="mb-s2 text-2xl">Video</p>
      <div className="w-11/12">
        <div className="gradient-dark h-[288px] w-full">
          <div className="flex h-full w-full items-center justify-center bg-black">
            <span>
              <Image src={PlayButton} alt="Play" />
            </span>
          </div>
        </div>
        <div className="relative mt-s6">
          <Image src={Playback} alt="Playback" layout="responsive" />
        </div>
        <div className="mt-s4 flex justify-center">
          <div className="w-40">
            <OnboardingButton theme="light">Download</OnboardingButton>
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoPlayer;
