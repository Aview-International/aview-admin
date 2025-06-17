import DashBoardHeader from './Header';
import DashboardSidebar from './Sidebar';

const DashboardStructure = ({ children }) => {
  return (
    <main className="flex h-screen w-full overflow-y-auto bg-white-transparent">
      <DashboardSidebar />
      <div className="ml-auto flex w-full flex-col items-stretch lg:w-[calc(100%-190px)]">
        <DashBoardHeader />
        <div className="mx-auto h-screen w-full self-stretch overflow-y-auto bg-black/60 p-s3 text-white md:p-s3">
          {children}
        </div>
      </div>
    </main>
  );
};

const DashboardLayout = (page) => (
  <DashboardStructure>{page}</DashboardStructure>
);
export default DashboardLayout;
