import React, { useState, useEffect } from 'react';
import { Home, Menu, X } from 'lucide-react';
import { BrandTypes, CategoryTypes } from './BrandTypes';

interface SidebarProps {
  selectedCategory: string[];
  setSelectedCategory: React.Dispatch<React.SetStateAction<string[]>>;
  selectedBrand: string[];
  setSelectedBrand: React.Dispatch<React.SetStateAction<string[]>>;
  selectRating: number;
  setSelectRating: React.Dispatch<React.SetStateAction<number>>;
  priceRange: number;
  setPriceRange: React.Dispatch<React.SetStateAction<number>>;
  availabilityFilter: string[];
  setAvailabilityFilter: React.Dispatch<React.SetStateAction<string[]>>;
  setIsDesktopOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isDesktopOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  selectedCategory, setSelectedCategory,
  selectedBrand, setSelectedBrand,
  selectRating, setSelectRating,
  priceRange, setPriceRange,
  availabilityFilter, setAvailabilityFilter,
  setIsDesktopOpen,
  isDesktopOpen
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);


  const hideDesktopSidebar = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent reopening immediately
    setIsDesktopOpen(false);
  };

  const toggleMobileSidebar = () => setIsMobileOpen(!isMobileOpen);

  // Reopen sidebar on any page click (desktop)
  useEffect(() => {
    const handleClick = () => setIsDesktopOpen(true);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const SidebarContent = () => (
    <div className="space-y-6 p-4 bg-black text-white w-full md:w-64 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-xl font-play">Filter By</h4>
        <button
          onClick={hideDesktopSidebar}
          className="hidden md:block cursor-pointer p-1 bg-[#f3cb50] text-black rounded shadow"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>
      <div className="border-b border-gray-500 mb-4" />

      {/* PICK UP & DELIVERY */}
      <div className="flex flex-col items-center mb-4">
        <h4 className="text-xl font-play">PICK UP & DELIVERY</h4>
        <div className="flex items-center gap-2 p-4">
          <Home className="w-7 h-7 text-white" />
          <span className="text-sm text-gray-400">In store pick up</span>
        </div>
      </div>

      {/* BRAND FILTER */}
      <div className="space-y-2 mb-4 flex flex-col">
        <h4 className="font-semibold text-sm mb-1">BRAND</h4>
        <ul className="space-y-1 text-sm">
          {BrandTypes.map((brand, index) => (
            <li key={index}>
              <label className="flex items-center gap-2">
                <input type="checkbox"
                  checked={selectedBrand.includes(brand)}
                  onChange={() => {
                    setSelectedBrand(selectedBrand.includes(brand)
                      ? selectedBrand.filter(b => b !== brand)
                      : [...selectedBrand, brand]);
                  }}
                  className="accent-yellow-500" />
                {brand}
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* CATEGORIES */}
      <div className="space-y-2 mb-4 flex flex-col">
        <h4 className="font-semibold text-sm mb-1">CATEGORIES</h4>
        <details className="border rounded p-2">
          <summary className="cursor-pointer text-sm">Select Categories</summary>
          <ul className="space-y-1 mt-2 text-sm">
            {CategoryTypes.map((category, index) => (
              <li key={index}>
                <label className="flex items-center gap-2">
                  <input type="checkbox"
                    checked={selectedCategory.includes(category)}
                    onChange={() => {
                      setSelectedCategory(selectedCategory.includes(category)
                        ? selectedCategory.filter(c => c !== category)
                        : [...selectedCategory, category]);
                    }}
                    className="accent-yellow-500" />
                  {category}
                </label>
              </li>
            ))}
          </ul>
        </details>
      </div>

      {/* PRICE RANGE */}
      <div className="space-y-2 mb-4 border border-white rounded p-4 bg-transparent">
        <h4 className="font-semibold text-sm text-white">Price Range</h4>
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>$0</span>
          <span>${priceRange.toFixed(2)}</span>
          <span>$100</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={priceRange}
          onChange={(e) => setPriceRange(parseFloat(e.target.value))}
          className="w-full h-2 bg-white rounded-lg appearance-none cursor-pointer"
        />
      </div>


      {/* RATING */}
      <div className="space-y-2 mb-4">
        <h4 className="font-semibold text-sm">RATING</h4>
        <ul className="space-y-1 text-sm">
          {[5, 4, 3, 2].map((stars) => (
            <li key={stars}>
              <label className="flex items-center gap-2">
                <input type="checkbox"
                  checked={selectRating === stars}
                  onChange={() => setSelectRating(selectRating === stars ? 0 : stars)}
                  className="accent-yellow-500" />
                <span className="text-yellow-400">{"★".repeat(stars)}</span>
                <span className="text-gray-400">{"☆".repeat(5 - stars)}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* AVAILABILITY */}
      <div className="space-y-2 mb-4">
        <h4 className="font-semibold text-sm">AVAILABILITY</h4>
        <ul className="space-y-1 text-sm">
          {["In Stock", "Out of Stock", "In Store Only"].map((status) => (
            <li key={status}>
              <label className="flex items-center gap-2">
                <input type="checkbox"
                  checked={availabilityFilter.includes(status)}
                  onChange={() => {
                    setAvailabilityFilter(availabilityFilter.includes(status)
                      ? availabilityFilter.filter(a => a !== status)
                      : [...availabilityFilter, status]);
                  }}
                  className="accent-yellow-500" />
                {status}
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      {isDesktopOpen && (
        <div className="hidden md:block">
          <SidebarContent />
        </div>
      )}

      {/* Mobile Toggle */}
      <button
        onClick={toggleMobileSidebar}
        className="block md:hidden fixed top-4 left-4  z-50 p-2 bg-[#f3cb50] text-black rounded shadow"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-80  mt-32 pt-32 flex">
          <div className="w-64">
            <SidebarContent />
          </div>
          <button
            onClick={toggleMobileSidebar}
            className="absolute top-4 right-4 p-2 bg-[#f3cb50] text-black rounded shadow"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      )}
    </>
  );
};

export default Sidebar;
