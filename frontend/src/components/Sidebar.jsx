import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-900 text-gray-100 h-screen p-6 flex flex-col">
      {/* Dashboard Header */}
      <h2 className="text-2xl font-bold mb-6 text-center text-teal-400">Dashboard</h2>
      
      {/* Navigation Links */}
      <nav className="space-y-2 flex-1">
        <SidebarLink to="/profile" label="Profile" />
        <SidebarLink to="/stocks" label="Stocks" />
        <SidebarLink to="/bonds" label="Bonds" />
        <SidebarLink to="/mutualfunds" label="Mutual Funds" />
        <SidebarLink to="/fixeddeposits" label="Fixed Deposits" />
        <SidebarLink to="/library" label="Video Library" />
      </nav>

      {/* Logout Button */}
      <Link 
        to="/login" 
        className="block mt-auto bg-red-600 hover:bg-red-700 text-white text-center py-2 rounded transition"
      >
        Logout
      </Link>
    </div>
  );
};

/* Sidebar Link Component */
const SidebarLink = ({ to, label }) => (
  <Link 
    to={to} 
    className="block p-2 rounded hover:bg-gray-700 transition"
  >
    {label}
  </Link>
);

export default Sidebar;
