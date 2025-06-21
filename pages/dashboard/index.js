import DashboardLayout from '../../components/dashboard/DashboardLayout';
import PageTitle from '../../components/SEO/PageTitle';
import GrowthRate from '../../components/dashboard/metrics/GrowthRate';
import ProcessingVideo from '../../components/dashboard/metrics/ProcessingVideo';
import SocialMedia from '../../components/dashboard/metrics/SocialMedia';
import TotalMinutes from '../../components/dashboard/metrics/TotalMinutes';
import TotalSignups from '../../components/dashboard/metrics/TotalSignups';
import TotalVideos from '../../components/dashboard/metrics/TotalVideos';
import VideosUploaded from '../../components/dashboard/metrics/VideosUploaded';

const DashboardHome = () => {
  return (
    <>
      <PageTitle title="Dashboard" />
      <div className="bg-gray-100 min-h-screen p-8">
        <h1 className="text-gray-800 mb-8 text-4xl font-bold">
          Admin Dashboard
        </h1>

        <div className="mb-8 grid grid-cols-1 gap-6 text-white md:grid-cols-2 lg:grid-cols-4">
          <TotalVideos />
          <TotalMinutes />
          <ProcessingVideo />
          <VideosUploaded />
        </div>

        <div className="grid grid-cols-1 gap-6 text-white lg:grid-cols-2">
          <div className="rounded-lg bg-white-transparent p-6 shadow-md lg:col-span-2">
            <h2 className="text-gray-800 mb-4 text-2xl font-semibold">
              Social Media Distribution
            </h2>
            <div className="text-gray-500 flex h-80 items-center justify-center">
              <SocialMedia />
            </div>
          </div>

          <div className="rounded-lg bg-white-transparent p-6 shadow-md">
            <h2 className="text-gray-800 mb-4 text-2xl font-semibold">
              New Signups
            </h2>
            <TotalSignups />
          </div>
          <div className="rounded-lg bg-white-transparent p-6 shadow-md">
            <h2 className="text-gray-800 mb-4 text-2xl font-semibold">
              Growth Rate
            </h2>
            <GrowthRate />
          </div>
        </div>
      </div>
    </>
  );
};

DashboardHome.getLayout = DashboardLayout;

export default DashboardHome;
