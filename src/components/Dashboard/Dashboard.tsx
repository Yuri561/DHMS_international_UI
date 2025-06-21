import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import {
  LogOut,
  User,
  ShoppingBag,
  TrendingUp,
  LayoutDashboard,
  ShoppingCart,
} from 'lucide-react';
import { useCart } from '../Context/CartContext';

const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { cartQuantity } = useCart();
  const username = localStorage.getItem("username");

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100"> {/* updated */}
      
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-gradient-to-b from-black to-gray-900 text-white p-4 md:p-6 shadow-lg md:min-h-screen"> {/* updated */}
        <div className="mb-10 mt-8 md:mt-32 text-center md:text-left"> {/* updated */}
          <h1 className="text-2xl md:text-3xl font-bold text-[#f3cb50] mb-1">DHMS Dashboard</h1>
          <p className="text-sm text-gray-300">
            Signed in as <span className="text-[#f3cb50]">{username}</span>
          </p>
        </div>

        <nav className="space-y-4">
          <Link to="overview" className="flex items-center gap-2 hover:text-black hover:bg-white px-4 py-2 rounded-md transition">
            <LayoutDashboard size={18} />
            <span>Overview</span>
          </Link>
          <Link to="/shop#top" className="flex items-center gap-2 hover:text-black hover:bg-white px-4 py-2 rounded-md transition">
            <ShoppingCart size={18} />
            <span>Shop Now</span>
          </Link>
          <Link to="orders" className="flex items-center gap-2 hover:text-black hover:bg-white px-4 py-2 rounded-md transition">
            <ShoppingBag size={18} />
            <span>Order History</span>
          </Link>
          <Link to="trending" className="flex items-center gap-2 hover:text-black hover:bg-white px-4 py-2 rounded-md transition">
            <TrendingUp size={18} />
            <span>Trending Orders</span>
          </Link>
          <Link to="profile" className="flex items-center gap-2 hover:text-black hover:bg-white px-4 py-2 rounded-md transition">
            <User size={18} />
            <span>Account Info</span>
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-2 hover:text-black hover:bg-white px-4 py-2 rounded-md transition">
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 mt-4 md:mt-32 overflow-y-auto"> {/* updated */}
        {/* Welcome */}
        <div className="mb-6 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">Welcome Back {username}!</h2>
          <p className="text-sm text-gray-500">Here’s what’s happening with your account.</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-10"> {/* updated */}
          <div className="bg-white shadow rounded-lg p-4">
            <p className="text-gray-600">Total Orders</p>
            <h3 className="text-xl md:text-2xl font-bold text-[#f3cb50]">15</h3>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <p className="text-gray-600">Items in Cart</p>
            <h3 className="text-xl md:text-2xl font-bold text-[#f3cb50]">{cartQuantity}</h3>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <p className="text-gray-600">Account Status</p>
            <h3 className="text-xl md:text-2xl font-bold text-green-500">Active</h3>
          </div>
        </div>

        {/* Recent Activity Table */}
        <div className="bg-white shadow rounded-lg p-4 mb-6 overflow-x-auto"> {/* updated */}
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
          <table className="w-full text-left min-w-[400px]">
            <thead className="text-sm text-gray-500 border-b">
              <tr>
                <th className="py-2">Date</th>
                <th className="py-2">Activity</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              <tr className="border-b">
                <td className="py-2">June 6, 2025</td>
                <td className="py-2">Ordered 2 Body Oils</td>
                <td className="py-2 text-green-500">Completed</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">June 3, 2025</td>
                <td className="py-2">Added Designer Bag to Cart</td>
                <td className="py-2 text-yellow-500">Pending</td>
              </tr>
            </tbody>
          </table>
        </div>

        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
