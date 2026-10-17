
import React, {
  useEffect,
  useState,
} from "react";

import { useLocation } from "react-router-dom";

import ProductContent from "./ProductContent";

// ============================================================
// DHMS INTERNATIONAL
// SHOP PAGE
// ============================================================

type ShopNavigationState = {
  category?: string;
} | null;

// ============================================================
// SHOP COMPONENT
// ============================================================

const Shop: React.FC = () => {
  const location = useLocation();

  // ----------------------------------------------------------
  // CATEGORY FILTER
  // ----------------------------------------------------------

  const [selectedCategory, setSelectedCategory] =
    useState<string[]>([]);

  // ----------------------------------------------------------
  // BRAND FILTER
  // ----------------------------------------------------------

  const [selectedBrand, setSelectedBrand] =
    useState<string[]>([]);

  // ----------------------------------------------------------
  // CUSTOMER RATING
  // ----------------------------------------------------------

  const [selectRating, setSelectRating] =
    useState<number>(0);

  // ----------------------------------------------------------
  // SORT ORDER
  // ----------------------------------------------------------

  const [order, setOrder] =
    useState<string>("");

  // ----------------------------------------------------------
  // AVAILABILITY
  // ----------------------------------------------------------

  const [
    availabilityFilter,
    setAvailabilityFilter,
  ] = useState<string[]>([]);

  // ----------------------------------------------------------
  // DESKTOP FILTER STATE
  // ----------------------------------------------------------

  // Retained for compatibility with your existing
  // ProductContent props.

  const [
    isDesktopOpen,
    setIsDesktopOpen,
  ] = useState<boolean>(true);

  // ============================================================
  // CATEGORY NAVIGATION
  // ============================================================

  useEffect(() => {
    const navigationState =
      location.state as ShopNavigationState;

    const category =
      typeof navigationState?.category === "string"
        ? navigationState.category.trim()
        : "";

    // When arriving from the homepage or an
    // In-Store product category, automatically
    // select the corresponding shop category.

    if (category) {
      setSelectedCategory([category]);
    } else {
      // When navigating to Shop All, begin
      // with the full collection.

      setSelectedCategory([]);
    }

    // Reset the remaining filters when arriving
    // through a new navigation action.

    setSelectedBrand([]);

    setSelectRating(0);

    setAvailabilityFilter([]);

    setOrder("");

  }, [location.key]);

  // ============================================================
  // SCROLL POSITION
  // ============================================================

  useEffect(() => {
    // Your existing OffsetLink uses /shop#top.
    // Scroll to the beginning of the shop when
    // navigating to that anchor.

    if (location.hash === "#top") {
      window.scrollTo({
        top: 0,
        behavior: "instant",
      });
    }
  }, [location.key, location.hash]);

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div
      id="top"
      className="
        relative
        isolate
        w-full
        min-w-0
        min-h-screen
        bg-[#F8F5EF]
        text-[#29211C]
      "
    >
      {/* ================================================== */}
      {/* SHOP CONTENT                                      */}
      {/* ================================================== */}

      <ProductContent
        // CATEGORY
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}

        // BRAND
        selectedBrand={selectedBrand}
        setSelectedBrand={setSelectedBrand}

        // RATING
        selectRating={selectRating}
        setSelectRating={setSelectRating}

        // SORT
        order={order}
        setOrder={setOrder}

        // AVAILABILITY
        availabilityFilter={availabilityFilter}
        setAvailabilityFilter={setAvailabilityFilter}

        // DESKTOP FILTER STATE
        isDesktopOpen={isDesktopOpen}
        setIsDesktopOpen={setIsDesktopOpen}
      />
    </div>
  );
};

export default Shop;