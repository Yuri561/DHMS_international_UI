
import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import { Dialog } from "@headlessui/react";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";

import { toast } from "react-hot-toast";

import { useNavigate } from "react-router-dom";

import {
  ArrowRight,
  Check,
  ChevronRight,
  ShoppingBag,
  X,
  Star,
} from "lucide-react";

// ============================================================
// DHMS INTERNATIONAL
// PRODUCT MODAL — PRODUCT DETAIL EXPERIENCE
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

interface ProductModalProps {
  onClose: () => void;

  product: Product;

  onAddToCart: (
    item: any
  ) => void | Promise<void>;

  username?: string;
}

// ============================================================
// HELPERS
// ============================================================

const formatPrice = (price: number) => {
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
// COMPONENT
// ============================================================

const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  const navigate = useNavigate();

  const reduceMotion = useReducedMotion();

  // ----------------------------------------------------------
  // STATE
  // ----------------------------------------------------------

  const [selectedColor, setSelectedColor] =
    useState("");

  const [selectedSize, setSelectedSize] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const submittingRef = useRef(false);

  // ----------------------------------------------------------
  // PRODUCT DATA
  // ----------------------------------------------------------

  const brandName = getBrandName(product.brand);

  const price =
    typeof product.price === "number" &&
    Number.isFinite(product.price)
      ? product.price
      : null;

  const canPurchase =
    price !== null && price > 0;

  const availableColors =
    product.colors || [];

  const availableSizes =
    product.size || [];

  const hasColors =
    availableColors.length > 0;

  const hasSizes =
    availableSizes.length > 0;

  const hasRating =
    typeof product.rating === "number" &&
    Number.isFinite(product.rating) &&
    product.rating > 0;

  const rating = hasRating
    ? Math.max(0, Math.min(5, product.rating))
    : 0;

  // ----------------------------------------------------------
  // RESET SELECTION WHEN PRODUCT CHANGES
  // ----------------------------------------------------------

  useEffect(() => {
    setSelectedColor(
      product.colors?.[0] || ""
    );

    setSelectedSize("");

    setLoading(false);

    submittingRef.current = false;
  }, [product.id]);

  // ----------------------------------------------------------
  // ADD TO CART
  // ----------------------------------------------------------

  const handleAddToCart = async () => {
    if (loading || submittingRef.current) {
      return;
    }

    if (
      hasColors &&
      !selectedColor
    ) {
      toast.error("Please select a color.");

      return;
    }

    if (
      hasSizes &&
      !selectedSize
    ) {
      toast.error("Please select a size.");

      return;
    }

    if (!canPurchase || price === null) {
      toast.error(
        "This product is not available for purchase yet."
      );

      return;
    }

    submittingRef.current = true;

    setLoading(true);

    const toastId = toast.loading(
      "Adding to your bag..."
    );

    try {
      // Preserve the existing cart item structure
      // used by your CartContext.

      await Promise.resolve(
        onAddToCart({
          id: product.id,

          _id: product._id,

          name: product.name,

          price,

          brand: brandName,

          imageUrl: product.imageUrl,

          category: product.category,

          rating: product.rating,

          color: selectedColor,

          size: selectedSize.toLowerCase(),

          quantity: 1,

          totalPrice: price,
        })
      );

      toast.success(
        "Added to your bag!",
        { id: toastId }
      );

      onClose();

      navigate("/cart");
    } catch (error) {
      console.error(
        "DHMS add-to-cart error:",
        error
      );

      toast.error(
        "We couldn't add this item. Please try again.",
        { id: toastId }
      );
    } finally {
      submittingRef.current = false;

      setLoading(false);
    }
  };

  // ----------------------------------------------------------
  // PRICE LABEL
  // ----------------------------------------------------------

  const priceLabel =
    price !== null
      ? formatPrice(price)
      : "Price unavailable";

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <Dialog
      open={true}
      onClose={loading ? () => {} : onClose}
      className="
        fixed
        inset-0
        z-[100]
      "
    >
      {/* ================================================== */}
      {/* BACKDROP                                          */}
      {/* ================================================== */}

      <div
        aria-hidden="true"
        className="
          fixed
          inset-0
          bg-[#130C09]/75
          backdrop-blur-[6px]
        "
      />

      {/* ================================================== */}
      {/* MODAL VIEWPORT                                    */}
      {/* ================================================== */}

      <div
        className="
          fixed
          inset-0
          flex
          items-center
          justify-center
          overflow-y-auto
          overscroll-contain
          p-2
          sm:p-4
          lg:p-6
        "
      >
        <Dialog.Panel
          as={motion.div}
          initial={
            reduceMotion
              ? false
              : {
                  opacity: 0,
                  y: 25,
                  scale: 0.985,
                }
          }
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{
            duration: reduceMotion
              ? 0
              : 0.35,
            ease: "easeOut",
          }}
          className="
            relative
            my-auto
            max-h-[calc(100dvh-1rem)]
            w-full
            max-w-[1150px]
            min-w-0
            overflow-y-auto
            overscroll-contain
            bg-[#F8F5EF]
            text-[#29211C]
            shadow-[0_30px_100px_rgba(0,0,0,0.35)]
            sm:max-h-[calc(100dvh-2rem)]
            lg:max-h-[calc(100dvh-3rem)]
          "
        >
          {/* ================================================== */}
          {/* CLOSE BUTTON                                     */}
          {/* ================================================== */}

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Close product details"
            className="
              absolute
              right-3
              top-3
              z-30
              flex
              h-11
              w-11
              cursor-pointer
              items-center
              justify-center
              rounded-full
              border
              border-[#E5DACD]
              bg-[#F8F5EF]/95
              text-[#29211C]
              shadow-sm
              backdrop-blur-md
              transition-all
              duration-300
              hover:bg-[#29211C]
              hover:text-white
              disabled:cursor-not-allowed
              disabled:opacity-50
              sm:right-5
              sm:top-5
            "
          >
            <X size={19} strokeWidth={1.7} />
          </button>

          {/* ================================================== */}
          {/* PRODUCT LAYOUT                                   */}
          {/* ================================================== */}

          <div
            className="
              grid
              min-w-0
              grid-cols-1
              lg:grid-cols-[0.95fr_1.05fr]
            "
          >
            {/* ================================================== */}
            {/* PRODUCT IMAGE                                     */}
            {/* ================================================== */}

            <div
              className="
                relative
                flex
                min-w-0
                items-center
                justify-center
                overflow-hidden
                bg-[#EDE5DA]
                p-4
                sm:p-8
                lg:min-h-[600px]
                lg:p-10
              "
            >
              {/* SUBTLE CORNER DETAILS */}

              <div
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute
                  left-5
                  top-5
                  hidden
                  h-8
                  w-8
                  border-l
                  border-t
                  border-[#BDA588]
                  lg:block
                "
              />

              <div
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute
                  bottom-5
                  right-5
                  hidden
                  h-8
                  w-8
                  border-b
                  border-r
                  border-[#BDA588]
                  lg:block
                "
              />

              {/* IMAGE */}

              <div
                className="
                  flex
                  h-[235px]
                  w-full
                  items-center
                  justify-center
                  overflow-hidden
                  sm:h-[340px]
                  md:h-[430px]
                  lg:h-full
                  lg:max-h-[650px]
                "
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="
                    h-full
                    w-full
                    object-contain
                    object-center
                  "
                />
              </div>

              {/* PRODUCT CATEGORY LABEL */}

              <div
                className="
                  absolute
                  bottom-4
                  left-4
                  hidden
                  items-center
                  gap-2
                  sm:bottom-6
                  sm:left-8
                  lg:flex
                "
              >
                <span
                  className="
                    h-px
                    w-7
                    bg-[#A67C52]
                  "
                />

                <span
                  className="
                    font-raleway
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.15em]
                    text-[#8D623B]
                  "
                >
                  DHMS / The Collection
                </span>
              </div>
            </div>

            {/* ================================================== */}
            {/* PRODUCT DETAILS                                   */}
            {/* ================================================== */}

            <div
              className="
                flex
                min-w-0
                flex-col
                px-5
                pb-7
                pt-7
                sm:px-9
                sm:pb-10
                sm:pt-10
                lg:px-12
                lg:pb-12
                lg:pt-16
                xl:px-14
              "
            >
              {/* ---------------------------------------------- */}
              {/* BREADCRUMB / CATEGORY                          */}
              {/* ---------------------------------------------- */}

              <div
                className="
                  mb-6
                  flex
                  flex-wrap
                  items-center
                  gap-2
                  pr-10
                  font-raleway
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.12em]
                  text-[#A67C52]
                "
              >
                <span>DHMS</span>

                <ChevronRight
                  size={13}
                  className="text-[#B9AA9A]"
                />

                <span>{product.category}</span>
              </div>

              {/* ---------------------------------------------- */}
              {/* PRODUCT NAME + PRICE                           */}
              {/* ---------------------------------------------- */}

              <div>
                {brandName && (
                  <p
                    className="
                      mb-3
                      font-raleway
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[0.18em]
                      text-[#9B724B]
                    "
                  >
                    {brandName}
                  </p>
                )}

                <Dialog.Title
                  className="
                    max-w-[500px]
                    font-serif
                    text-[clamp(2rem,4vw,3.5rem)]
                    font-normal
                    leading-[1.12]
                    tracking-[-0.045em]
                    text-[#29211C]
                  "
                >
                  {product.name}
                </Dialog.Title>

                {/* RATING */}

                {hasRating && (
                  <div
                    className="
                      mt-4
                      flex
                      items-center
                      gap-2
                    "
                    aria-label={`Rated ${rating.toFixed(1)} out of 5`}
                  >
                    <Star
                      size={15}
                      fill="#B58B56"
                      strokeWidth={1.5}
                      className="text-[#B58B56]"
                      aria-hidden="true"
                    />

                    <span
                      className="
                        font-raleway
                        text-xs
                        font-medium
                        text-[#776B5F]
                      "
                    >
                      {rating.toFixed(1)} / 5
                    </span>
                  </div>
                )}

                {/* PRICE */}

                <p
                  className="
                    mt-6
                    font-raleway
                    text-2xl
                    font-semibold
                    tracking-[-0.025em]
                    text-[#8D623B]
                    sm:text-3xl
                  "
                >
                  {priceLabel}
                </p>

                {/* IN STORE LABEL */}

                {product.inStore && (
                  <div
                    className="
                      mt-4
                      inline-flex
                      w-fit
                      items-center
                      gap-2
                      border
                      border-[#DCC9AF]
                      bg-[#EFE4D5]
                      px-3
                      py-2
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

                    <span
                      className="
                        font-raleway
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.1em]
                        text-[#8D623B]
                      "
                    >
                      Available In Store
                    </span>
                  </div>
                )}
              </div>

              {/* ---------------------------------------------- */}
              {/* DESCRIPTION                                    */}
              {/* ---------------------------------------------- */}

              {product.description && (
                <div
                  className="
                    mt-7
                    border-t
                    border-[#E1D7CB]
                    pt-6
                  "
                >
                  <p
                    className="
                      font-play
                      text-sm
                      leading-7
                      text-[#776B5F]
                      sm:text-base
                      sm:leading-8
                    "
                  >
                    {product.description}
                  </p>
                </div>
              )}

              {/* ---------------------------------------------- */}
              {/* COLOR SELECTION                                */}
              {/* ---------------------------------------------- */}

              {hasColors && (
                <div
                  className="
                    mt-8
                    border-t
                    border-[#E1D7CB]
                    pt-6
                  "
                >
                  <div
                    className="
                      mb-4
                      flex
                      flex-wrap
                      items-center
                      justify-between
                      gap-3
                    "
                  >
                    <h3
                      className="
                        font-raleway
                        text-xs
                        font-bold
                        uppercase
                        tracking-[0.12em]
                        text-[#29211C]
                      "
                    >
                      Select Color
                    </h3>

                    {selectedColor && (
                      <span
                        className="
                          font-play
                          text-xs
                          text-[#8D623B]
                        "
                      >
                        {selectedColor}
                      </span>
                    )}
                  </div>

                  <div
                    className="
                      flex
                      flex-wrap
                      items-center
                      gap-3
                    "
                  >
                    {availableColors.map((color, index) => {
                      const isSelected =
                        selectedColor === color;

                      return (
                        <button
                          key={`${color}-${index}`}
                          type="button"
                          onClick={() =>
                            setSelectedColor(color)
                          }
                          aria-label={`Select ${color} color`}
                          aria-pressed={isSelected}
                          title={color}
                          className={`
                            relative
                            flex
                            h-11
                            w-11
                            cursor-pointer
                            items-center
                            justify-center
                            rounded-full
                            border
                            p-[5px]
                            transition-all
                            duration-200
                            focus-visible:outline
                            focus-visible:outline-2
                            focus-visible:outline-offset-2
                            focus-visible:outline-[#A67C52]
                            ${
                              isSelected
                                ? "border-[#A67C52] bg-[#EDE4D8]"
                                : "border-[#DED3C7] bg-white hover:border-[#A67C52]"
                            }
                          `}
                        >
                          <span
                            className="
                              relative
                              flex
                              h-full
                              w-full
                              items-center
                              justify-center
                              rounded-full
                              border
                              border-black/10
                            "
                            style={{
                              backgroundColor: color,
                            }}
                          >
                            {isSelected && (
                              <span
                                className="
                                  flex
                                  h-5
                                  w-5
                                  items-center
                                  justify-center
                                  rounded-full
                                  bg-white/90
                                  text-[#29211C]
                                "
                              >
                                <Check size={12} />
                              </span>
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ---------------------------------------------- */}
              {/* SIZE SELECTION                                 */}
              {/* ---------------------------------------------- */}

              {hasSizes && (
                <div
                  className="
                    mt-8
                    border-t
                    border-[#E1D7CB]
                    pt-6
                  "
                >
                  <div
                    className="
                      mb-4
                      flex
                      items-center
                      justify-between
                      gap-3
                    "
                  >
                    <h3
                      className="
                        font-raleway
                        text-xs
                        font-bold
                        uppercase
                        tracking-[0.12em]
                        text-[#29211C]
                      "
                    >
                      Select Size
                    </h3>

                    {selectedSize && (
                      <span
                        className="
                          font-play
                          text-xs
                          text-[#8D623B]
                        "
                      >
                        {selectedSize}
                      </span>
                    )}
                  </div>

                  <div
                    className="
                      flex
                      flex-wrap
                      gap-2
                    "
                  >
                    {availableSizes.map((sizeOption, index) => {
                      const isSelected =
                        selectedSize === sizeOption;

                      return (
                        <button
                          key={`${sizeOption}-${index}`}
                          type="button"
                          onClick={() =>
                            setSelectedSize(sizeOption)
                          }
                          aria-pressed={isSelected}
                          className={`
                            flex
                            min-h-11
                            min-w-11
                            cursor-pointer
                            items-center
                            justify-center
                            border
                            px-3
                            py-2
                            font-raleway
                            text-xs
                            font-semibold
                            transition-all
                            duration-200
                            focus-visible:outline
                            focus-visible:outline-2
                            focus-visible:outline-offset-2
                            focus-visible:outline-[#A67C52]
                            ${
                              isSelected
                                ? "border-[#29211C] bg-[#29211C] text-white"
                                : "border-[#DCCFC0] bg-white text-[#55483B] hover:border-[#A67C52]"
                            }
                          `}
                        >
                          {sizeOption}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ---------------------------------------------- */}
              {/* PURCHASE ACTION                                */}
              {/* ---------------------------------------------- */}

              <div
                className="
                  mt-9
                  border-t
                  border-[#E1D7CB]
                  pt-7
                "
              >
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={loading || !canPurchase}
                  className="
                    group
                    flex
                    min-h-[56px]
                    w-full
                    cursor-pointer
                    items-center
                    justify-between
                    gap-4
                    bg-[#29211C]
                    px-5
                    py-4
                    font-raleway
                    text-xs
                    font-bold
                    uppercase
                    tracking-[0.13em]
                    text-white
                    transition-all
                    duration-300
                    hover:bg-[#8D623B]
                    active:scale-[0.99]
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                    sm:px-6
                  "
                >
                  <span
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >
                    <ShoppingBag
                      size={18}
                      strokeWidth={1.6}
                    />

                    {loading
                      ? "Adding to bag..."
                      : canPurchase
                        ? "Add to Bag"
                        : "Currently Unavailable"}
                  </span>

                  <ArrowRight
                    size={18}
                    className="
                      shrink-0
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                    "
                  />
                </button>

                <p
                  className="
                    mt-4
                    text-center
                    font-play
                    text-xs
                    leading-6
                    text-[#988B7E]
                  "
                >
                  Select your preferences
                  before adding this item
                  to your shopping bag.
                </p>
              </div>

              {/* BOTTOM BRAND DETAIL */}

              <div
                className="
                  mt-9
                  flex
                  items-center
                  justify-between
                  gap-3
                  border-t
                  border-[#E1D7CB]
                  pt-5
                "
              >
                <span
                  className="
                    font-raleway
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.17em]
                    text-[#9B724B]
                  "
                >
                  DHMS International
                </span>

                <span
                  className="
                    font-play
                    text-xs
                    italic
                    text-[#988B7E]
                  "
                >
                  Curated with care.
                </span>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ProductModal;