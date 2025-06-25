import React from 'react'
import ProductContent from './ProductContent'


const Shop: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = React.useState<string[]>([])
  const [selectedBrand, setSelectedBrand] = React.useState<string[]>([])
  const [selectRating, setSelectRating] = React.useState<number>(0)
  const [priceRange, setPriceRange] = React.useState<number>(30.00)
  const [availabilityFilter, setAvailabilityFilter] = React.useState<string[]>([])
   const [isDesktopOpen, setIsDesktopOpen] = React.useState(true);
  return (
    <section id='shop' className="p-4 min-h-screen mt-12 bg-[#fdf9f3] pt-36 md:pt-28 lg:pt-24">
      {/* Main content */}
      <div className="flex-1 p-4">
        <ProductContent
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          setSelectedBrand={setSelectedBrand}
          selectedBrand={selectedBrand}
          selectRating={selectRating}
          setSelectRating={setSelectRating}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          availabilityFilter={availabilityFilter}
          setAvailabilityFilter={setAvailabilityFilter}
          setIsDesktopOpen={setIsDesktopOpen}
          isDesktopOpen={isDesktopOpen}
        />
      </div>
    </section>
  )
}

export default Shop
