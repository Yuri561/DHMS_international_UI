import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Heart, Trash2, Loader2 } from 'lucide-react';

interface FavoriteItem {
  _id: string;
  name: string;
  imageUrl: string;
  price: number;
  brand?: string;
}

const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/favorites`, {
        withCredentials: true,
      });
      setFavorites(res.data.favorites);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (id: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/favorites/${id}`, {
        withCredentials: true,
      });
      setFavorites((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error('Failed to remove favorite:', error);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <div className="p-4 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Heart className="text-pink-500" size={20} />
        My Favorites
      </h2>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
        </div>
      ) : favorites.length === 0 ? (
        <p className="text-gray-600">You haven’t added anything to favorites yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((item) => (
            <div key={item._id} className="bg-gray-50 border rounded-lg shadow-sm p-4 flex flex-col">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-48 object-cover rounded-md mb-3"
              />
              <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
              <p className="text-sm text-gray-600 mb-2">Brand: {item.brand || 'N/A'}</p>
              <p className="text-yellow-600 font-bold mb-3">${item.price.toFixed(2)}</p>
              <button
                onClick={() => removeFavorite(item._id)}
                className="mt-auto text-sm text-red-500 hover:text-red-700 flex items-center gap-1"
              >
                <Trash2 size={16} />
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
