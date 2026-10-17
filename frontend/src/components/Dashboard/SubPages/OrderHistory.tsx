import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CalendarDays, ShoppingBag, Loader2 } from 'lucide-react';

interface Order {
  _id: string;
  items: {
    name: string;
    quantity: number;
    price: number;
    image?: string;
  }[];
  totalAmount: number;
  createdAt: string;
}

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/orders`, {
          withCredentials: true,
        });
        setOrders(res.data.orders);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="p-4 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <ShoppingBag size={20} />
        Your Order History
      </h2>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
        </div>
      ) : orders.length === 0 ? (
        <p className="text-gray-600">You have not placed any orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="border p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700 font-semibold">
                  Total: ${order.totalAmount.toFixed(2)}
                </span>
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <CalendarDays size={16} />
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
              <ul className="divide-y">
                {order.items.map((item, index) => (
                  <li key={index} className="py-2 flex justify-between text-sm">
                    <span className="text-gray-700">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="text-gray-600">
                      ${item.price.toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
