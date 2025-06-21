import React, { useState, useEffect } from 'react';
import { fetchProducts } from '../AuthFolder/AuthFiles';
import { useCart } from '../Context/CartContext';

import LoadingAnimation from '../LoadingAnimation/LoadingAnimation';

import ProductGrid from './ProductGrid';
import PaginationControls from './PaginationControls';
import ProductModal from './ProductModal';

interface ProductProps {
  selectedCategory: string[];
  selectedBrand: string[];
  selectRating: number;
  priceRange: number;
  availabilityFilter: string[];
  setIsDesktopOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isDesktopOpen: boolean;
}

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

const ProductContent: React.FC<ProductProps> = ({
  selectedCategory,
  selectedBrand,
  selectRating,
  priceRange,
  availabilityFilter
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productsDb, setProductsDb] = useState<Product[]>([]);
  const [loadingAnimation, setLoadingAnimation] = useState(false);
  const [error, setError] = useState('');

  const itemsPerPage = 10;
  const { addToCart } = useCart();
  const username = localStorage.getItem("username");

  // Fetch products
  useEffect(() => {
    const fetchData = async () => {
      setError('');
      setLoadingAnimation(true);
      try {
        const response = await fetchProducts();
        if (response.status === 200) {
          setProductsDb(response.data);
        } else {
          setError('Unable to retrieve products. Try again.');
        }
      } catch (err: any) {
        setError(err.message || 'Cannot get products');
      } finally {
        setLoadingAnimation(false);
      }
    };

    fetchData();
  }, []);

  // Reset to page 1 on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedBrand, selectRating, priceRange, availabilityFilter]);

  // Filter logic
  const filteredProducts = productsDb.filter((product) => {
    const isCategoryMatch = selectedCategory.length === 0 || selectedCategory.includes(product.category);
    const isBrandMatch = selectedBrand.length === 0 || selectedBrand.includes(product.brand);
    const isRatingMatch = selectRating === 0 || product.rating >= selectRating;
    const isPriceMatch = typeof product.price === 'number' && product.price <= priceRange;
    const isAvailabilityMatch = availabilityFilter.length === 0 || availabilityFilter.includes(product.inStore ? 'In Stock' : 'Online');
    return isCategoryMatch && isBrandMatch && isRatingMatch && isPriceMatch && isAvailabilityMatch;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Modal open/close
  const openModal = (product: Product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="bg-black px-4 md:px-10 py-10 text-white">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {loadingAnimation && <LoadingAnimation />}
      <h1 className="text-3xl font-semibold text-yellow-500 text-center mb-6">Shop Your Care</h1>

      <ProductGrid products={paginatedProducts} onProductClick={openModal} />

      <PaginationControls
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={closeModal}
          onAddToCart={addToCart}
          username={typeof username === "string" ? username : undefined}
        />
      )}
    </div>
  );
};

export default ProductContent;
