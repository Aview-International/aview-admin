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
            <TranscriptionVideoFiles />
            <br />
            <TranslationVideoFiles />
            <br />
            <DubbingVideoFiles />
            <br />
            <ThumbnailVideoFiles />
            <br />
            <p>Press Upload once all files have been checked and approved.</p>
            <div className="my-s2 w-48">
              <OnboardingButton theme="light">Upload</OnboardingButton>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

VideoEdits.getLayout = DashboardLayout;

export default VideoEdits;
