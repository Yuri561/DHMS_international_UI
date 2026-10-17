import React from "react";

import {
  Check,
  ChevronDown,
  RotateCcw,
  Star,
  Store,
  Truck,
} from "lucide-react";

import { CategoryTypes } from "./Sidebar/BrandTypes";

// ============================================================
// TYPES
// ============================================================

interface ProductFilterProps {
  selectedCategory: string[];

  setSelectedCategory: React.Dispatch<
    React.SetStateAction<string[]>
  >;

  selectedBrand: string[];

  setSelectedBrand: React.Dispatch<
    React.SetStateAction<string[]>
  >;

  selectRating: number;

  setSelectRating: React.Dispatch<
    React.SetStateAction<number>
  >;

  order: string;

  setOrder: React.Dispatch<
    React.SetStateAction<string>
  >;

  availableBrands: string[];

  availabilityFilter: string[];

  setAvailabilityFilter: React.Dispatch<
    React.SetStateAction<string[]>
  >;
}

// ============================================================
// PRODUCT FILTERS
// ============================================================

const ProductFilters: React.FC<ProductFilterProps> = ({
  selectedCategory,
  setSelectedCategory,

  selectedBrand,
  setSelectedBrand,

  selectRating,
  setSelectRating,

  order,
  setOrder,

  availableBrands,

  availabilityFilter,
  setAvailabilityFilter,
}) => {
  // ----------------------------------------------------------
  // CATEGORY
  // ----------------------------------------------------------

  const toggleCategory = (category: string) => {
    setSelectedCategory((current) =>
      current.includes(category)
        ? current.filter(
            (item) => item !== category
          )
        : [...current, category]
    );
  };

  // ----------------------------------------------------------
  // BRAND
  // ----------------------------------------------------------

  const toggleBrand = (brand: string) => {
    setSelectedBrand((current) =>
      current.includes(brand)
        ? current.filter(
            (item) => item !== brand
          )
        : [...current, brand]
    );
  };

  // ----------------------------------------------------------
  // AVAILABILITY
  // ----------------------------------------------------------

  const toggleAvailability = (
    value: string
  ) => {
    setAvailabilityFilter((current) =>
      current.includes(value)
        ? current.filter(
            (item) => item !== value
          )
        : [...current, value]
    );
  };

  // ----------------------------------------------------------
  // RESET
  // ----------------------------------------------------------

  const clearFilters = () => {
    setSelectedCategory([]);
    setSelectedBrand([]);
    setSelectRating(0);
    setAvailabilityFilter([]);
    setOrder("");
  };

  const hasActiveFilters =
    selectedCategory.length > 0 ||
    selectedBrand.length > 0 ||
    selectRating > 0 ||
    availabilityFilter.length > 0 ||
    order.length > 0;

  // ----------------------------------------------------------
  // LABELS
  // ----------------------------------------------------------

  const categoryLabel =
    selectedCategory.length === 0
      ? "All Categories"
      : selectedCategory.length === 1
        ? selectedCategory[0]
        : `${selectedCategory.length} Categories`;

  const brandLabel =
    selectedBrand.length === 0
      ? "All Brands"
      : selectedBrand.length === 1
        ? selectedBrand[0]
        : `${selectedBrand.length} Brands`;

  return (
    <div
      className="
        relative
        z-50
        w-full
        min-w-0
        overflow-visible
      "
    >
      {/* ====================================================== */}
      {/* COMPACT FILTER BAR                                    */}
      {/* ====================================================== */}

      <div
        className="
          grid
          grid-cols-1
          gap-3

          sm:grid-cols-2

          lg:grid-cols-3

          xl:grid-cols-[1.15fr_1.15fr_1fr_0.85fr_1.1fr_auto]
          xl:items-end
        "
      >
        {/* ==================================================== */}
        {/* CATEGORY                                             */}
        {/* ==================================================== */}

        <FilterField label="Category">
          <details
            className="
              group
              relative
              z-[70]
            "
          >
            <summary
              className="
                flex
                h-11
                cursor-pointer
                list-none
                items-center
                justify-between
                gap-3

                border
                border-[#DDD1C3]

                bg-[#FAF8F4]

                px-4

                transition-colors
                duration-200

                hover:border-[#A67C52]

                [&::-webkit-details-marker]:hidden
              "
            >
              <span
                className="
                  min-w-0
                  truncate

                  font-raleway
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.07em]

                  text-[#55483E]
                "
              >
                {categoryLabel}
              </span>

              <ChevronDown
                size={15}
                strokeWidth={1.7}
                className="
                  shrink-0
                  text-[#A67C52]
                  transition-transform
                  duration-200

                  group-open:rotate-180
                "
              />
            </summary>

            {/* CATEGORY DROPDOWN */}

            <div
              className="
                absolute
                left-0
                top-[calc(100%+6px)]

                z-[200]

                max-h-[320px]

                w-full
                min-w-[260px]

                overflow-y-auto
                overscroll-contain

                border
                border-[#DDD1C3]

                bg-white

                p-2

                shadow-[0_18px_50px_rgba(41,33,28,0.16)]
              "
            >
              <div
                className="
                  mb-1
                  border-b
                  border-[#EEE6DD]
                  px-3
                  pb-2
                  pt-1
                "
              >
                <p
                  className="
                    font-raleway
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.14em]
                    text-[#A67C52]
                  "
                >
                  Shop by category
                </p>
              </div>

              {CategoryTypes.map(
                (category) => {
                  const active =
                    selectedCategory.includes(
                      category
                    );

                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() =>
                        toggleCategory(
                          category
                        )
                      }
                      className="
                        flex
                        min-h-10
                        w-full

                        items-center
                        justify-between

                        gap-3

                        px-3
                        py-2

                        text-left

                        transition-colors
                        duration-150

                        hover:bg-[#F5EFE7]
                      "
                    >
                      <span
                        className="
                          font-raleway
                          text-[10px]
                          font-semibold
                          uppercase
                          tracking-[0.055em]

                          text-[#5E5146]
                        "
                      >
                        {category}
                      </span>

                      <span
                        className={`
                          flex
                          h-4
                          w-4
                          shrink-0

                          items-center
                          justify-center

                          border

                          ${
                            active
                              ? "border-[#29211C] bg-[#29211C] text-white"
                              : "border-[#CFC2B4] bg-white"
                          }
                        `}
                      >
                        {active && (
                          <Check
                            size={11}
                            strokeWidth={
                              2.5
                            }
                          />
                        )}
                      </span>
                    </button>
                  );
                }
              )}
            </div>
          </details>
        </FilterField>

        {/* ==================================================== */}
        {/* BRAND                                                */}
        {/* ==================================================== */}

        <FilterField label="Brand">
          <details
            className="
              group
              relative
              z-[80]
            "
          >
            <summary
              className="
                flex
                h-11
                cursor-pointer
                list-none
                items-center
                justify-between
                gap-3

                border
                border-[#DDD1C3]

                bg-[#FAF8F4]

                px-4

                transition-colors
                duration-200

                hover:border-[#A67C52]

                [&::-webkit-details-marker]:hidden
              "
            >
              <span
                className="
                  min-w-0
                  truncate

                  font-raleway
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.07em]

                  text-[#55483E]
                "
              >
                {brandLabel}
              </span>

              <ChevronDown
                size={15}
                strokeWidth={1.7}
                className="
                  shrink-0
                  text-[#A67C52]

                  transition-transform
                  duration-200

                  group-open:rotate-180
                "
              />
            </summary>

            {/* BRAND DROPDOWN */}

            <div
              className="
                absolute
                left-0
                top-[calc(100%+6px)]

                z-[200]

                max-h-[340px]

                w-full
                min-w-[280px]

                overflow-y-auto
                overscroll-contain

                border
                border-[#DDD1C3]

                bg-white

                p-2

                shadow-[0_18px_50px_rgba(41,33,28,0.16)]
              "
            >
              <div
                className="
                  sticky
                  top-0

                  z-10

                  mb-1

                  border-b
                  border-[#EEE6DD]

                  bg-white

                  px-3
                  pb-2
                  pt-1
                "
              >
                <p
                  className="
                    font-raleway
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.14em]

                    text-[#A67C52]
                  "
                >
                  Shop by brand
                </p>
              </div>

              {availableBrands.length >
              0 ? (
                availableBrands.map(
                  (brand) => {
                    const active =
                      selectedBrand.includes(
                        brand
                      );

                    return (
                      <button
                        key={brand}
                        type="button"
                        onClick={() =>
                          toggleBrand(
                            brand
                          )
                        }
                        className="
                          flex
                          min-h-10
                          w-full

                          items-center
                          justify-between

                          gap-3

                          px-3
                          py-2

                          text-left

                          transition-colors
                          duration-150

                          hover:bg-[#F5EFE7]
                        "
                      >
                        <span
                          className="
                            font-raleway
                            text-[10px]
                            font-semibold
                            uppercase
                            tracking-[0.055em]

                            text-[#5E5146]
                          "
                        >
                          {brand}
                        </span>

                        <span
                          className={`
                            flex
                            h-4
                            w-4
                            shrink-0

                            items-center
                            justify-center

                            border

                            ${
                              active
                                ? "border-[#A67C52] bg-[#A67C52] text-white"
                                : "border-[#CFC2B4] bg-white"
                            }
                          `}
                        >
                          {active && (
                            <Check
                              size={11}
                              strokeWidth={
                                2.5
                              }
                            />
                          )}
                        </span>
                      </button>
                    );
                  }
                )
              ) : (
                <p
                  className="
                    px-3
                    py-5
                    font-play
                    text-xs
                    text-[#928578]
                  "
                >
                  No brands available.
                </p>
              )}
            </div>
          </details>
        </FilterField>

        {/* ==================================================== */}
        {/* AVAILABILITY                                         */}
        {/* ==================================================== */}

        <FilterField label="Availability">
          <div
            className="
              grid
              grid-cols-2
              gap-2
            "
          >
            <AvailabilityButton
              label="In Store"
              active={availabilityFilter.includes(
                "In Stock"
              )}
              icon={
                <Store
                  size={14}
                  strokeWidth={1.6}
                />
              }
              onClick={() =>
                toggleAvailability(
                  "In Stock"
                )
              }
            />

            <AvailabilityButton
              label="Online"
              active={availabilityFilter.includes(
                "Online"
              )}
              icon={
                <Truck
                  size={14}
                  strokeWidth={1.6}
                />
              }
              onClick={() =>
                toggleAvailability(
                  "Online"
                )
              }
            />
          </div>
        </FilterField>

        {/* ==================================================== */}
        {/* RATING                                               */}
        {/* ==================================================== */}

        <FilterField label="Rating">
          <div className="relative">
            <Star
              size={14}
              fill="currentColor"
              strokeWidth={1.4}
              className="
                pointer-events-none
                absolute
                left-3.5
                top-1/2
                -translate-y-1/2

                text-[#C28B30]
              "
            />

            <select
              value={selectRating}
              onChange={(event) =>
                setSelectRating(
                  Number(
                    event.target.value
                  )
                )
              }
              className="
                h-11
                w-full

                appearance-none

                border
                border-[#DDD1C3]

                bg-[#FAF8F4]

                pl-9
                pr-9

                font-raleway
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.065em]

                text-[#55483E]

                outline-none

                transition-colors
                duration-200

                hover:border-[#A67C52]
                focus:border-[#A67C52]
              "
            >
              <option value={0}>
                Any Rating
              </option>

              <option value={5}>
                5 Stars
              </option>

              <option value={4}>
                4+ Stars
              </option>

              <option value={3}>
                3+ Stars
              </option>

              <option value={2}>
                2+ Stars
              </option>
            </select>

            <ChevronDown
              size={14}
              strokeWidth={1.7}
              className="
                pointer-events-none
                absolute
                right-3
                top-1/2
                -translate-y-1/2

                text-[#A67C52]
              "
            />
          </div>
        </FilterField>

        {/* ==================================================== */}
        {/* SORT                                                 */}
        {/* ==================================================== */}

        <FilterField label="Sort">
          <div className="relative">
            <select
              value={order}
              onChange={(event) =>
                setOrder(
                  event.target.value
                )
              }
              className="
                h-11
                w-full

                appearance-none

                border
                border-[#DDD1C3]

                bg-[#FAF8F4]

                px-4
                pr-9

                font-raleway
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.055em]

                text-[#55483E]

                outline-none

                transition-colors
                duration-200

                hover:border-[#A67C52]
                focus:border-[#A67C52]
              "
            >
              <option value="">
                Featured
              </option>

              <option value="Price: Low to High">
                Price: Low to High
              </option>

              <option value="Price: High to Low">
                Price: High to Low
              </option>
            </select>

            <ChevronDown
              size={14}
              strokeWidth={1.7}
              className="
                pointer-events-none
                absolute
                right-3
                top-1/2
                -translate-y-1/2

                text-[#A67C52]
              "
            />
          </div>
        </FilterField>

        {/* ==================================================== */}
        {/* RESET                                                */}
        {/* ==================================================== */}

        <div>
          <span
            aria-hidden="true"
            className="
              mb-2
              hidden

              text-[9px]
              font-bold
              uppercase
              tracking-[0.15em]

              text-transparent

              xl:block
            "
          >
            Reset
          </span>

          <button
            type="button"
            onClick={clearFilters}
            disabled={!hasActiveFilters}
            className="
              flex
              h-11
              w-full

              items-center
              justify-center

              gap-2

              border
              border-[#DDD1C3]

              bg-white

              px-4

              font-raleway
              text-[10px]
              font-bold
              uppercase
              tracking-[0.07em]

              text-[#8D623B]

              transition-all
              duration-200

              hover:border-[#A67C52]
              hover:bg-[#F5EFE7]

              disabled:cursor-not-allowed
              disabled:opacity-30

              xl:w-auto
            "
          >
            <RotateCcw
              size={13}
              strokeWidth={1.7}
            />

            Reset
          </button>
        </div>
      </div>

      {/* ====================================================== */}
      {/* ACTIVE FILTER SUMMARY                                 */}
      {/* ====================================================== */}

      {hasActiveFilters && (
        <div
          className="
            mt-3

            flex
            flex-wrap

            items-center

            gap-x-4
            gap-y-1

            border-t
            border-[#EEE5DB]

            pt-3
          "
        >
          <span
            className="
              font-raleway
              text-[9px]
              font-bold
              uppercase
              tracking-[0.12em]

              text-[#A67C52]
            "
          >
            Active
          </span>

          {selectedCategory.length >
            0 && (
            <span
              className="
                font-play
                text-xs
                text-[#71655A]
              "
            >
              {selectedCategory.length}{" "}
              {selectedCategory.length ===
              1
                ? "category"
                : "categories"}
            </span>
          )}

          {selectedBrand.length >
            0 && (
            <span
              className="
                font-play
                text-xs
                text-[#71655A]
              "
            >
              {selectedBrand.length}{" "}
              {selectedBrand.length ===
              1
                ? "brand"
                : "brands"}
            </span>
          )}

          {availabilityFilter.length >
            0 && (
            <span
              className="
                font-play
                text-xs
                text-[#71655A]
              "
            >
              {
                availabilityFilter.length
              }{" "}
              availability
            </span>
          )}

          {selectRating > 0 && (
            <span
              className="
                font-play
                text-xs
                text-[#71655A]
              "
            >
              {selectRating}+ stars
            </span>
          )}

          {order && (
            <span
              className="
                font-play
                text-xs
                text-[#71655A]
              "
            >
              {order}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================================
// FILTER FIELD
// ============================================================

interface FilterFieldProps {
  label: string;
  children: React.ReactNode;
}

const FilterField: React.FC<
  FilterFieldProps
> = ({ label, children }) => {
  return (
    <div
      className="
        relative
        min-w-0
        overflow-visible
      "
    >
      <p
        className="
          mb-2

          font-raleway
          text-[9px]
          font-bold
          uppercase
          tracking-[0.15em]

          text-[#A67C52]
        "
      >
        {label}
      </p>

      {children}
    </div>
  );
};

// ============================================================
// AVAILABILITY BUTTON
// ============================================================

interface AvailabilityButtonProps {
  label: string;
  active: boolean;
  icon: React.ReactNode;
  onClick: () => void;
}

const AvailabilityButton: React.FC<
  AvailabilityButtonProps
> = ({
  label,
  active,
  icon,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`
        flex
        h-11
        min-w-0

        items-center
        justify-center

        gap-2

        border

        px-2

        font-raleway
        text-[9px]
        font-semibold
        uppercase
        tracking-[0.05em]

        transition-all
        duration-200

        ${
          active
            ? `
              border-[#29211C]
              bg-[#29211C]
              text-white
            `
            : `
              border-[#DDD1C3]
              bg-[#FAF8F4]
              text-[#5E5146]

              hover:border-[#A67C52]
            `
        }
      `}
    >
      {icon}

      <span className="truncate">
        {label}
      </span>
    </button>
  );
};

export default ProductFilters;