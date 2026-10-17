import React from 'react';
import { useCart } from '@/components/Context/CartContext';
import { useAuth } from '@/components/Context/AuthContext';
import { ShoppingBag, Star, Gift, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Overview: React.FC = () => {
  const { cartQuantity } = useCart();
  const { username, loading } = useAuth();


  return (
    <main className="flex-1 overflow-y-auto space-y-10">
      {/* Header */}
      <section className="text-center md:text-left">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-2">Welcome, {loading ? '...' : username} 👋</h2>
        <p className="text-gray-600 text-base">Here's your personalized dashboard summary.</p>
      </section>

      {/* Stat Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white shadow-md rounded-xl p-5 flex flex-col items-start">
          <ShoppingBag className="text-yellow-400 mb-2" />
          <p className="text-gray-500">Orders</p>
          <h3 className="text-3xl font-bold text-[#f3cb50]">15</h3>
        </div>
        <div className="bg-white shadow-md rounded-xl p-5 flex flex-col items-start">
          <ShoppingCart className="text-yellow-400 mb-2" />
          <p className="text-gray-500">Cart Items</p>
          <h3 className="text-3xl font-bold text-[#f3cb50]">{cartQuantity}</h3>
        </div>
        <div className="bg-white shadow-md rounded-xl p-5 flex flex-col items-start">
          <Star className="text-yellow-400 mb-2" />
          <p className="text-gray-500">Wishlist</p>
          <h3 className="text-3xl font-bold text-[#f3cb50]">6</h3>
        </div>
        <div className="bg-white shadow-md rounded-xl p-5 flex flex-col items-start">
          <Gift className="text-green-500 mb-2" />
          <p className="text-gray-500">Reward Points</p>
          <h3 className="text-3xl font-bold text-green-600">320 pts</h3>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="bg-white shadow-md rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <Link to="/dashboard/orders" className="bg-[#f3cb50] text-black px-4 py-2 rounded-md font-semibold hover:bg-yellow-400 transition">View Orders</Link>
          <Link to="/shop" className="bg-gray-800 text-white px-4 py-2 rounded-md font-semibold hover:bg-black transition">Continue Shopping</Link>
          <Link to="/dashboard/profile" className="bg-white border border-gray-300 text-gray-800 px-4 py-2 rounded-md font-semibold hover:bg-gray-100 transition">Edit Profile</Link>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="bg-white shadow-md rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
        <ul className="text-gray-600 space-y-2">
          <li>✅ Placed an order for 3 items on July 30</li>
          <li>🛒 Added Coconut Oil Hair Serum to cart</li>
          <li>⭐️ Added Shea Butter Cream to favorites</li>
          <li>🎉 Earned 50 points from last purchase</li>
        </ul>
      </section>
    </main>
  );
};

export default Overview;
