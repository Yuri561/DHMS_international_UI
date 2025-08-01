import React from 'react';

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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 overflow-hidden">
      {products.map((product) => (
        <div
          key={product.id}
          className="relative group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 bg-white text-[#2f2a28] flex flex-col"
        >
          {/* Product Image with Glass Overlay */}
          <div className="relative">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full  h-92 object-cover transition-transform duration-300 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-white/10 h-100 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
              <button
                onClick={() => onProductClick(product)}
                className="bg-[#d5a86b]  cursor-pointer text-white px-4 py-2 rounded-full hover:brightness-110 transition"
              >
                Quick View
              </button>
            </div>

            {product.inStore && (
              <span className="absolute top-3 left-3 bg-[#f3cb50] text-black text-xs font-semibold px-2 py-1 rounded shadow">
                In Store
              </span>
            )}
          </div>

          {/* Product Info */}
          <div className="p-4 flex flex-col gap-1">
            <h3 className="text-md font-bold truncate">{product.name}</h3>

            {typeof product.price === 'number' && (
              <p className="text-sm text-[#a67c52] font-semibold">${product.price.toFixed(2)}</p>
            )}

            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <span
                  key={i}
                  className={`text-sm ${
                    i < product.rating ? 'text-yellow-500' : 'text-gray-300'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
