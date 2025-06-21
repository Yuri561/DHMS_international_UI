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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="relative group rounded overflow-hidden shadow-lg bg-white text-black"
        >
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-64 object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-white/10 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
            <button
              onClick={() => onProductClick(product)}
              className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-500 transition"
            >
              Quick View
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
