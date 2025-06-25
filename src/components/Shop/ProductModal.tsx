import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import LoadingAnimation from '../LoadingAnimation/LoadingAnimation';
import { X } from 'lucide-react';

interface Product {
  id: string | number;
  name: string;
  price?: number;
  imageUrl: string;
  category: string;
  rating: number;
  brand?: string;
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
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (product?.colors?.length) {
      setSelectedColor(product.colors[0]);
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!username) {
      alert('Please sign in to add items to cart');
      return;
    }

    onAddToCart({
      ...product,
      color: selectedColor,
      quantity: 1,
      totalPrice: product.price,
    });

    setLoading(true);
    onClose();
    setLoading(false);
    navigate('/cart');
    toast.success('Successfully added product');
  };

  return (
    <Dialog open={!!product} onClose={onClose} className="fixed inset-0 z-50 overflow-y-auto">
  <div className="flex items-center justify-center min-h-screen px-4">
    {loading && <LoadingAnimation/>}
    <div className="fixed inset-0 bg-black bg-opacity-70" />
    <div className="relative z-50 bg-[#fef5e5] rounded-xl overflow-hidden shadow-4xl w-full max-w-5xl">
      
      {/* Banner */}
      <div className="bg-[#D4AF37] py-3 text-center">
        <h2 className="text-4xl font-[satisfy] text-black tracking-wider">PRODUCT</h2>
      </div>

      <div className="p-6 flex flex-col md:flex-row gap-6">
        {/* Image */}
        <div className="md:w-1/2 flex-shrink-0">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="rounded-lg object-cover w-full h-full"
          />
        </div>

        {/* Info */}
        <div className="md:w-1/2 flex flex-col justify-between">
          <div>
            <p className="uppercase text-xs text-gray-600 mb-1">{product.brand}</p>
            <h3 className="text-2xl font-serif font-extrabold text-[#2c0e3a]">{product.name}</h3>
            <p className="uppercase text-sm text-gray-700 mt-1">{product.brand ?? 'WOMEN TYPE'}</p>

            <p className="text-xl font-semibold text-yellow-600 mt-3">${product.price?.toFixed(2)}</p>
            <p className="text-sm text-gray-600">
              {"★".repeat(product.rating)}{" "}
              <span className="text-[12px] text-red-500">(125 customer reviews)</span>
            </p>

            <p className="text-sm text-gray-700 mt-3 leading-relaxed">
              {product.description ??
                'A lavish and enchanting women’s fragrance oil with a bouquet of floral notes. Embrace your femininity with this captivating scent.'}
            </p>
          </div>

          <button
            onClick={handleAddToCart}
            className="mt-6 bg-[#c9372c] text-white font-bold py-2 rounded hover:bg-[#aa2f24] transition"
          >
            ADD TO CART
          </button>
        </div>
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-white bg-black/40 hover:bg-black/70 p-1 rounded-full"
        title="Close"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  </div>
</Dialog>

  );
};

export default ProductModal;
