const DashBoardHeader = ({ user }) => {
  return (
    <header className="w-full px-s9 py-s4 text-white">
      <h3 className="text-xl">Good morning {user.firstName}!</h3>
      <p className="text-lg text-gray-2">Welcome to your Aview dashboard</p>
    </header>
  );
};

export default DashBoardHeader;
