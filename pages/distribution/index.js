import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import PageTitle from '../../components/SEO/PageTitle';
// import { getAllPendingDubbings } from '../api/firebase';
import Logo from '../../public/img/aview/logo.svg';
import Image from 'next/image';
import AllVideos from '../../components/admin/AllVideos';
import SelectedVideo from '../../components/distribution/SelectedVideo-Distribution';
import ErrorHandler from '../../utils/errorHandler';
import { getAllAdminJobs } from '../../services/api';

const Distribution = () => {
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(undefined);

  const getAllJobs = async () => {
    try {
      const res = await getAllAdminJobs();
      setJobs(res);
    } catch (error) {
      ErrorHandler(error);
    }
  };

  useEffect(() => {
    getAllJobs();
  }, [reloadTrigger]);

  return (
    <>
      <PageTitle title="Distribution" />
      <div className="flex text-white">
        <div className="w-1/2 rounded-md bg-white-transparent">
          <h2 className="p-s2">Videos Selection</h2>
          {jobs.map((job, i) => (
            <AllVideos
              job={job}
              key={i}
              setSelectedJob={setSelectedJob}
              selectedJob={selectedJob}
            />
          ))}
        </div>
        {selectedJob ? (
          <div className="ml-s3 w-1/2">
            <SelectedVideo
              selectedJob={selectedJob}
              setReloadTrigger={setReloadTrigger}
            />
          </div>
        ) : (
          <div className="flex w-1/2 items-start justify-center pt-s10">
            <Image src={Logo} alt="" />
          </div>
        )}
      </div>
    </>
  );
};

Distribution.getLayout = DashboardLayout;

export default Distribution;
