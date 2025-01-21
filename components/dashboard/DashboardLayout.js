import DashBoardHeader from './Header';
import DashboardSidebar from './Sidebar';

const DashboardStructure = ({ children }) => {
  return (
    <main className="gradient-dark flex min-h-screen w-full text-white">
      <DashboardSidebar />
      <div className="ml-auto w-[calc(100%-170px)]">
        <DashBoardHeader />
        <div className="h-full max-h-full overflow-y-auto bg-black p-s4">
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
