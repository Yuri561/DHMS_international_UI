
import React from "react";

import {
  motion,
  useReducedMotion,
} from "framer-motion";

import {
  ArrowUpRight,
  Eye,
  Star,
} from "lucide-react";

// ============================================================
// DHMS INTERNATIONAL
// PRODUCT GRID — EDITORIAL COLLECTION
// ============================================================

interface Product {
  id: string | number;
  _id?: string;

  name: string;
  price?: number;
  imageUrl: string;
  category: string;
  rating: number;

  brand?: string | { name?: string };
  inStore?: boolean;

  colors?: string[];
  description?: string;
  size?: string[];
}

interface ProductGridProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

// ============================================================
// HELPERS
// ============================================================

const formatPrice = (price?: number) => {
  if (
    typeof price !== "number" ||
    !Number.isFinite(price)
  ) {
    return "Price unavailable";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

const getBrandName = (brand: Product["brand"]) => {
  if (typeof brand === "string") {
    return brand;
  }

  return brand?.name || "";
};

// ============================================================
// PRODUCT CARD
// ============================================================

interface ProductCardProps {
  product: Product;
  index: number;
  onProductClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  index,
  onProductClick,
}) => {
  const reduceMotion = useReducedMotion();

  const brandName = getBrandName(product.brand);

  const hasRating =
    typeof product.rating === "number" &&
    Number.isFinite(product.rating) &&
    product.rating > 0;

  const rating = hasRating
    ? Math.min(5, Math.max(0, product.rating))
    : 0;

  const hasColors =
    Array.isArray(product.colors) &&
    product.colors.length > 0;

  const openProduct = () => {
    onProductClick(product);
  };

  return (
    <motion.article
      initial={
        reduceMotion
          ? false
          : {
              opacity: 0,
              y: 22,
            }
      }
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.1,
      }}
      transition={{
        duration: reduceMotion ? 0 : 0.5,
        delay: reduceMotion
          ? 0
          : (index % 4) * 0.055,
      }}
      className="
        group
        relative
        flex
        h-full
        min-w-0
        flex-col
      "
    >
      {/* ================================================== */}
      {/* PRODUCT IMAGE                                     */}
      {/* ================================================== */}

      <div
        className="
          relative
          aspect-[3/4]
          w-full
          min-w-0
          overflow-hidden
          bg-[#ECE5DB]
          sm:aspect-[4/5]
        "
      >
        <button
          type="button"
          onClick={openProduct}
          aria-label={`View details for ${product.name}`}
          className="
            absolute
            inset-0
            block
            h-full
            w-full
            cursor-pointer
            overflow-hidden
            focus-visible:outline
            focus-visible:outline-2
            focus-visible:outline-offset-[-3px]
            focus-visible:outline-[#A67C52]
          "
        >
          {/* PRODUCT PHOTO */}

          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="
              h-full
              w-full
              object-contain
              object-center
              transition-transform
              duration-700
              ease-out
              group-hover:scale-[1.055]
              group-focus-within:scale-[1.055]
            "
          />

          {/* GRADIENT ON HOVER */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-0
              bg-gradient-to-t
              from-[#201712]/25
              via-transparent
              to-transparent
              opacity-0
              transition-opacity
              duration-500
              group-hover:opacity-100
            "
          />

          {/* HOVER ACTION */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              bottom-4
              left-4
              right-4
              hidden
              translate-y-3
              items-center
              justify-between
              gap-3
              bg-[#F8F5EF]
              px-4
              py-3.5
              opacity-0
              transition-all
              duration-300
              group-hover:translate-y-0
              group-hover:opacity-100
              lg:flex
            "
          >
            <span
              className="
                flex
                items-center
                gap-2
                font-raleway
                text-[10px]
                font-bold
                uppercase
                tracking-[0.12em]
                text-[#29211C]
              "
            >
              <Eye size={16} strokeWidth={1.6} />

              Quick View
            </span>

            <ArrowUpRight
              size={17}
              className="text-[#A67C52]"
            />
          </div>
        </button>

        {/* IN-STORE LABEL */}

        {product.inStore && (
          <div
            className="
              pointer-events-none
              absolute
              left-2
              top-2
              z-10
              bg-[#F8F5EF]/95
              px-2.5
              py-2
              shadow-sm
              sm:left-3
              sm:top-3
              sm:px-3
            "
          >
            <span
              className="
                font-raleway
                text-[8px]
                font-bold
                uppercase
                tracking-[0.12em]
                text-[#795632]
                sm:text-[9px]
              "
            >
              In Store
            </span>
          </div>
        )}

        {/* PRODUCT INDEX */}

        <div
          className="
            pointer-events-none
            absolute
            right-3
            top-3
            hidden
            font-raleway
            text-[10px]
            font-medium
            tracking-[0.1em]
            text-[#6E6257]/70
            sm:block
          "
        >
          {String(index + 1).padStart(2, "0")}
        </div>
      </div>

      {/* ================================================== */}
      {/* PRODUCT INFORMATION                               */}
      {/* ================================================== */}

      <div
        className="
          flex
          min-w-0
          flex-1
          flex-col
          pb-5
          pt-4
          sm:pt-5
        "
      >
        {/* CATEGORY + BRAND */}

        <div
          className="
            mb-2
            flex
            flex-wrap
            items-center
            gap-x-2
            gap-y-1
          "
        >
          <span
            className="
              font-raleway
              text-[9px]
              font-bold
              uppercase
              tracking-[0.14em]
              text-[#A67C52]
              sm:text-[10px]
            "
          >
            {product.category}
          </span>

          {brandName && (
            <>
              <span
                className="
                  text-[9px]
                  text-[#C7B9AA]
                "
              >
                /
              </span>

              <span
                className="
                  font-raleway
                  text-[9px]
                  uppercase
                  tracking-[0.08em]
                  text-[#918477]
                  sm:text-[10px]
                "
              >
                {brandName}
              </span>
            </>
          )}
        </div>

        {/* PRODUCT NAME */}

        <button
          type="button"
          onClick={openProduct}
          className="
            cursor-pointer
            text-left
            font-raleway
            text-sm
            font-semibold
            leading-5
            text-[#29211C]
            transition-colors
            duration-300
            hover:text-[#A67C52]
            focus-visible:underline
            sm:text-base
            sm:leading-6
            lg:text-lg
          "
        >
          {product.name}
        </button>

        {/* PRICE */}

        <p
          className="
            mt-3
            font-raleway
            text-sm
            font-semibold
            tracking-[-0.02em]
            text-[#8D623B]
            sm:text-base
          "
        >
          {formatPrice(product.price)}
        </p>

        {/* RATING */}

        {hasRating && (
          <div
            className="
              mt-3
              flex
              items-center
              gap-1.5
            "
            aria-label={`Rated ${rating.toFixed(1)} out of 5`}
          >
            <Star
              size={13}
              fill="#B58B56"
              strokeWidth={1.5}
              className="text-[#B58B56]"
              aria-hidden="true"
            />

            <span
              className="
                font-raleway
                text-[11px]
                font-semibold
                text-[#6E6257]
              "
            >
              {rating.toFixed(1)}
            </span>

            <span
              className="
                text-[10px]
                text-[#9F9488]
              "
            >
              / 5
            </span>
          </div>
        )}

        {/* COLOR OPTIONS */}

        {hasColors && (
          <div
            className="
              mt-4
              flex
              flex-wrap
              items-center
              gap-1.5
            "
            aria-label="Available colors"
          >
            {product.colors!.slice(0, 5).map(
              (color, colorIndex) => (
                <span
                  key={`${product.id}-${color}-${colorIndex}`}
                  title={color}
                  className="
                    flex
                    h-4
                    w-4
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#D3C7B9]
                    bg-white
                    p-[2px]
                  "
                >
                  <span
                    className="
                      h-full
                      w-full
                      rounded-full
                    "
                    style={{
                      backgroundColor: color,
                    }}
                  />
                </span>
              )
            )}

            {product.colors!.length > 5 && (
              <span
                className="
                  ml-1
                  font-raleway
                  text-[10px]
                  text-[#918477]
                "
              >
                +{product.colors!.length - 5}
              </span>
            )}
          </div>
        )}

        {/* BOTTOM ACTION */}

        <div
          className="
            mt-auto
            pt-5
          "
        >
          <button
            type="button"
            onClick={openProduct}
            className="
              group/action
              flex
              min-h-11
              w-full
              cursor-pointer
              items-center
              justify-between
              gap-2
              border-t
              border-[#DED5CA]
              pt-3
              text-left
              transition-colors
              duration-300
              hover:border-[#A67C52]
              focus-visible:outline
              focus-visible:outline-2
              focus-visible:outline-offset-2
              focus-visible:outline-[#A67C52]
            "
          >
            <span
              className="
                font-raleway
                text-[10px]
                font-bold
                uppercase
                tracking-[0.12em]
                text-[#75685B]
                transition-colors
                duration-300
                group-hover/action:text-[#A67C52]
                sm:text-[11px]
              "
            >
              View Details
            </span>

            <ArrowUpRight
              size={16}
              className="
                shrink-0
                text-[#A67C52]
                transition-transform
                duration-300
                group-hover/action:-translate-y-0.5
                group-hover/action:translate-x-0.5
              "
            />
          </button>
        </div>
      </div>
    </motion.article>
  );
};

// ============================================================
// PRODUCT GRID
// ============================================================

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onProductClick,
}) => {
  if (!products.length) {
    return null;
  }

  return (
    <div
      className="
        grid
        w-full
        min-w-0
        grid-cols-2
        items-stretch
        gap-x-3
        gap-y-7
        sm:gap-x-5
        sm:gap-y-10
        lg:grid-cols-3
        lg:gap-x-6
        xl:grid-cols-4
        xl:gap-x-7
      "
    >
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          index={index}
          onProductClick={onProductClick}
        />
      ))}
    </div>
  );
};

export default ProductGrid;