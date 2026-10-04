
import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import { Link } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  CreditCard,
  LockKeyhole,
  MapPin,
  Minus,
  Package,
  Plus,
  ShoppingBag,
  Trash2,
  Truck,
} from "lucide-react";

import toast from "react-hot-toast";

import {
  useForm,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";

import { useCart } from "../Context/CartContext";

import api from "../setUpAxios";

// ============================================================
// DHMS INTERNATIONAL
// SHOPPING BAG / CHECKOUT
// ============================================================

// ------------------------------------------------------------
// TYPES
// ------------------------------------------------------------

type FormData = {
  name: string;
  homeAddress: string;
  city: string;
  state: string;
  zipCode: string;
};

type CartItem = {
  _id?: string;
  id?: string | number;

  name: string;

  image?: string;
  imageUrl?: string;

  price: number;
  quantity: number;

  color?: string;
  size?: string;

  totalPrice?: number;
};

// ------------------------------------------------------------
// CONFIGURATION
// ------------------------------------------------------------

// Keep this consistent with your existing checkout backend.
// The backend must independently validate the shipping charge.

const DELIVERY_FEE = 4.99;

const MAX_QUANTITY = 50;

// ------------------------------------------------------------
// HELPERS
// ------------------------------------------------------------

const formatPrice = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

const getItemPrice = (item: CartItem): number => {
  const price = Number(item.price);

  return Number.isFinite(price) && price > 0
    ? price
    : 0;
};

const getItemQuantity = (item: CartItem): number => {
  const quantity = Number(item.quantity);

  return Number.isFinite(quantity) && quantity > 0
    ? Math.trunc(quantity)
    : 0;
};

// ============================================================
// REUSABLE DELIVERY INPUT
// ============================================================

type DeliveryField = keyof FormData;

type DeliveryInputProps = {
  name: DeliveryField;

  label: string;

  placeholder: string;

  register: UseFormRegister<FormData>;

  errors: FieldErrors<FormData>;

  validation: Parameters<
    UseFormRegister<FormData>
  >[1];

  autoComplete?: string;

  maxLength?: number;
};

const DeliveryInput: React.FC<DeliveryInputProps> = ({
  name,
  label,
  placeholder,
  register,
  errors,
  validation,
  autoComplete,
  maxLength,
}) => {
  const error = errors[name];

  return (
    <div className="min-w-0">
      <label
        htmlFor={`delivery-${name}`}
        className="
          mb-3
          block
          font-raleway
          text-[10px]
          font-bold
          uppercase
          tracking-[0.13em]
          text-[#49392B]
        "
      >
        {label}

        <span className="ml-1 text-[#A67C52]">
          *
        </span>
      </label>

      <input
        id={`delivery-${name}`}
        type="text"
        placeholder={placeholder}
        autoComplete={autoComplete}
        maxLength={maxLength}
        aria-invalid={!!error}
        aria-describedby={
          error
            ? `delivery-${name}-error`
            : undefined
        }
        {...register(name, validation)}
        className={`
          h-[54px]
          w-full
          min-w-0
          rounded-none
          border
          bg-[#FAF8F4]
          px-4
          font-play
          text-sm
          text-[#29211C]
          outline-none
          transition-all
          duration-300
          placeholder:text-[#A89B8D]
          focus:bg-white
          focus:ring-2
          focus:ring-[#A67C52]/10
          ${
            error
              ? "border-[#B3483A] focus:border-[#B3483A]"
              : "border-[#E2D8CB] focus:border-[#A67C52]"
          }
        `}
      />

      {error && (
        <p
          id={`delivery-${name}-error`}
          role="alert"
          className="
            mt-2
            font-play
            text-xs
            leading-5
            text-[#B3483A]
          "
        >
          {error.message}
        </p>
      )}
    </div>
  );
};

// ============================================================
// CART COMPONENT
// ============================================================

const Cart: React.FC = () => {
  const {
    cart,
    fetchCart,
    removeFromCart,
    updateQty,
  } = useCart();

  // ----------------------------------------------------------
  // STATE
  // ----------------------------------------------------------

  const [updatingItem, setUpdatingItem] =
    useState<string | null>(null);

  const [cartLoading, setCartLoading] =
    useState(true);

  // ----------------------------------------------------------
  // CART DATA
  // ----------------------------------------------------------

  const cartItems: CartItem[] =
    Array.isArray(cart) ? cart : [];

  const subtotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      const price = getItemPrice(item);

      const quantity = getItemQuantity(item);

      return total + price * quantity;
    }, 0);
  }, [cart]);

  const itemCount = cartItems.reduce(
    (total, item) =>
      total + getItemQuantity(item),
    0
  );

  const deliveryFee =
    cartItems.length > 0
      ? DELIVERY_FEE
      : 0;

  const total = subtotal + deliveryFee;

  const isEmpty = cartItems.length === 0;

  // ----------------------------------------------------------
  // DELIVERY FORM
  // ----------------------------------------------------------

  const {
    register,
    handleSubmit,

    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<FormData>({
    mode: "onTouched",

    defaultValues: {
      name: "",
      homeAddress: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });

  // ----------------------------------------------------------
  // FETCH CART
  // ----------------------------------------------------------

  useEffect(() => {
    let mounted = true;

    const loadCart = async () => {
      try {
        await fetchCart();
      } catch (error) {
        console.error(
          "DHMS cart loading error:",
          error
        );

        toast.error(
          "Unable to load your shopping bag."
        );
      } finally {
        if (mounted) {
          setCartLoading(false);
        }
      }
    };

    void loadCart();

    return () => {
      mounted = false;
    };
  }, [fetchCart]);

  // ----------------------------------------------------------
  // UPDATE ITEM QUANTITY
  // ----------------------------------------------------------

  const handleQuantityChange = async (
    item: CartItem,
    change: number
  ) => {
    const itemId = item._id;

    if (!itemId) {
      toast.error(
        "This item cannot be updated. Please refresh your bag."
      );

      return;
    }

    if (updatingItem) return;

    const currentQuantity =
      getItemQuantity(item);

    const nextQuantity =
      currentQuantity + change;

    if (nextQuantity > MAX_QUANTITY) {
      toast.error(
        `Maximum quantity is ${MAX_QUANTITY}.`
      );

      return;
    }

    setUpdatingItem(itemId);

    try {
      if (nextQuantity <= 0) {
        await Promise.resolve(
          removeFromCart(itemId)
        );

        toast.success(
          "Item removed from your bag."
        );
      } else {
        await Promise.resolve(
          updateQty(itemId, nextQuantity)
        );
      }
    } catch (error) {
      console.error(
        "DHMS quantity update error:",
        error
      );

      toast.error(
        "Unable to update this item."
      );
    } finally {
      setUpdatingItem(null);
    }
  };

  // ----------------------------------------------------------
  // REMOVE ITEM
  // ----------------------------------------------------------

  const handleRemoveItem = async (
    item: CartItem
  ) => {
    const itemId = item._id;

    if (!itemId) {
      toast.error(
        "This item cannot be removed. Please refresh your bag."
      );

      return;
    }

    if (updatingItem) return;

    setUpdatingItem(itemId);

    try {
      await Promise.resolve(
        removeFromCart(itemId)
      );

      toast.success(
        "Item removed from your bag."
      );
    } catch (error) {
      console.error(
        "DHMS remove item error:",
        error
      );

      toast.error(
        "Unable to remove this item."
      );
    } finally {
      setUpdatingItem(null);
    }
  };

  // ----------------------------------------------------------
  // STRIPE CHECKOUT
  // ----------------------------------------------------------

  const onSubmit = async (
    data: FormData
  ) => {
    if (!cartItems.length) {
      toast.error(
        "Your shopping bag is empty."
      );

      return;
    }

    if (updatingItem) {
      toast.error(
        "Please wait for your bag to finish updating."
      );

      return;
    }

    const invalidItem = cartItems.some(
      (item) =>
        getItemPrice(item) <= 0 ||
        getItemQuantity(item) <= 0 ||
        getItemQuantity(item) > MAX_QUANTITY
    );

    if (invalidItem) {
      toast.error(
        "One or more items have invalid pricing or quantities."
      );

      return;
    }

    try {
      // ----------------------------------------------------
      // BUILD STRIPE LINE ITEMS
      // ----------------------------------------------------

      const line_items = [
        ...cartItems.map((item) => ({
          price_data: {
            currency: "usd",

            product_data: {
              name: item.name,
            },

            unit_amount: Math.round(
              getItemPrice(item) * 100
            ),
          },

          quantity:
            getItemQuantity(item),
        })),

        // Preserve the delivery fee used by
        // your existing checkout integration.

        ...(deliveryFee > 0
          ? [
              {
                price_data: {
                  currency: "usd",

                  product_data: {
                    name: "Delivery Fee",
                  },

                  unit_amount:
                    Math.round(
                      deliveryFee * 100
                    ),
                },

                quantity: 1,
              },
            ]
          : []),
      ];

      // ----------------------------------------------------
      // CREATE CHECKOUT SESSION
      // ----------------------------------------------------

      const response = await api.post(
        "/checkout/create-checkout-session",
        {
          ...data,

          line_items,
        }
      );

      // ----------------------------------------------------
      // REDIRECT TO STRIPE
      // ----------------------------------------------------

      const checkoutUrl =
        response.data?.url;

      if (
        typeof checkoutUrl !== "string" ||
        !checkoutUrl
      ) {
        throw new Error(
          "Checkout URL was not returned."
        );
      }

      const destination = new URL(
        checkoutUrl
      );

      if (
        destination.protocol !== "https:" ||
        destination.hostname !==
          "checkout.stripe.com"
      ) {
        throw new Error(
          "Unexpected checkout destination."
        );
      }

      window.location.assign(
        destination.href
      );
    } catch (error: any) {
      console.error(
        "DHMS checkout error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Checkout could not be started. Please try again."
      );
    }
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <main
      id="cart"
      className="
        relative
        min-h-screen
        w-full
        min-w-0
        overflow-x-clip
        bg-[#F8F5EF]
        font-play
        text-[#29211C]
      "
    >
      {/* ================================================== */}
      {/* PAGE HEADER                                        */}
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
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -right-20
            -top-28
            select-none
            font-serif
            text-[300px]
            leading-none
            text-white/[0.025]
            sm:text-[450px]
          "
        >
          D
        </div>

        <div
          className="
            relative
            mx-auto
            w-full
            max-w-[1500px]
            px-4
            pb-12
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
          {/* BREADCRUMB */}

          <nav
            aria-label="Shopping bag breadcrumb"
            className="
              mb-8
              flex
              items-center
              gap-2
              font-raleway
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.14em]
            "
          >
            <Link
              to="/shop"
              className="
                text-[#B9AA9B]
                transition-colors
                hover:text-white
              "
            >
              Collection
            </Link>

            <ChevronRight
              size={13}
              className="text-[#8C7764]"
            />

            <span className="text-[#D7B791]">
              Shopping Bag
            </span>
          </nav>

          {/* HEADING */}

          <div
            className="
              flex
              flex-col
              gap-7
              md:flex-row
              md:items-end
              md:justify-between
              md:gap-12
            "
          >
            <div>
              <div
                className="
                  mb-5
                  flex
                  items-center
                  gap-3
                "
              >
                <span
                  className="
                    h-px
                    w-8
                    bg-[#D7B791]
                  "
                />

                <span
                  className="
                    font-raleway
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.2em]
                    text-[#D7B791]
                  "
                >
                  DHMS International
                </span>
              </div>

              <h1
                className="
                  font-raleway
                  text-[clamp(3.2rem,7vw,6.5rem)]
                  font-semibold
                  leading-[1.03]
                  tracking-[-0.065em]
                  text-[#F8F4EC]
                "
              >
                Your shopping

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
                  bag.
                </span>
              </h1>
            </div>

            <div
              className="
                flex
                max-w-sm
                flex-col
                gap-5
                md:items-end
                md:text-right
              "
            >
              <p
                className="
                  text-sm
                  leading-7
                  text-[#C4B6A8]
                  sm:text-base
                "
              >
                Your favorites, all in one place.
                Review your selection and
                continue to checkout.
              </p>

              <Link
                to="/shop"
                className="
                  group
                  inline-flex
                  min-h-11
                  w-fit
                  items-center
                  gap-2
                  border-b
                  border-[#D7B791]/60
                  pb-1
                  font-raleway
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.12em]
                  text-[#D7B791]
                  transition-all
                  hover:gap-3
                  hover:text-white
                "
              >
                <ArrowLeft size={15} />

                Continue shopping
              </Link>
            </div>
          </div>

          {/* BOTTOM HEADER DETAIL */}

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
            "
          >
            <span
              className="
                flex
                items-center
                gap-3
                font-raleway
                text-[10px]
                font-medium
                uppercase
                tracking-[0.13em]
                text-[#C4B6A8]
              "
            >
              <ShoppingBag
                size={16}
                className="text-[#D7B791]"
              />

              {cartLoading
                ? "Loading your bag"
                : `${itemCount} ${
                    itemCount === 1
                      ? "item"
                      : "items"
                  } in your bag`}
            </span>

            <span
              className="
                hidden
                font-raleway
                text-[10px]
                font-medium
                uppercase
                tracking-[0.13em]
                text-[#9B8B7B]
                sm:block
              "
            >
              Curated with care
            </span>
          </div>
        </div>
      </section>

      {/* ================================================== */}
      {/* CART CONTENT                                       */}
      {/* ================================================== */}

      <section
        className="
          mx-auto
          w-full
          max-w-[1500px]
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
        {/* ================================================== */}
        {/* LOADING STATE                                     */}
        {/* ================================================== */}

        {cartLoading ? (
          <div
            role="status"
            aria-live="polite"
            className="
              flex
              min-h-[350px]
              flex-col
              items-center
              justify-center
              gap-5
            "
          >
            <div
              className="
                h-10
                w-10
                animate-spin
                rounded-full
                border-2
                border-[#E1D7CB]
                border-t-[#A67C52]
              "
            />

            <p
              className="
                font-raleway
                text-xs
                font-semibold
                uppercase
                tracking-[0.15em]
                text-[#8D8175]
              "
            >
              Preparing your shopping bag
            </p>
          </div>
        ) : isEmpty ? (
          /* ================================================== */
          /* EMPTY CART                                         */
          /* ================================================== */

          <div
            className="
              mx-auto
              flex
              min-h-[450px]
              max-w-3xl
              flex-col
              items-center
              justify-center
              border
              border-[#E5DBCF]
              bg-white
              px-6
              py-16
              text-center
              sm:px-10
            "
          >
            <div
              className="
                flex
                h-20
                w-20
                items-center
                justify-center
                rounded-full
                border
                border-[#E4D7C6]
                bg-[#F5EDE2]
                text-[#A67C52]
              "
            >
              <ShoppingBag
                size={33}
                strokeWidth={1.3}
              />
            </div>

            <p
              className="
                mt-9
                font-raleway
                text-[10px]
                font-bold
                uppercase
                tracking-[0.2em]
                text-[#A67C52]
              "
            >
              Your Collection Awaits
            </p>

            <h2
              className="
                mt-4
                font-serif
                text-[clamp(2.3rem,5vw,4rem)]
                font-normal
                leading-[1.15]
                tracking-[-0.045em]
                text-[#29211C]
              "
            >
              Nothing in your bag

              <span
                className="
                  mt-1
                  block
                  italic
                  text-[#A67C52]
                "
              >
                just yet.
              </span>
            </h2>

            <p
              className="
                mt-6
                max-w-md
                text-sm
                leading-7
                text-[#786D63]
                sm:text-base
              "
            >
              Explore our collection of
              African-inspired fashion,
              beauty, and self-care.
              Your next favorite find
              could be waiting for you.
            </p>

            <Link
              to="/shop"
              className="
                group
                mt-9
                inline-flex
                min-h-[54px]
                w-full
                items-center
                justify-between
                gap-6
                bg-[#29211C]
                px-6
                py-4
                font-raleway
                text-xs
                font-bold
                uppercase
                tracking-[0.1em]
                text-white
                transition-colors
                hover:bg-[#8D623B]
                sm:w-fit
                sm:min-w-[240px]
              "
            >
              Explore the Collection

              <ArrowUpRight
                size={17}
                className="
                  transition-transform
                  group-hover:-translate-y-0.5
                  group-hover:translate-x-0.5
                "
              />
            </Link>
          </div>
        ) : (
          /* ================================================== */
          /* CART + CHECKOUT                                   */
          /* ================================================== */

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <div
              className="
                grid
                min-w-0
                grid-cols-1
                items-start
                gap-10
                lg:grid-cols-[minmax(0,1fr)_minmax(320px,390px)]
                lg:gap-8
                xl:grid-cols-[minmax(0,1fr)_420px]
                xl:gap-12
              "
            >
              {/* ============================================== */}
              {/* LEFT SIDE                                      */}
              {/* ============================================== */}

              <div className="min-w-0">
                {/* ------------------------------------------ */}
                {/* BAG HEADING                                */}
                {/* ------------------------------------------ */}

                <div
                  className="
                    mb-7
                    flex
                    flex-wrap
                    items-end
                    justify-between
                    gap-4
                    border-b
                    border-[#DED5CA]
                    pb-5
                  "
                >
                  <div>
                    <p
                      className="
                        mb-3
                        font-raleway
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-[0.18em]
                        text-[#A67C52]
                      "
                    >
                      01 / Your Selection
                    </p>

                    <h2
                      className="
                        font-serif
                        text-3xl
                        font-normal
                        tracking-[-0.04em]
                        text-[#29211C]
                        sm:text-4xl
                      "
                    >
                      Your items
                    </h2>
                  </div>

                  <span
                    className="
                      font-raleway
                      text-xs
                      font-medium
                      text-[#85786A]
                    "
                  >
                    {itemCount}
                    {" "}
                    {itemCount === 1
                      ? "item"
                      : "items"}
                  </span>
                </div>

                {/* ------------------------------------------ */}
                {/* CART ITEMS                                 */}
                {/* ------------------------------------------ */}

                <div className="space-y-0">
                  {cartItems.map(
                    (item, index) => {
                      const itemId =
                        item._id ||
                        String(item.id ?? index);

                      const quantity =
                        getItemQuantity(item);

                      const price =
                        getItemPrice(item);

                      const lineTotal =
                        price * quantity;

                      const isUpdating =
                        updatingItem === item._id;

                      const image =
                        item.imageUrl ||
                        item.image ||
                        "";

                      return (
                        <article
                          key={`${itemId}-${index}`}
                          className="
                            grid
                            min-w-0
                            grid-cols-[88px_minmax(0,1fr)]
                            gap-4
                            border-b
                            border-[#E5DBCF]
                            py-6
                            sm:grid-cols-[115px_minmax(0,1fr)]
                            sm:gap-6
                            sm:py-7
                          "
                        >
                          {/* PRODUCT IMAGE */}

                          <div
                            className="
                              relative
                              aspect-[3/4]
                              w-full
                              overflow-hidden
                              bg-[#EDE5DA]
                            "
                          >
                            {image ? (
                              <img
                                src={image}
                                alt={item.name}
                                loading="lazy"
                                decoding="async"
                                className="
                                  h-full
                                  w-full
                                  object-contain
                                  object-center
                                "
                              />
                            ) : (
                              <div
                                className="
                                  flex
                                  h-full
                                  w-full
                                  items-center
                                  justify-center
                                  text-[#A67C52]
                                "
                              >
                                <Package
                                  size={28}
                                  strokeWidth={1.3}
                                />
                              </div>
                            )}
                          </div>

                          {/* PRODUCT DETAILS */}

                          <div
                            className="
                              flex
                              min-w-0
                              flex-col
                              justify-between
                              gap-5
                            "
                          >
                            {/* TOP */}

                            <div
                              className="
                                flex
                                min-w-0
                                items-start
                                justify-between
                                gap-3
                              "
                            >
                              <div className="min-w-0">
                                <p
                                  className="
                                    mb-2
                                    font-raleway
                                    text-[9px]
                                    font-bold
                                    uppercase
                                    tracking-[0.12em]
                                    text-[#A67C52]
                                    sm:text-[10px]
                                  "
                                >
                                  DHMS Collection
                                </p>

                                <h3
                                  className="
                                    font-raleway
                                    text-sm
                                    font-semibold
                                    leading-5
                                    text-[#29211C]
                                    sm:text-lg
                                    sm:leading-7
                                  "
                                >
                                  {item.name}
                                </h3>

                                <p
                                  className="
                                    mt-2
                                    font-raleway
                                    text-sm
                                    font-semibold
                                    text-[#8D623B]
                                    sm:text-base
                                  "
                                >
                                  {formatPrice(price)}
                                </p>

                                {/* VARIATIONS */}

                                {(item.color ||
                                  item.size) && (
                                  <div
                                    className="
                                      mt-3
                                      flex
                                      flex-wrap
                                      gap-x-4
                                      gap-y-1
                                      font-play
                                      text-xs
                                      text-[#85786A]
                                    "
                                  >
                                    {item.color && (
                                      <span>
                                        Color:{" "}
                                        <span
                                          className="
                                            font-medium
                                            text-[#49392B]
                                          "
                                        >
                                          {item.color}
                                        </span>
                                      </span>
                                    )}

                                    {item.size && (
                                      <span>
                                        Size:{" "}
                                        <span
                                          className="
                                            font-medium
                                            uppercase
                                            text-[#49392B]
                                          "
                                        >
                                          {item.size}
                                        </span>
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>

                              {/* REMOVE */}

                              <button
                                type="button"
                                onClick={() =>
                                  void handleRemoveItem(
                                    item
                                  )
                                }
                                disabled={
                                  !!updatingItem ||
                                  isSubmitting
                                }
                                aria-label={`Remove ${item.name} from bag`}
                                className="
                                  flex
                                  h-9
                                  w-9
                                  shrink-0
                                  items-center
                                  justify-center
                                  text-[#A89B8D]
                                  transition-colors
                                  hover:bg-[#F1E7DC]
                                  hover:text-[#A34739]
                                  disabled:cursor-not-allowed
                                  disabled:opacity-50
                                "
                              >
                                <Trash2 size={17} />
                              </button>
                            </div>

                            {/* BOTTOM */}

                            <div
                              className="
                                flex
                                flex-wrap
                                items-end
                                justify-between
                                gap-3
                              "
                            >
                              {/* QUANTITY CONTROL */}

                              <div>
                                <p
                                  className="
                                    mb-2
                                    font-raleway
                                    text-[9px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.12em]
                                    text-[#938679]
                                  "
                                >
                                  Quantity
                                </p>

                                <div
                                  className="
                                    inline-flex
                                    h-10
                                    items-center
                                    border
                                    border-[#DDD1C2]
                                    bg-white
                                    sm:h-11
                                  "
                                >
                                  <button
                                    type="button"
                                    onClick={() =>
                                      void handleQuantityChange(
                                        item,
                                        -1
                                      )
                                    }
                                    disabled={
                                      !!updatingItem ||
                                      isSubmitting
                                    }
                                    aria-label={`Decrease quantity of ${item.name}`}
                                    className="
                                      flex
                                      h-full
                                      w-9
                                      items-center
                                      justify-center
                                      text-[#49392B]
                                      transition-colors
                                      hover:bg-[#F2EBE1]
                                      disabled:cursor-not-allowed
                                      disabled:opacity-40
                                      sm:w-10
                                    "
                                  >
                                    <Minus size={14} />
                                  </button>

                                  <span
                                    className="
                                      flex
                                      h-full
                                      min-w-8
                                      items-center
                                      justify-center
                                      font-raleway
                                      text-xs
                                      font-semibold
                                      text-[#29211C]
                                    "
                                  >
                                    {isUpdating
                                      ? "..."
                                      : quantity}
                                  </span>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      void handleQuantityChange(
                                        item,
                                        1
                                      )
                                    }
                                    disabled={
                                      !!updatingItem ||
                                      isSubmitting ||
                                      quantity >=
                                        MAX_QUANTITY
                                    }
                                    aria-label={`Increase quantity of ${item.name}`}
                                    className="
                                      flex
                                      h-full
                                      w-9
                                      items-center
                                      justify-center
                                      text-[#49392B]
                                      transition-colors
                                      hover:bg-[#F2EBE1]
                                      disabled:cursor-not-allowed
                                      disabled:opacity-40
                                      sm:w-10
                                    "
                                  >
                                    <Plus size={14} />
                                  </button>
                                </div>
                              </div>

                              {/* LINE TOTAL */}

                              <div className="text-right">
                                <p
                                  className="
                                    mb-2
                                    font-raleway
                                    text-[9px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.12em]
                                    text-[#938679]
                                  "
                                >
                                  Item Total
                                </p>

                                <p
                                  className="
                                    font-raleway
                                    text-sm
                                    font-semibold
                                    text-[#29211C]
                                    sm:text-base
                                  "
                                >
                                  {formatPrice(
                                    lineTotal
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        </article>
                      );
                    }
                  )}
                </div>

                {/* CONTINUE SHOPPING */}

                <Link
                  to="/shop"
                  className="
                    group
                    mt-6
                    inline-flex
                    min-h-11
                    items-center
                    gap-3
                    font-raleway
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.12em]
                    text-[#8D623B]
                    transition-all
                    hover:gap-4
                    hover:text-[#29211C]
                  "
                >
                  <ArrowLeft size={16} />

                  Continue shopping
                </Link>

                {/* ========================================== */}
                {/* DELIVERY INFORMATION                       */}
                {/* ========================================== */}

                <div className="mt-14 sm:mt-16">
                  {/* SECTION HEADER */}

                  <div
                    className="
                      mb-8
                      border-b
                      border-[#DED5CA]
                      pb-6
                    "
                  >
                    <p
                      className="
                        mb-3
                        font-raleway
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-[0.18em]
                        text-[#A67C52]
                      "
                    >
                      02 / Delivery Details
                    </p>

                    <h2
                      className="
                        font-serif
                        text-3xl
                        font-normal
                        tracking-[-0.04em]
                        text-[#29211C]
                        sm:text-4xl
                      "
                    >
                      Where should we

                      <span
                        className="
                          ml-2
                          italic
                          text-[#A67C52]
                        "
                      >
                        send it?
                      </span>
                    </h2>

                    <p
                      className="
                        mt-4
                        max-w-xl
                        text-sm
                        leading-7
                        text-[#786D63]
                      "
                    >
                      Enter your delivery information
                      below. Please double-check
                      your address before continuing
                      to payment.
                    </p>
                  </div>

                  {/* DELIVERY FIELDS */}

                  <div className="space-y-6">
                    <DeliveryInput
                      name="name"
                      label="Full Name"
                      placeholder="Your full name"
                      autoComplete="name"
                      maxLength={100}
                      register={register}
                      errors={errors}
                      validation={{
                        required:
                          "Please enter your full name.",
                        maxLength: {
                          value: 100,
                          message:
                            "Name cannot exceed 100 characters.",
                        },
                      }}
                    />

                    <DeliveryInput
                      name="homeAddress"
                      label="Street Address"
                      placeholder="Street address, apartment, suite, etc."
                      autoComplete="street-address"
                      maxLength={200}
                      register={register}
                      errors={errors}
                      validation={{
                        required:
                          "Please enter your delivery address.",
                        maxLength: {
                          value: 200,
                          message:
                            "Address cannot exceed 200 characters.",
                        },
                      }}
                    />

                    <div
                      className="
                        grid
                        grid-cols-1
                        gap-6
                        sm:grid-cols-2
                      "
                    >
                      <DeliveryInput
                        name="city"
                        label="City"
                        placeholder="City"
                        autoComplete="address-level2"
                        maxLength={100}
                        register={register}
                        errors={errors}
                        validation={{
                          required:
                            "Please enter your city.",
                        }}
                      />

                      <DeliveryInput
                        name="state"
                        label="State"
                        placeholder="State"
                        autoComplete="address-level1"
                        maxLength={100}
                        register={register}
                        errors={errors}
                        validation={{
                          required:
                            "Please enter your state.",
                        }}
                      />
                    </div>

                    <DeliveryInput
                      name="zipCode"
                      label="ZIP Code"
                      placeholder="12345"
                      autoComplete="postal-code"
                      maxLength={10}
                      register={register}
                      errors={errors}
                      validation={{
                        required:
                          "Please enter your ZIP code.",
                        pattern: {
                          value:
                            /^\d{5}(-\d{4})?$/,
                          message:
                            "Enter a valid US ZIP code.",
                        },
                      }}
                    />
                  </div>

                  {/* DELIVERY NOTE */}

                  <div
                    className="
                      mt-8
                      flex
                      items-start
                      gap-4
                      border
                      border-[#E5DBCF]
                      bg-[#F1E9DE]
                      px-4
                      py-5
                      sm:px-5
                    "
                  >
                    <MapPin
                      size={20}
                      strokeWidth={1.5}
                      className="
                        mt-0.5
                        shrink-0
                        text-[#A67C52]
                      "
                    />

                    <div>
                      <p
                        className="
                          font-raleway
                          text-xs
                          font-semibold
                          text-[#49392B]
                        "
                      >
                        Delivery Information
                      </p>

                      <p
                        className="
                          mt-2
                          text-xs
                          leading-6
                          text-[#85786A]
                        "
                      >
                        Your delivery details will
                        be submitted with your
                        checkout request. Payment
                        will be completed securely
                        through Stripe.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ============================================== */}
              {/* RIGHT SIDE — ORDER SUMMARY                     */}
              {/* ============================================== */}

              <aside
                className="
                  w-full
                  min-w-0
                  self-start
                  border
                  border-[#E3D8CA]
                  bg-white
                  shadow-[0_18px_55px_rgba(41,33,28,0.045)]
                  lg:sticky
                  lg:top-28
                "
              >
                {/* SUMMARY HEADER */}

                <div
                  className="
                    border-b
                    border-[#E7DED3]
                    px-5
                    py-7
                    sm:px-7
                    sm:py-8
                  "
                >
                  <p
                    className="
                      mb-3
                      font-raleway
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[0.18em]
                      text-[#A67C52]
                    "
                  >
                    03 / Order Overview
                  </p>

                  <h2
                    className="
                      font-serif
                      text-3xl
                      font-normal
                      tracking-[-0.04em]
                      text-[#29211C]
                    "
                  >
                    Order summary
                  </h2>

                  <p
                    className="
                      mt-3
                      font-play
                      text-xs
                      leading-6
                      text-[#85786A]
                    "
                  >
                    Review your items and
                    estimated total before payment.
                  </p>
                </div>

                {/* SUMMARY DETAILS */}

                <div
                  className="
                    space-y-6
                    px-5
                    py-7
                    sm:px-7
                    sm:py-8
                  "
                >
                  {/* ITEM COUNT */}

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      gap-4
                    "
                  >
                    <span
                      className="
                        font-play
                        text-sm
                        text-[#786D63]
                      "
                    >
                      Items in your bag
                    </span>

                    <span
                      className="
                        font-raleway
                        text-sm
                        font-semibold
                        text-[#29211C]
                      "
                    >
                      {itemCount}
                    </span>
                  </div>

                  {/* SUBTOTAL */}

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      gap-4
                    "
                  >
                    <span
                      className="
                        font-play
                        text-sm
                        text-[#786D63]
                      "
                    >
                      Subtotal
                    </span>

                    <span
                      className="
                        font-raleway
                        text-sm
                        font-semibold
                        text-[#29211C]
                      "
                    >
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  {/* DELIVERY */}

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      gap-4
                    "
                  >
                    <span
                      className="
                        font-play
                        text-sm
                        text-[#786D63]
                      "
                    >
                      Delivery
                    </span>

                    <span
                      className="
                        font-raleway
                        text-sm
                        font-semibold
                        text-[#29211C]
                      "
                    >
                      {formatPrice(
                        deliveryFee
                      )}
                    </span>
                  </div>

                  {/* DIVIDER */}

                  <div
                    className="
                      h-px
                      w-full
                      bg-[#E5DBCF]
                    "
                  />

                  {/* TOTAL */}

                  <div
                    className="
                      flex
                      items-start
                      justify-between
                      gap-4
                    "
                  >
                    <div>
                      <p
                        className="
                          font-raleway
                          text-sm
                          font-bold
                          text-[#29211C]
                        "
                      >
                        Estimated Total
                      </p>

                      <p
                        className="
                          mt-1
                          font-play
                          text-xs
                          text-[#938679]
                        "
                      >
                        USD
                      </p>
                    </div>

                    <p
                      className="
                        font-raleway
                        text-2xl
                        font-semibold
                        tracking-[-0.03em]
                        text-[#8D623B]
                        sm:text-3xl
                      "
                    >
                      {formatPrice(total)}
                    </p>
                  </div>

                  {/* CHECKOUT BUTTON */}

                  <button
                    type="submit"
                    disabled={
                      isSubmitting ||
                      !!updatingItem ||
                      isEmpty
                    }
                    className="
                      group
                      flex
                      min-h-[58px]
                      w-full
                      cursor-pointer
                      items-center
                      justify-between
                      gap-4
                      bg-[#29211C]
                      px-5
                      py-4
                      font-raleway
                      text-[11px]
                      font-bold
                      uppercase
                      tracking-[0.1em]
                      text-white
                      transition-all
                      duration-300
                      hover:bg-[#8D623B]
                      active:scale-[0.99]
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    <span
                      className="
                        flex
                        items-center
                        gap-3
                      "
                    >
                      {isSubmitting ? (
                        <span
                          aria-hidden="true"
                          className="
                            h-4
                            w-4
                            animate-spin
                            rounded-full
                            border-2
                            border-white/30
                            border-t-white
                          "
                        />
                      ) : (
                        <LockKeyhole
                          size={17}
                          strokeWidth={1.6}
                        />
                      )}

                      {isSubmitting
                        ? "Preparing Checkout..."
                        : "Proceed to Checkout"}
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

                  {/* PAYMENT INFORMATION */}

                  <div
                    className="
                      flex
                      items-center
                      justify-center
                      gap-2
                      text-[#938679]
                    "
                  >
                    <CreditCard
                      size={15}
                      strokeWidth={1.5}
                    />

                    <p
                      className="
                        font-play
                        text-[11px]
                        leading-5
                      "
                    >
                      Payment processed through Stripe
                    </p>
                  </div>
                </div>

                {/* SUMMARY FOOTER */}

                <div
                  className="
                    border-t
                    border-[#E7DED3]
                    bg-[#F4EEE6]
                    px-5
                    py-6
                    sm:px-7
                  "
                >
                  <div
                    className="
                      flex
                      items-start
                      gap-3
                    "
                  >
                    <Truck
                      size={19}
                      strokeWidth={1.5}
                      className="
                        mt-0.5
                        shrink-0
                        text-[#A67C52]
                      "
                    />

                    <div>
                      <p
                        className="
                          font-raleway
                          text-xs
                          font-semibold
                          text-[#49392B]
                        "
                      >
                        Your DHMS Order
                      </p>

                      <p
                        className="
                          mt-2
                          font-play
                          text-xs
                          leading-6
                          text-[#85786A]
                        "
                      >
                        Review your delivery
                        information and complete
                        your payment to submit
                        your order.
                      </p>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </form>
        )}
      </section>

      {/* ================================================== */}
      {/* BOTTOM BRAND DETAIL                                */}
      {/* ================================================== */}

      <div
        className="
          border-t
          border-[#E1D7CB]
          bg-[#EDE5DA]
          px-5
          py-10
          sm:px-8
          sm:py-12
        "
      >
        <div
          className="
            mx-auto
            flex
            w-full
            max-w-[1450px]
            flex-col
            gap-4
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <p
            className="
              font-serif
              text-xl
              italic
              text-[#8D623B]
              sm:text-2xl
            "
          >
            Rooted in heritage.
            Made for your everyday.
          </p>

          <div
            className="
              flex
              items-center
              gap-2
              font-raleway
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.15em]
              text-[#9B8B7B]
            "
          >
            <Check
              size={15}
              className="text-[#A67C52]"
            />

            DHMS International
          </div>
        </div>
      </div>
    </main>
  );
};

export default Cart;