import {
  TranscriptionVideoFiles,
  TranslationVideoFiles,
} from '../../components/admin/VideoData';
import VideoDetails from '../../components/admin/VideoDetails';
import VideoPlayer from '../../components/admin/VideoPlayer';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import PageTitle from '../../components/SEO/PageTitle';

const Translation = () => {
  return (
    <>
      <PageTitle title="Translation" />
      <div className="gradient-dark rounded-2xl p-s3">
        <VideoDetails name="Translation" />
        <div className="mt-s5 flex text-white">
          <div className="w-1/2">
            <VideoPlayer />
          </div>
          <div className="w-1/2">
            <TranscriptionVideoFiles />
            <br />
            <br />
            <TranslationVideoFiles />
          </div>
        </div>
      </div>
    </>
  );
};

Translation.getLayout = DashboardLayout;

export default Translation;
