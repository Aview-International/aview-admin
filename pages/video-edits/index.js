import UploadIcon from '../../public/img/icons/upload-icon1.svg';
import Image from 'next/image';
import {
  DubbingVideoFiles,
  ThumbnailVideoFiles,
  TranscriptionVideoFiles,
  TranslationVideoFiles,
} from '../../components/admin/VideoData';
import VideoDetails from '../../components/admin/VideoDetails';
import VideoPlayer from '../../components/admin/VideoPlayer';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import OnboardingButton from '../../components/Onboarding/button';
import PageTitle from '../../components/SEO/PageTitle';

const VideoEdits = () => {
  return (
    <>
      <PageTitle title="Video Edits" />
      <div className="gradient-dark rounded-2xl p-s3">
        <VideoDetails name="Video Edits" />
        <div className="mt-s5 flex text-white">
          <div className="w-1/2">
            <VideoPlayer />
          </div>
          <div className="w-1/2">
            <ThumbnailVideoFiles />
          </div>
        </div>
      </div>
    </>
  );
};

VideoEdits.getLayout = DashboardLayout;

export default VideoEdits;
