import DashboardLayout from '../../components/dashboard/DashboardLayout';

import PageTitle from '../../components/SEO/PageTitle';
import SelectedVideoDistribution from '../../components/creators/SelectedVideo-Distribution';

  
  const Creators = () => {
    return (
      <>
        <PageTitle title="abcd" />
        <div className="gradient-dark rounded-2xl p-s3">
          <SelectedVideoDistribution />
        </div>
      </>
    );
  };
  
  Creators.getLayout = DashboardLayout;
  
  export default Creators;
  