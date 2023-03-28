import DashboardLayout from '../../components/dashboard/DashboardLayout';
import PageTitle from '../../components/SEO/PageTitle';

const DashboardHome = () => {
  return (
    <>
      <PageTitle title="Dashboard" />
      <h2 className="text-6xl">Super admin console</h2>
    </>
  );
};

DashboardHome.getLayout = DashboardLayout;

export default DashboardHome;
