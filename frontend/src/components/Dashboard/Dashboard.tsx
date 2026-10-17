import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import {
  LogOut,
  User,
  ShoppingBag,
  LayoutDashboard,
  ShoppingCart,
  Star,
} from 'lucide-react';
import { useEffect } from 'react';


const Dashboard = () => {

  useEffect
  const { logout, username, loading } = useAuth();
  const navigate = useNavigate();



  const handleLogout = async () => {
    await logout();
    localStorage.removeItem('username')
    navigate('/login');
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#fdf9f3]">
      
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-gradient-to-b from-black to-gray-900 mt-4 text-white p-6 shadow-xl">
        <div className="mb-12 mt-10 text-center md:text-left">
          <h1 className="text-3xl font-bold text-[#f3cb50]">DHMS Dashboard</h1>
          <p className="text-sm text-gray-300">Signed in as <span className="text-[#f3cb50]">{loading ? '...' : username}</span></p>
        </div>

        <nav className="space-y-5">
          <Link to="overview" className="flex items-center gap-2 hover:text-black hover:bg-white px-4 py-2 rounded-md transition">
            <LayoutDashboard size={18} />
            Overview
          </Link>
          <Link to="/shop" className="flex items-center gap-2 hover:text-black hover:bg-white px-4 py-2 rounded-md transition">
            <ShoppingCart size={18} />
            Shop Now
          </Link>
          <Link to="orders" className="flex items-center gap-2 hover:text-black hover:bg-white px-4 py-2 rounded-md transition">
            <ShoppingBag size={18} />
            Order History
          </Link>
          <Link to="/cart" className="flex items-center gap-2 hover:text-black hover:bg-white px-4 py-2 rounded-md transition">
            <ShoppingCart size={18} />
            My Cart
          </Link>
          <Link to="favorites" className="flex items-center gap-2 hover:text-black hover:bg-white px-4 py-2 rounded-md transition">
            <Star size={18} />
            Favorites
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

        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
