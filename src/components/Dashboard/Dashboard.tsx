import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import {
  LogOut,
  User,
  ShoppingBag,
  Heart,
  LayoutDashboard,
  ShoppingCart,
  BadgePercent,
  Star,
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
    <div className="flex flex-col md:flex-row min-h-screen bg-[#fdf9f3]">
      
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-gradient-to-b from-black to-gray-900 text-white p-6 shadow-xl">
        <div className="mb-12 mt-10 text-center md:text-left">
          <h1 className="text-3xl font-bold text-[#f3cb50]">DHMS Dashboard</h1>
          <p className="text-sm text-gray-300">Signed in as <span className="text-[#f3cb50]">{username}</span></p>
        </div>

        <nav className="space-y-5">
          <Link to="overview" className="flex items-center gap-2 hover:text-black hover:bg-white px-4 py-2 rounded-md transition">
            <LayoutDashboard size={18} />
            Overview
          </Link>
          <Link to="/shop#top" className="flex items-center gap-2 hover:text-black hover:bg-white px-4 py-2 rounded-md transition">
            <ShoppingCart size={18} />
            Shop Now
          </Link>
          <Link to="orders" className="flex items-center gap-2 hover:text-black hover:bg-white px-4 py-2 rounded-md transition">
            <ShoppingBag size={18} />
            Order History
          </Link>
          <Link to="wishlist" className="flex items-center gap-2 hover:text-black hover:bg-white px-4 py-2 rounded-md transition">
            <Heart size={18} />
            Wishlist
          </Link>
          <Link to="rewards" className="flex items-center gap-2 hover:text-black hover:bg-white px-4 py-2 rounded-md transition">
            <Star size={18} />
            Loyalty Points
          </Link>
          <Link to="profile" className="flex items-center gap-2 hover:text-black hover:bg-white px-4 py-2 rounded-md transition">
            <User size={18} />
            Account Info
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-2 hover:text-black hover:bg-white px-4 py-2 rounded-md transition">
            <LogOut size={18} />
            Sign Out
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 mt-4 md:mt-24 overflow-y-auto">
        <div className="mb-8 text-center md:text-left">
          <h2 className="text-3xl font-bold text-gray-800 mb-1">Welcome Back, {username}!</h2>
          <p className="text-sm text-gray-600">Here's your DHMS activity and perks summary.</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white shadow rounded-xl p-4">
            <p className="text-gray-500">Orders</p>
            <h3 className="text-2xl font-bold text-[#f3cb50]">15</h3>
          </div>
          <div className="bg-white shadow rounded-xl p-4">
            <p className="text-gray-500">Cart Items</p>
            <h3 className="text-2xl font-bold text-[#f3cb50]">{cartQuantity}</h3>
          </div>
          <div className="bg-white shadow rounded-xl p-4">
            <p className="text-gray-500">Wishlist</p>
            <h3 className="text-2xl font-bold text-[#f3cb50]">6</h3>
          </div>
          <div className="bg-white shadow rounded-xl p-4">
            <p className="text-gray-500">Reward Points</p>
            <h3 className="text-2xl font-bold text-green-500">320 pts</h3>
          </div>
        </div>

        {/* Promo / Recommended Section */}
        <div className="bg-white shadow rounded-xl p-6 mb-10">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <BadgePercent size={18} className="text-[#f3cb50]" />
            Exclusive Promotions
          </h3>
          <p className="text-gray-600 mb-3">Get 10% off when you purchase any 3 hair care items.</p>
          <Link to="/shop#top" className="inline-block bg-[#f3cb50] text-black font-semibold px-4 py-2 rounded-lg hover:bg-yellow-400 transition">
            Explore Deals
          </Link>
        </div>

        {/* Outlet for nested pages */}
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
