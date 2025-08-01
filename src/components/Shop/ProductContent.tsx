import React, { useState, useEffect } from 'react';
import { fetchProducts } from '../AuthFolder/AuthFiles';
import { useCart } from '../Context/CartContext';

import LoadingAnimation from '../LoadingAnimation/LoadingAnimation';
import ProductGrid from './ProductGrid';
import PaginationControls from './PaginationControls';
import ProductModal from './ProductModal';
import ProductFilters from './ProductFilter';

interface ProductProps {
  selectedCategory: string[];
  setSelectedCategory: React.Dispatch<React.SetStateAction<string[]>>;
  selectedBrand: string[];
  setSelectedBrand: React.Dispatch<React.SetStateAction<string[]>>;
  selectRating: number;
  setSelectRating: React.Dispatch<React.SetStateAction<number>>;
  order: string;
  setOrder: React.Dispatch<React.SetStateAction<string>>;
  availabilityFilter: string[];
  setAvailabilityFilter: React.Dispatch<React.SetStateAction<string[]>>;
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
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
  selectRating,
  setSelectRating,
  order,
  setOrder,
  availabilityFilter,
  setAvailabilityFilter,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productsDb, setProductsDb] = useState<Product[]>([]);
  const [loadingAnimation, setLoadingAnimation] = useState(false);
  const [error, setError] = useState('');
  const itemsPerPage = 10;

  const { addToCart } = useCart();
  const username = localStorage.getItem('username');

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

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedCategory,
    selectedBrand,
    selectRating,
    order,
    availabilityFilter,
  ]);

  // Filtering logic (without price range)
  const filteredProducts = productsDb.filter((product) => {
    const isCategoryMatch =
      selectedCategory.length === 0 || selectedCategory.includes(product.category);

    const isBrandMatch =
      selectedBrand.length === 0 || selectedBrand.includes(product.brand);

    const isRatingMatch = selectRating === 0 || product.rating >= selectRating;

    const isAvailabilityMatch =
      availabilityFilter.length === 0 ||
      availabilityFilter.includes(product.inStore ? 'In Stock' : 'Online');

    return (
      isCategoryMatch &&
      isBrandMatch &&
      isRatingMatch &&
      isAvailabilityMatch
    );
  });

  // Sort products by price
  const sortProducts = [...filteredProducts].sort((a, b) => {
    const priceA = typeof a.price === 'number' ? a.price : 0;
    const priceB = typeof b.price === 'number' ? b.price : 0;

    if (order === 'Price: Low to High') return priceA - priceB;
    if (order === 'Price: High to Low') return priceB - priceA;
    return 0;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = sortProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openModal = (product: Product) => setSelectedProduct(product);
  const closeModal = () => setSelectedProduct(null);

  return (
    <div className="bg-[#fdf9f3] px-4 md:px-10 py-12 text-[#2f2a28] min-h-screen font-raleway">
      {loadingAnimation && <LoadingAnimation />}
      {error && <p className="text-red-600 font-medium text-center">{error}</p>}

      <h1 className="text-6xl md:text-8xl text-center font-[satisfy] text-[#2f2a28] mb-6">
        Shop Your Care
      </h1>

      {!loadingAnimation && filteredProducts.length === 0 && (
        <p className="text-center text-gray-500 mb-12">
          No products match your filters. Try adjusting the categories or sort order.
        </p>
      )}

      <ProductFilters
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedBrand={selectedBrand}
        setSelectedBrand={setSelectedBrand}
        selectRating={selectRating}
        setSelectRating={setSelectRating}
        order={order}
        setOrder={setOrder}
        availabilityFilter={availabilityFilter}
        setAvailabilityFilter={setAvailabilityFilter}
      />

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
          username={typeof username === 'string' ? username : undefined}
        />
      )}
    </div>
  );
};

export default ProductContent;
