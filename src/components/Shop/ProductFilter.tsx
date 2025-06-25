import React from 'react';
import { CategoryTypes, BrandTypes } from './Sidebar/BrandTypes';

interface Props {
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
}

const ProductFilters: React.FC<Props> = ({
  selectedCategory,
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
  selectRating,
  setSelectRating,
  priceRange,
  setPriceRange,
  availabilityFilter,
  setAvailabilityFilter
}) => {
  return (
    <div className="flex flex-wrap gap-6 mb-10 items-center justify-center bg-[#fffaf5] p-4 rounded-xl shadow">
      {/* Categories */}
      <div className="space-y-1">
        <h4 className="text-xs font-bold text-[#d5a86b] uppercase">Category</h4>
        <div className="flex flex-wrap gap-2">
          {CategoryTypes.map((cat) => (
            <button
              key={cat}
              className={`px-3 py-1 text-sm rounded-full border ${
                selectedCategory.includes(cat)
                  ? 'bg-[#d5a86b] text-white'
                  : 'border-[#d5a86b] text-[#2f2a28]'
              }`}
              onClick={() =>
                setSelectedCategory((prev) =>
                  prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
                )
              }
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div className="space-y-1">
        <h4 className="text-xs font-bold text-[#d5a86b] uppercase">Brand</h4>
        <div className="flex flex-wrap gap-2">
          {BrandTypes.map((brand) => (
            <button
              key={brand}
              className={`px-3 py-1 text-sm rounded-full border ${
                selectedBrand.includes(brand)
                  ? 'bg-[#d5a86b] text-white'
                  : 'border-[#d5a86b] text-[#2f2a28]'
              }`}
              onClick={() =>
                setSelectedBrand((prev) =>
                  prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
                )
              }
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div className="space-y-1">
        <h4 className="text-xs font-bold text-[#d5a86b] uppercase">Rating</h4>
        <div className="flex gap-1">
          {[5, 4, 3, 2].map((stars) => (
            <button
              key={stars}
              onClick={() => setSelectRating(selectRating === stars ? 0 : stars)}
              className={`px-2 py-1 rounded text-sm ${
                selectRating === stars ? 'bg-[#d5a86b] text-white' : 'bg-white text-yellow-600'
              }`}
            >
              {'★'.repeat(stars)}
            </button>
          ))}
        </div>
      </div>

      {/* Price Slider */}
      <div className="space-y-1">
        <h4 className="text-xs font-bold text-[#d5a86b] uppercase">Price</h4>
        <div className="flex flex-col items-start">
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={priceRange}
            onChange={(e) => setPriceRange(parseFloat(e.target.value))}
            className="w-40"
          />
          <span className="text-xs text-gray-500">${priceRange.toFixed(2)}</span>
        </div>
      </div>

      {/* Availability */}
      <div className="space-y-1">
        <h4 className="text-xs font-bold text-[#d5a86b] uppercase">Availability</h4>
        <div className="flex flex-wrap gap-2">
          {['In Stock', 'Out of Stock', 'In Store Only'].map((status) => (
            <button
              key={status}
              className={`px-3 py-1 text-sm rounded-full border ${
                availabilityFilter.includes(status)
                  ? 'bg-[#d5a86b] text-white'
                  : 'border-[#d5a86b] text-[#2f2a28]'
              }`}
              onClick={() =>
                setAvailabilityFilter((prev) =>
                  prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
                )
              }
            >
              {status}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
