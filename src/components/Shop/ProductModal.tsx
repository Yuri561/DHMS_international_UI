import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import {toast} from 'react-hot-toast'
import { X, Home, Truck, Store, Clock, ShoppingBag } from 'lucide-react';
import {useNavigate } from 'react-router-dom';
import LoadingAnimation from '../LoadingAnimation/LoadingAnimation';
interface Product {
  id: string | number;
  name: string;
  price?: number;
  imageUrl: string;
  category: string;
  rating: number;
  brand?: any;
  inStore?: boolean;
  colors?: string[];
  description?: string;
}

interface ProductModalProps {
  onClose: () => void;
  product: Product;
  onAddToCart: (item: any) => void;
  username?: string;
}

const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
  username,
}) => {
  const [selectedColor, setSelectedColor] = useState('');
  const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate();
  useEffect(() => {
    if (product?.colors?.length) {
      setSelectedColor(product.colors[0]);
    }
  }, [product]);

  const handleAddToCart = () => {
    // const username = localStorage.getItem('username')
    if (!username) {
      alert("Please sign in to add items to cart");
      return;
    }

    onAddToCart({
      ...product,
      color: selectedColor,
      quantity: 1,
      totalPrice: product.price,
    });
    setLoading(true)
    onClose();
    setLoading(false)
    navigate('/cart')
    toast.success("sucessfully added product")
    
  };

  return (
    <Dialog open={!!product} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
        {loading && <LoadingAnimation/>}
      <div className="flex items-center justify-center w-full h-screen px-4">
        <div className="fixed inset-0 bg-black bg-opacity-70" />
        <div className="bg-white rounded-lg shadow-xl max-w-8xl w-full h-screen z-50 p-6 relative text-black">
          <button onClick={onClose} className="absolute top-3 right-3 text-black hover:text-red-500">
            <X size={32} />
          </button>

          <div className="flex flex-col md:flex-row p-3 gap-8">
            <div className="flex flex-col justify-center items-center">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-64 xl:h-150 object-cover rounded"
              />
            </div>

            <div className="flex flex-col justify-between space-y-4 md:w-1/2">
              <div className="flex flex-col space-y-2">
                <h2 className="text-2xl font-bold">{product.name}</h2>
                <p className="text-yellow-600">{"★".repeat(product.rating)}</p>
                <p className="text-gray-700">{product.category}</p>
                <p className="text-lg font-semibold mt-2">${product.price}</p>
                <p className="text-lg font-semibold mt-5">{product.description}</p>
                <span className="p-3 rounded border w-60 bg-slate-200">
                  <Home className="w-10 h-10 inline mr-1" />
                  Instore Available
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
                {[
                  { title: 'Fast Shipping', icon: <Truck className="w-10 h-10 text-yellow-600" /> },
                  { title: 'In-store Purchases', icon: <Store className="w-10 h-10 text-yellow-600" /> },
                  { title: 'Same Day Pick Up', icon: <Clock className="w-10 h-10 text-yellow-600" /> },
                ].map(({ title, icon }, i) => (
                  <div
                    key={i}
                    className="p-6 border border-yellow-600 rounded-2xl flex flex-col items-center text-center space-y-4 bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="bg-yellow-100 rounded-full p-4">{icon}</div>
                    <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                  </div>
                ))}
              </div>

              {product.colors && (
                <div>
                  <label className="block mb-1 font-medium">Select Color:</label>
                  <div className="flex gap-2 flex-wrap">
                    {product.colors.map((color: string) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-3 py-1 rounded border ${
                          selectedColor === color ? 'bg-yellow-500 text-white' : 'bg-gray-200'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={handleAddToCart}
                className="mt-4 bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-500 transition flex items-center justify-center"
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ProductModal;
