

import React, {

  useState,

  useEffect,

  useMemo,

  useCallback,

  useRef,

} from "react";



import {

  motion,

  AnimatePresence,

  useReducedMotion,

} from "framer-motion";



import {

  Search,

  SlidersHorizontal,

  X,

  ArrowUpRight,

  ShoppingBag,

  ChevronDown,

  RotateCcw,

  PackageSearch,

  AlertCircle,

  Sparkles,

  ArrowRight,

} from "lucide-react";



import { fetchProducts } from "../AuthFolder/AuthFiles";



import { useCart } from "../Context/CartContext";



import ProductGrid from "./ProductGrid";

import PaginationControls from "./PaginationControls";

import ProductModal from "./ProductModal";

import ProductFilters from "./ProductFilter";



// ============================================================

// TYPES

// ============================================================



interface ProductProps {

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
  availabilityFilter: string[];



  setAvailabilityFilter: React.Dispatch<

    React.SetStateAction<string[]>

  >;



  setIsDesktopOpen: React.Dispatch<

    React.SetStateAction<boolean>

  >;



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



const ITEMS_PER_PAGE = 10;



// ============================================================

// BRAND NORMALIZATION

// ============================================================



function getBrandName(brand: Product["brand"]): string {

  if (typeof brand === "string") {

    return brand;

  }



  if (

    brand &&

    typeof brand === "object" &&

    typeof brand.name === "string"

  ) {

    return brand.name;

  }



  return "";

}



// ============================================================

// PRODUCT CONTENT

// ============================================================



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

  // ----------------------------------------------------------

  // STATE

  // ----------------------------------------------------------



  const [productsDb, setProductsDb] = useState<Product[]>([]);



  const [currentPage, setCurrentPage] = useState(1);



  const [selectedProduct, setSelectedProduct] =

    useState<Product | null>(null);



  const [loading, setLoading] = useState(true);



  const [error, setError] = useState("");



  const [searchQuery, setSearchQuery] = useState("");



  const [mobileFiltersOpen, setMobileFiltersOpen] =

    useState(false);



  const [showFilters, setShowFilters] = useState(true);



  const reduceMotion = useReducedMotion();



  const shopRef = useRef<HTMLDivElement>(null);



  const { addToCart } = useCart();



  const username =

    typeof window !== "undefined"

      ? localStorage.getItem("username")

      : null;







// ----------------------------------------------------------

// AVAILABLE BRANDS

// ----------------------------------------------------------



const availableBrands = useMemo<string[]>(() => {
  const brands = productsDb
    .map((product) => getBrandName(product.brand))
    .filter((brand) => brand.length > 0);

  return [...new Set<string>(brands)].sort((a, b) =>
    a.localeCompare(b)
  );
}, [productsDb]);













  // ----------------------------------------------------------

  // FETCH PRODUCTS

  // ----------------------------------------------------------





  const loadProducts = useCallback(async () => {

    setLoading(true);

    setError("");



    try {

      const response = await fetchProducts();



      if (response.status !== 200) {

        throw new Error(

          "We couldn't load the collection. Please try again."

        );

      }



      if (!Array.isArray(response.data)) {

        throw new Error(

          "The product catalog returned an unexpected response."

        );

      }



      setProductsDb(response.data);

    } catch (err) {

      console.error("DHMS product loading error:", err);



      setError(

        err instanceof Error

          ? err.message

          : "Something went wrong while loading the collection."

      );

    } finally {

      setLoading(false);

    }

  }, []);



  useEffect(() => {

    void loadProducts();

  }, [loadProducts]);



  // ----------------------------------------------------------

  // FILTER COUNT

  // ----------------------------------------------------------



  const activeFilterCount =

    selectedCategory.length +

    selectedBrand.length +

    availabilityFilter.length +

    (selectRating > 0 ? 1 : 0);



  const hasFilters =

    activeFilterCount > 0 || searchQuery.trim().length > 0;



  // ----------------------------------------------------------

  // FILTER PRODUCTS

  // ----------------------------------------------------------



  const filteredProducts = useMemo(() => {

    const query = searchQuery.trim().toLowerCase();



    return productsDb.filter((product) => {

      const brandName = getBrandName(product.brand);



      // SEARCH



      const searchableText = [

        product.name,

        product.description,

        product.category,

        brandName,

      ]

        .filter(Boolean)

        .join(" ")

        .toLowerCase();



      const matchesSearch =

        !query || searchableText.includes(query);



      // CATEGORY



      const matchesCategory =

        selectedCategory.length === 0 ||

        selectedCategory.includes(product.category);



      // BRAND



      const matchesBrand =

        selectedBrand.length === 0 ||

        selectedBrand.includes(brandName);



      // RATING



      const matchesRating =

        selectRating === 0 ||

        Number(product.rating || 0) >= selectRating;



      // AVAILABILITY



      // Preserves the meaning of your existing

      // availability filters.



      const availabilityLabel = product.inStore

        ? "In Stock"

        : "Online";



      const matchesAvailability =

        availabilityFilter.length === 0 ||

        availabilityFilter.includes(availabilityLabel);



      return (

        matchesSearch &&

        matchesCategory &&

        matchesBrand &&

        matchesRating &&

        matchesAvailability

      );

    });

  }, [

    productsDb,

    searchQuery,

    selectedCategory,

    selectedBrand,

    selectRating,

    availabilityFilter,

  ]);



  // ----------------------------------------------------------

  // SORT PRODUCTS

  // ----------------------------------------------------------



  const sortedProducts = useMemo(() => {

    const products = [...filteredProducts];



    if (order === "Price: Low to High") {

      products.sort(

        (a, b) =>

          Number(a.price ?? 0) -

          Number(b.price ?? 0)

      );

    }



    if (order === "Price: High to Low") {

      products.sort(

        (a, b) =>

          Number(b.price ?? 0) -

          Number(a.price ?? 0)

      );

    }



    return products;

  }, [filteredProducts, order]);



  // ----------------------------------------------------------

  // PAGINATION

  // ----------------------------------------------------------



  const totalPages = Math.ceil(

    sortedProducts.length / ITEMS_PER_PAGE

  );



  const safeCurrentPage = Math.min(

    currentPage,

    Math.max(totalPages, 1)

  );



  const paginatedProducts = useMemo(() => {

    const start =

      (safeCurrentPage - 1) * ITEMS_PER_PAGE;



    return sortedProducts.slice(

      start,

      start + ITEMS_PER_PAGE

    );

  }, [sortedProducts, safeCurrentPage]);



  const firstResult =

    sortedProducts.length === 0

      ? 0

      : (safeCurrentPage - 1) * ITEMS_PER_PAGE + 1;



  const lastResult = Math.min(

    safeCurrentPage * ITEMS_PER_PAGE,

    sortedProducts.length

  );



  // Reset pagination when filtering changes.



  useEffect(() => {

    setCurrentPage(1);

  }, [

    selectedCategory,

    selectedBrand,

    selectRating,

    order,

    availabilityFilter,

    searchQuery,

  ]);



  // ----------------------------------------------------------

  // FILTER ACTIONS

  // ----------------------------------------------------------



  const clearAllFilters = () => {

    setSelectedCategory([]);

    setSelectedBrand([]);

    setSelectRating(0);

    setAvailabilityFilter([]);

    setOrder("");

    setSearchQuery("");

    setCurrentPage(1);

  };



  const removeCategory = (category: string) => {

    setSelectedCategory((current) =>

      current.filter((item) => item !== category)

    );

  };



  const removeBrand = (brand: string) => {

    setSelectedBrand((current) =>

      current.filter((item) => item !== brand)

    );

  };



  const removeAvailability = (availability: string) => {

    setAvailabilityFilter((current) =>

      current.filter((item) => item !== availability)

    );

  };



  // ----------------------------------------------------------

  // PAGINATION ACTION

  // ----------------------------------------------------------



  const handlePageChange = (page: number) => {

    setCurrentPage(page);



    shopRef.current?.scrollIntoView({

      behavior: reduceMotion ? "auto" : "smooth",

      block: "start",

    });

  };



  // ----------------------------------------------------------

  // MOBILE FILTERS

  // ----------------------------------------------------------



  useEffect(() => {

    if (!mobileFiltersOpen) return;



    const previousOverflow =

      document.body.style.overflow;



    document.body.style.overflow = "hidden";



    const handleEscape = (event: KeyboardEvent) => {

      if (event.key === "Escape") {

        setMobileFiltersOpen(false);

      }

    };



    document.addEventListener(

      "keydown",

      handleEscape

    );



    return () => {

      document.body.style.overflow =

        previousOverflow;



      document.removeEventListener(

        "keydown",

        handleEscape

      );

    };

  }, [mobileFiltersOpen]);



  // ----------------------------------------------------------

  // MODAL ACTIONS

  // ----------------------------------------------------------



  const openModal = (product: Product) => {

    setSelectedProduct(product);

  };



  const closeModal = () => {

    setSelectedProduct(null);

  };



  // ============================================================

  // RENDER

  // ============================================================



  return (

    <main

      id="shop"

      className="

        min-h-screen

        w-full

        min-w-0

        overflow-x-clip

        bg-[#F8F5EF]

        font-raleway

        text-[#29211C]

      "

    >

      {/* ================================================== */}

      {/* SHOP HERO */}

      {/* ================================================== */}



      <section

        className="

          relative

          isolate

          overflow-hidden

          bg-[#29211C]

          text-[#F8F4EC]

        "

      >

        {/* BACKGROUND DETAILS */}



        <div

          aria-hidden="true"

          className="

            pointer-events-none

            absolute

            -right-20

            -top-20

            select-none

            font-serif

            text-[300px]

            leading-none

            text-white/[0.025]

            sm:text-[480px]

          "

        >

          D

        </div>



        <div

          aria-hidden="true"

          className="

            pointer-events-none

            absolute

            -bottom-40

            -left-40

            h-[350px]

            w-[350px]

            rounded-full

            bg-[#A67C52]/10

            blur-[110px]

          "

        />



        <div

          className="

            relative

            z-10

            mx-auto

            w-full

            max-w-[1500px]

            px-4

            pb-14

            pt-28

            sm:px-6

            sm:pb-16

            sm:pt-32

            lg:px-12

            lg:pb-20

            lg:pt-36

            xl:px-16

          "

        >

          {/* EYEBROW */}



          <motion.div

            initial={

              reduceMotion

                ? false

                : {

                    opacity: 0,

                    y: 15,

                  }

            }

            animate={{

              opacity: 1,

              y: 0,

            }}

            transition={{

              duration: 0.6,

            }}

            className="

              mb-7

              flex

              items-center

              gap-4

            "

          >

            <span

              className="

                h-px

                w-9

                bg-[#C4A27E]

              "

            />



            <span

              className="

                text-[10px]

                font-bold

                uppercase

                tracking-[0.23em]

                text-[#C4A27E]

                sm:text-xs

              "

            >

              DHMS International / The Collection

            </span>

          </motion.div>



          {/* MAIN HERO CONTENT */}



          <div

            className="

              grid

              gap-8

              lg:grid-cols-[1.15fr_0.85fr]

              lg:items-end

              lg:gap-16

            "

          >

            {/* MAIN HEADLINE */}



            <motion.div

              initial={

                reduceMotion

                  ? false

                  : {

                    opacity: 0,

                    y: 25,

                  }

              }

              animate={{

                opacity: 1,

                y: 0,

              }}

              transition={{

                duration: 0.7,

                delay: 0.1,

              }}

            >

              <h1

                className="

                  max-w-[850px]

                  font-semibold

                  text-[clamp(3rem,7vw,7rem)]

                  leading-[1.03]

                  tracking-[-0.065em]

                  text-[#F8F4EC]

                "

              >

                Find something

                <br />



                <span

                  className="

                    mt-1

                    block

                    font-serif

                    font-normal

                    italic

                    text-[#D7B791]

                  "

                >

                  that feels like you.

                </span>

              </h1>

            </motion.div>



            {/* DESCRIPTION */}



            <motion.div

              initial={

                reduceMotion

                  ? false

                  : {

                    opacity: 0,

                    y: 20,

                  }

              }

              animate={{

                opacity: 1,

                y: 0,

              }}

              transition={{

                duration: 0.7,

                delay: 0.2,

              }}

              className="

                max-w-md

                lg:pb-3

              "

            >

              <p

                className="

                  font-play

                  text-sm

                  leading-7

                  text-[#CFC1B4]

                  sm:text-base

                  sm:leading-8

                "

              >

                Discover our collection of

                African-inspired fashion,

                beauty essentials, and

                everyday self-care.



                Thoughtfully selected pieces

                that celebrate individuality,

                heritage, and personal style.

              </p>



              <div

                className="

                  mt-7

                  flex

                  items-center

                  gap-3

                  text-[10px]

                  font-semibold

                  uppercase

                  tracking-[0.16em]

                  text-[#C4A27E]

                "

              >

                <Sparkles size={15} />



                Explore your next favorite find

              </div>

            </motion.div>

          </div>



          {/* BOTTOM HERO STRIP */}



          <div

            className="

              mt-12

              flex

              flex-wrap

              items-center

              justify-between

              gap-4

              border-t

              border-white/15

              pt-5

              sm:mt-16

            "

          >

            <div

              className="

                flex

                items-center

                gap-3

              "

            >

              <ShoppingBag

                size={17}

                strokeWidth={1.6}

                className="text-[#C4A27E]"

              />



              <span

                className="

                  text-[10px]

                  font-semibold

                  uppercase

                  tracking-[0.16em]

                  text-[#D0C2B4]

                "

              >

                The DHMS Collection

              </span>

            </div>



            <a

              href="#collection"

              className="

                inline-flex

                min-h-10

                items-center

                gap-2

                text-[10px]

                font-semibold

                uppercase

                tracking-[0.13em]

                text-[#C4A27E]

                transition-colors

                hover:text-white

              "

            >

              Browse the collection



              <ArrowRight size={15} />

            </a>

          </div>

        </div>

      </section>



      {/* ================================================== */}

      {/* COLLECTION CONTENT */}

      {/* ================================================== */}



      <section

        id="collection"

        ref={shopRef}

        className="

          mx-auto

          w-full

          min-w-0

          max-w-[1500px]

          scroll-mt-24

          px-4

          pb-20

          pt-12

          sm:px-6

          sm:pt-16

          lg:px-12

          lg:pb-28

          lg:pt-20

          xl:px-16

        "

      >

        {/* ------------------------------------------------ */}

        {/* COLLECTION HEADER */}

        {/* ------------------------------------------------ */}



        <div

          className="

            mb-8

            flex

            flex-col

            gap-5

            border-b

            border-[#DFD5C8]

            pb-8

            sm:mb-10

            lg:flex-row

            lg:items-end

            lg:justify-between

          "

        >

          <div>

            <p

              className="

                mb-4

                text-[10px]

                font-bold

                uppercase

                tracking-[0.2em]

                text-[#A67C52]

              "

            >

              Discover / Shop All

            </p>



            <h2

              className="

                font-serif

                text-[clamp(2.2rem,4vw,3.6rem)]

                font-normal

                leading-tight

                tracking-[-0.045em]

                text-[#29211C]

              "

            >

              Explore the collection

            </h2>



            <p

              className="

                mt-3

                font-play

                text-sm

                leading-7

                text-[#85786A]

              "

            >

              Beauty, culture, and personal

              style, all in one place.

            </p>

          </div>



          {/* PRODUCT COUNT */}



          <div

            className="

              flex

              items-center

              gap-3

              pb-1

            "

          >

            <span

              className="

                h-1.5

                w-1.5

                rounded-full

                bg-[#A67C52]

              "

            />



            <p

              className="

                text-xs

                font-medium

                text-[#85786A]

              "

              aria-live="polite"

            >

              {loading

                ? "Loading collection..."

                : `${filteredProducts.length} ${

                    filteredProducts.length === 1

                      ? "product"

                      : "products"

                  } available`}

            </p>

          </div>

        </div>



        {/* ------------------------------------------------ */}

        {/* SEARCH + FILTER TOOLBAR */}

        {/* ------------------------------------------------ */}



        <div

          className="

            mb-6

            flex

            flex-col

            gap-3

            sm:flex-row

            sm:items-center

            sm:gap-4

          "

        >

          {/* SEARCH */}



          <div

            className="

              relative

              min-w-0

              flex-1

            "

          >

            <Search

              size={19}

              strokeWidth={1.7}

              className="

                pointer-events-none

                absolute

                left-4

                top-1/2

                -translate-y-1/2

                text-[#A67C52]

              "

            />



            <input

              type="search"

              value={searchQuery}

              onChange={(event) =>

                setSearchQuery(event.target.value)

              }

              placeholder="Search our collection..."

              aria-label="Search products"

              className="

                h-[54px]

                w-full

                min-w-0

                rounded-none

                border

                border-[#DFD5C8]

                bg-white

                pl-12

                pr-11

                font-play

                text-sm

                text-[#29211C]

                outline-none

                transition-all

                duration-300

                placeholder:text-[#A89B8D]

                focus:border-[#A67C52]

                focus:ring-2

                focus:ring-[#A67C52]/10

              "

            />



            {searchQuery && (

              <button

                type="button"

                onClick={() =>

                  setSearchQuery("")

                }

                aria-label="Clear search"

                className="

                  absolute

                  right-3

                  top-1/2

                  flex

                  h-8

                  w-8

                  -translate-y-1/2

                  items-center

                  justify-center

                  text-[#8D8175]

                  transition-colors

                  hover:text-[#29211C]

                "

              >

                <X size={17} />

              </button>

            )}

          </div>



          {/* MOBILE FILTER BUTTON */}



          <button

            type="button"

            onClick={() =>

              setMobileFiltersOpen(true)

            }

            className="

              flex

              min-h-[54px]

              w-full

              items-center

              justify-between

              gap-3

              border

              border-[#29211C]

              bg-[#29211C]

              px-5

              text-xs

              font-semibold

              uppercase

              tracking-[0.12em]

              text-white

              transition-colors

              hover:bg-[#49392B]

              md:hidden

              sm:w-auto

              sm:min-w-[155px]

            "

          >

            <span

              className="

                flex

                items-center

                gap-3

              "

            >

              <SlidersHorizontal size={17} />



              Filters

            </span>



            {activeFilterCount > 0 && (

              <span

                className="

                  flex

                  h-6

                  w-6

                  items-center

                  justify-center

                  rounded-full

                  bg-[#D7B791]

                  text-[10px]

                  font-bold

                  text-[#29211C]

                "

              >

                {activeFilterCount}

              </span>

            )}

          </button>



          {/* DESKTOP FILTER TOGGLE */}



          <button

            type="button"

            onClick={() =>

              setShowFilters((current) => !current)

            }

            aria-expanded={showFilters}

            className="

              hidden

              min-h-[54px]

              items-center

              justify-between

              gap-4

              border

              border-[#DFD5C8]

              bg-white

              px-5

              text-xs

              font-semibold

              uppercase

              tracking-[0.1em]

              text-[#49392B]

              transition-all

              hover:border-[#A67C52]

              md:inline-flex

            "

          >

            <SlidersHorizontal size={17} />



            {showFilters

              ? "Hide filters"

              : "Show filters"}



            <ChevronDown

              size={16}

              className={`

                transition-transform

                duration-300

                ${showFilters ? "rotate-180" : ""}

              `}

            />

          </button>

        </div>



        {/* ------------------------------------------------ */}

        {/* DESKTOP FILTERS */}

        {/* ------------------------------------------------ */}



        <AnimatePresence initial={false}>

          {showFilters && (

            <motion.div

              key="desktop-filters"

              initial={{

                opacity: 0,

                height: 0,

              }}

              animate={{

                opacity: 1,

                height: "auto",

              }}

              exit={{

                opacity: 0,

                height: 0,

              }}

              transition={{

                duration: reduceMotion

                  ? 0

                  : 0.3,

              }}

              className="

                mb-6

                hidden

                overflow-hidden

                md:block

              "

            >

              <div

                className="

                  border

                  border-[#E5DBCF]

                  bg-white

                  p-4

                  sm:p-5

                  lg:p-6

                "

              >

                <ProductFilters

                  selectedCategory={selectedCategory}

                  setSelectedCategory={setSelectedCategory}

                  selectedBrand={selectedBrand}

                  setSelectedBrand={setSelectedBrand}

                  selectRating={selectRating}

                  setSelectRating={setSelectRating}

                  order={order}

                  setOrder={setOrder}

                  availableBrands={availableBrands}

                  availabilityFilter={availabilityFilter}

                  setAvailabilityFilter={setAvailabilityFilter}

                />

              </div>

            </motion.div>

          )}

        </AnimatePresence>



        {/* ------------------------------------------------ */}

        {/* ACTIVE FILTER CHIPS */}

        {/* ------------------------------------------------ */}



        {hasFilters && (

          <div

            className="

              mb-8

              flex

              flex-wrap

              items-center

              gap-2

            "

          >

            <span

              className="

                mr-2

                text-[10px]

                font-semibold

                uppercase

                tracking-[0.12em]

                text-[#9B8B7B]

              "

            >

              Active filters

            </span>



            {/* SEARCH CHIP */}



            {searchQuery.trim() && (

              <button

                type="button"

                onClick={() =>

                  setSearchQuery("")

                }

                className="

                  inline-flex

                  min-h-9

                  items-center

                  gap-2

                  border

                  border-[#D9C9B5]

                  bg-[#F0E7DC]

                  px-3

                  text-xs

                  text-[#6E543B]

                  transition-colors

                  hover:bg-[#E8D8C5]

                "

              >

                Search: {searchQuery}



                <X size={13} />

              </button>

            )}



            {/* CATEGORY CHIPS */}



            {selectedCategory.map((category) => (

              <button

                key={`category-${category}`}

                type="button"

                onClick={() =>

                  removeCategory(category)

                }

                className="

                  inline-flex

                  min-h-9

                  items-center

                  gap-2

                  border

                  border-[#D9C9B5]

                  bg-[#F0E7DC]

                  px-3

                  text-xs

                  text-[#6E543B]

                  transition-colors

                  hover:bg-[#E8D8C5]

                "

              >

                {category}



                <X size={13} />

              </button>

            ))}



            {/* BRAND CHIPS */}



            {selectedBrand.map((brand) => (

              <button

                key={`brand-${brand}`}

                type="button"

                onClick={() =>

                  removeBrand(brand)

                }

                className="

                  inline-flex

                  min-h-9

                  items-center

                  gap-2

                  border

                  border-[#D9C9B5]

                  bg-[#F0E7DC]

                  px-3

                  text-xs

                  text-[#6E543B]

                  transition-colors

                  hover:bg-[#E8D8C5]

                "

              >

                {brand}



                <X size={13} />

              </button>

            ))}



            {/* RATING CHIP */}



            {selectRating > 0 && (

              <button

                type="button"

                onClick={() =>

                  setSelectRating(0)

                }

                className="

                  inline-flex

                  min-h-9

                  items-center

                  gap-2

                  border

                  border-[#D9C9B5]

                  bg-[#F0E7DC]

                  px-3

                  text-xs

                  text-[#6E543B]

                  transition-colors

                  hover:bg-[#E8D8C5]

                "

              >

                {selectRating}+ rating



                <X size={13} />

              </button>

            )}



            {/* AVAILABILITY CHIPS */}



            {availabilityFilter.map(

              (availability) => (

                <button

                  key={`availability-${availability}`}

                  type="button"

                  onClick={() =>

                    removeAvailability(availability)

                  }

                  className="

                    inline-flex

                    min-h-9

                    items-center

                    gap-2

                    border

                    border-[#D9C9B5]

                    bg-[#F0E7DC]

                    px-3

                    text-xs

                    text-[#6E543B]

                    transition-colors

                    hover:bg-[#E8D8C5]

                  "

                >

                  {availability}



                  <X size={13} />

                </button>

              )

            )}



            {/* CLEAR ALL */}



            <button

              type="button"

              onClick={clearAllFilters}

              className="

                inline-flex

                min-h-9

                items-center

                gap-2

                px-3

                text-xs

                font-semibold

                text-[#A67C52]

                transition-colors

                hover:text-[#29211C]

              "

            >

              <RotateCcw size={13} />



              Clear all

            </button>

          </div>

        )}



        {/* ------------------------------------------------ */}

        {/* RESULTS HEADER */}

        {/* ------------------------------------------------ */}



        {!loading && !error && sortedProducts.length > 0 && (

          <div

            className="

              mb-7

              flex

              flex-wrap

              items-center

              justify-between

              gap-4

              border-b

              border-[#E7DED3]

              pb-5

            "

          >

            <p

              className="

                font-play

                text-xs

                text-[#8D8175]

                sm:text-sm

              "

            >

              Showing{" "}



              <span

                className="

                  font-semibold

                  text-[#49392B]

                "

              >

                {firstResult}–{lastResult}

              </span>



              {" "}of{" "}



              <span

                className="

                  font-semibold

                  text-[#49392B]

                "

              >

                {sortedProducts.length}

              </span>



              {" "}products

            </p>



            <p

              className="

                text-[10px]

                font-semibold

                uppercase

                tracking-[0.14em]

                text-[#A67C52]

              "

            >

              Curated with care

            </p>

          </div>

        )}



        {/* ------------------------------------------------ */}

        {/* LOADING STATE */}

        {/* ------------------------------------------------ */}



        {loading && (

          <div

            role="status"

            aria-live="polite"

            className="

              grid

              grid-cols-2

              gap-x-3

              gap-y-8

              sm:gap-x-5

              sm:gap-y-10

              lg:grid-cols-4

              xl:gap-x-7

            "

          >

            {Array.from({ length: 8 }).map(

              (_, index) => (

                <div

                  key={index}

                  className="animate-pulse"

                >

                  <div

                    className="

                      aspect-[4/5]

                      w-full

                      bg-[#E9E1D6]

                    "

                  />



                  <div

                    className="

                      mt-4

                      h-3

                      w-1/3

                      bg-[#E9E1D6]

                    "

                  />



                  <div

                    className="

                      mt-3

                      h-5

                      w-4/5

                      bg-[#E9E1D6]

                    "

                  />



                  <div

                    className="

                      mt-3

                      h-3

                      w-1/2

                      bg-[#E9E1D6]

                    "

                  />

                </div>

              )

            )}



            <span className="sr-only">

              Loading products

            </span>

          </div>

        )}



        {/* ------------------------------------------------ */}

        {/* ERROR STATE */}

        {/* ------------------------------------------------ */}



        {!loading && error && (

          <div

            role="alert"

            className="

              flex

              min-h-[320px]

              flex-col

              items-center

              justify-center

              border

              border-[#E6D8C8]

              bg-white

              px-6

              py-12

              text-center

            "

          >

            <AlertCircle

              size={35}

              strokeWidth={1.4}

              className="text-[#A67C52]"

            />



            <h3

              className="

                mt-6

                font-serif

                text-2xl

                text-[#29211C]

              "

            >

              We couldn't load the collection.

            </h3>



            <p

              className="

                mt-3

                max-w-md

                font-play

                text-sm

                leading-7

                text-[#85786A]

              "

            >

              Something interrupted our connection.

              Please try again in a moment.

            </p>



            <button

              type="button"

              onClick={() =>

                void loadProducts()

              }

              className="

                mt-7

                inline-flex

                min-h-12

                items-center

                justify-center

                gap-3

                bg-[#29211C]

                px-6

                text-xs

                font-semibold

                uppercase

                tracking-[0.1em]

                text-white

                transition-colors

                hover:bg-[#A67C52]

              "

            >

              <RotateCcw size={15} />



              Try again

            </button>

          </div>

        )}



        {/* ------------------------------------------------ */}

        {/* EMPTY COLLECTION STATE */}

        {/* ------------------------------------------------ */}



        {!loading &&

          !error &&

          sortedProducts.length === 0 && (

            <div

              className="

                flex

                min-h-[350px]

                flex-col

                items-center

                justify-center

                border

                border-[#E6D8C8]

                bg-white

                px-6

                py-14

                text-center

              "

            >

              <PackageSearch

                size={40}

                strokeWidth={1.2}

                className="text-[#A67C52]"

              />



              <h3

                className="

                  mt-6

                  font-serif

                  text-2xl

                  text-[#29211C]

                  sm:text-3xl

                "

              >

                {hasFilters

                  ? "Nothing quite matches."

                  : "Our collection is coming soon."}

              </h3>



              <p

                className="

                  mt-4

                  max-w-md

                  font-play

                  text-sm

                  leading-7

                  text-[#85786A]

                "

              >

                {hasFilters

                  ? "Try another search or remove a filter to discover more from our collection."

                  : "There are no products available in the catalog right now. Please check back soon."}

              </p>



              {hasFilters && (

                <button

                  type="button"

                  onClick={clearAllFilters}

                  className="

                    mt-7

                    inline-flex

                    min-h-12

                    items-center

                    gap-3

                    bg-[#29211C]

                    px-6

                    text-xs

                    font-semibold

                    uppercase

                    tracking-[0.1em]

                    text-white

                    transition-colors

                    hover:bg-[#A67C52]

                  "

                >

                  Explore all products



                  <ArrowUpRight size={16} />

                </button>

              )}

            </div>

          )}



        {/* ------------------------------------------------ */}

        {/* PRODUCT GRID */}

        {/* ------------------------------------------------ */}



        {!loading &&

          !error &&

          paginatedProducts.length > 0 && (

            <motion.div

              key={safeCurrentPage}

              initial={

                reduceMotion

                  ? false

                  : {

                      opacity: 0,

                      y: 15,

                    }

              }

              animate={{

                opacity: 1,

                y: 0,

              }}

              transition={{

                duration: reduceMotion

                  ? 0

                  : 0.4,

              }}

            >

              <ProductGrid

                products={paginatedProducts}

                onProductClick={openModal}

              />

            </motion.div>

          )}



        {/* ------------------------------------------------ */}

        {/* PAGINATION */}

        {/* ------------------------------------------------ */}



        {!loading &&

          !error &&

          totalPages > 1 && (

            <div

              className="

                mt-14

                flex

                justify-center

                border-t

                border-[#E7DED3]

                pt-10

                sm:mt-16

              "

            >

              <PaginationControls

                totalPages={totalPages}

                currentPage={safeCurrentPage}

                onPageChange={handlePageChange}

              />

            </div>

          )}

      </section>



      {/* ================================================== */}

      {/* MOBILE FILTER DRAWER */}

      {/* ================================================== */}



      <AnimatePresence>

        {mobileFiltersOpen && (

          <motion.div

            key="mobile-filter-overlay"

            initial={{ opacity: 0 }}

            animate={{ opacity: 1 }}

            exit={{ opacity: 0 }}

            transition={{

              duration: reduceMotion

                ? 0

                : 0.25,

            }}

            className="

              fixed

              inset-0

              z-[100]

              bg-[#1D1510]/65

              backdrop-blur-[3px]

              md:hidden

            "

            onClick={() =>

              setMobileFiltersOpen(false)

            }

          >

            <motion.div

              role="dialog"

              aria-modal="true"

              aria-label="Product filters"

              initial={

                reduceMotion

                  ? false

                  : { x: "100%" }

              }

              animate={{

                x: 0,

              }}

              exit={{

                x: "100%",

              }}

              transition={{

                duration: reduceMotion

                  ? 0

                  : 0.35,

                ease: "easeOut",

              }}

              onClick={(event) =>

                event.stopPropagation()

              }

              className="

                absolute

                inset-y-0

                right-0

                flex

                h-full

                w-full

                max-w-[390px]

                flex-col

                overflow-hidden

                bg-[#F8F5EF]

                shadow-2xl

              "

            >

              {/* DRAWER HEADER */}



              <div

                className="

                  flex

                  shrink-0

                  items-center

                  justify-between

                  gap-4

                  border-b

                  border-[#DFD5C8]

                  px-5

                  py-5

                "

              >

                <div>

                  <p

                    className="

                      text-[10px]

                      font-bold

                      uppercase

                      tracking-[0.18em]

                      text-[#A67C52]

                    "

                  >

                    Refine your collection

                  </p>



                  <h3

                    className="

                      mt-1

                      font-serif

                      text-2xl

                      text-[#29211C]

                    "

                  >

                    Filter products

                  </h3>

                </div>



                <button

                  type="button"

                  onClick={() =>

                    setMobileFiltersOpen(false)

                  }

                  aria-label="Close filters"

                  className="

                    flex

                    h-11

                    w-11

                    shrink-0

                    items-center

                    justify-center

                    border

                    border-[#DFD5C8]

                    text-[#49392B]

                    transition-colors

                    hover:bg-[#EDE5DA]

                  "

                >

                  <X size={20} />

                </button>

              </div>



              {/* DRAWER CONTENT */}



              <div

                className="

                  min-h-0

                  flex-1

                  overflow-y-auto

                  overscroll-contain

                  px-5

                  py-6

                "

              >

                <ProductFilters

                  selectedCategory={selectedCategory}

                  setSelectedCategory={setSelectedCategory}

                  selectedBrand={selectedBrand}

                  setSelectedBrand={setSelectedBrand}

                  selectRating={selectRating}

                  setSelectRating={setSelectRating}

                  order={order}

                  setOrder={setOrder}

                  availableBrands={availableBrands}

                  availabilityFilter={availabilityFilter}

                  setAvailabilityFilter={setAvailabilityFilter}

                />

              </div>



              {/* DRAWER FOOTER */}



              <div

                className="

                  shrink-0

                  border-t

                  border-[#DFD5C8]

                  bg-white

                  p-4

                "

              >

                <button

                  type="button"

                  onClick={() =>

                    setMobileFiltersOpen(false)

                  }

                  className="

                    flex

                    min-h-[52px]

                    w-full

                    items-center

                    justify-center

                    gap-3

                    bg-[#29211C]

                    px-5

                    text-xs

                    font-semibold

                    uppercase

                    tracking-[0.12em]

                    text-white

                    transition-colors

                    hover:bg-[#49392B]

                  "

                >

                  View {filteredProducts.length} products



                  <ArrowRight size={16} />

                </button>



                {hasFilters && (

                  <button

                    type="button"

                    onClick={clearAllFilters}

                    className="

                      mt-3

                      flex

                      min-h-11

                      w-full

                      items-center

                      justify-center

                      gap-2

                      text-xs

                      font-semibold

                      text-[#8D623B]

                    "

                  >

                    <RotateCcw size={14} />



                    Clear all filters

                  </button>

                )}

              </div>

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>



      {/* ================================================== */}

      {/* EXISTING PRODUCT MODAL */}

      {/* ================================================== */}



      {selectedProduct && (

        <ProductModal

          product={selectedProduct}

          onClose={closeModal}

          onAddToCart={addToCart}

          username={username ?? undefined}

        />

      )}

    </main>

  );

};



export default ProductContent;