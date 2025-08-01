import React from 'react';
import { Heart } from 'lucide-react';

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
}

interface ProductGridProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, onProductClick }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 px-3 md:px-0">
      {products.map((product) => (
        <div
          key={product.id}
          className="group bg-white shadow-xl rounded-2xl overflow-hidden transition-transform duration-300 hover:scale-[1.02] border border-gray-100  hover:shadow relative"
        >
          {/* Wishlist icon */}
          <button className="absolute top-2 right-2 z-10 p-1 bg-white/90 rounded-full hover:bg-[#f3cb50]/90 transition">
            <Heart className="w-4 h-4 text-gray-400 hover:text-[#2f2a28]" />
          </button>

          {/* Image */}
          <div className="relative w-full h-[440px] sm:h-[400px] rounded-t-2xl overflow-hidden">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            />

            {product.inStore && (
              <span className="absolute top-2 left-2 bg-[#f3cb50] text-black text-[10px] font-bold px-2 py-1 rounded-full shadow-md">
                In Store
              </span>
            )}

            {/* Overlay Button */}
            <div className="absolute inset-0 bg-black/10 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <button
                onClick={() => onProductClick(product)}
                className="bg-white text-[#2f2a28] text-xs px-4 cursor-pointer py-1.5 rounded-full font-semibold shadow hover:bg-[#f3cb50] hover:text-black transition"
              >
                Quick View
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="p-3 space-y-2">
            <h3 className="text-sm font-semibold truncate text-[#2f2a28] leading-tight">
              {product.name}
            </h3>

            {typeof product.price === 'number' && (
              <p className="text-sm text-[#a67c52] font-bold tracking-wide">
                ${product.price.toFixed(2)}
              </p>
            )}

            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }, (_, i) => (
                <span
                  key={i}
                  className={`text-xs ${i < product.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                >
                  ★
                </span>
              ))}
            </div>

            {/* Colors */}
            {product.colors?.length && (
              <div className="flex gap-1 mt-1">
                {product.colors.map((color, i) => (
                  <span
                    key={i}
                    className="w-3.5 h-3.5 rounded-full border border-gray-300"
                    style={{ backgroundColor: color }}
                  ></span>
                ))}
              </div>
            )}

            <p className="text-[10px] text-gray-400 mt-1 truncate">{product.category}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
