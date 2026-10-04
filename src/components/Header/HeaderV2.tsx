import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, X } from 'lucide-react';

import logo from '../../../public/logo.png';
import SearchBar from './SearchBar';
import NavigationMenuBeauty from './HeaderLinks';
import LoadingAnimation from '../LoadingAnimation/LoadingAnimation';
import { useCart } from '../Context/CartContext';

const HeaderV2 = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);

  const { cartQuantity } = useCart();
  const navigate = useNavigate();

  const startLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1800);
  };

  const handleLogoClick = () => {
    startLoading();
    navigate('/home');
  };

  return (
    <>
      {loading && <LoadingAnimation />}

      <header className="fixed inset-x-0 top-0 z-50 border-b border-[#E5B974]/20 bg-[#321A14]/95 shadow-[0_10px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-[90rem] items-center justify-between gap-4 px-4 sm:h-24 sm:px-6 lg:px-10 xl:px-16">
          {/* Logo */}
          <button
            type="button"
            onClick={handleLogoClick}
            className="group flex shrink-0 items-center gap-3 text-left"
            aria-label="Go to homepage"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E5B974]/30 bg-white/[0.06] p-1 sm:h-13 sm:w-13">
              <img
                src={logo}
                alt="DHMS International"
                className="h-full w-full rounded-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            <div className="leading-none">
              <span className="font-serif text-xl font-semibold tracking-wide text-[#E5B974] sm:text-2xl">
                DHMS
              </span>

              <span className="mt-1 block text-[0.55rem] font-semibold uppercase tracking-[0.2em] text-white/60 sm:text-[0.65rem]">
                International LLC
              </span>
            </div>
          </button>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex lg:flex-1 lg:justify-center">
            <NavigationMenuBeauty />
          </nav>

          {/* Desktop search */}
          <div className="hidden w-full max-w-sm md:block lg:max-w-xs xl:max-w-sm">
            <SearchBar />
          </div>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            <button
              type="button"
              onClick={() => setSearchOpen((current) => !current)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white transition hover:border-[#E5B974]/60 hover:text-[#E5B974] md:hidden"
              aria-label="Open search"
            >
              {searchOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Search className="h-5 w-5" />
              )}
            </button>

            <Link
              to="/cart"
              onClick={startLoading}
              className="group relative flex h-11 w-11 items-center justify-center rounded-full border border-[#E5B974]/30 bg-[#E5B974] text-[#321A14] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#F2D29F]"
              aria-label={`Shopping cart with ${cartQuantity} items`}
            >
              <ShoppingBag className="h-5 w-5" />

              {cartQuantity > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex min-h-5 min-w-5 items-center justify-center rounded-full border-2 border-[#321A14] bg-[#9B4E3B] px-1 text-[0.6rem] font-bold text-white">
                  {cartQuantity > 99 ? '99+' : cartQuantity}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile search dropdown */}
        <div
          className={`overflow-hidden border-t border-white/10 bg-[#321A14] transition-all duration-300 md:hidden ${
            searchOpen
              ? 'max-h-28 px-4 py-4 opacity-100'
              : 'max-h-0 px-4 py-0 opacity-0'
          }`}
        >
          <SearchBar />
        </div>
      </header>

      {/* Mobile bottom navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[#E5B974]/20 bg-[#321A14]/95 px-4 py-2 shadow-[0_-10px_35px_rgba(0,0,0,0.25)] backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-lg items-center justify-center">
          <NavigationMenuBeauty />
        </div>
      </nav>
    </>
  );
};

export default HeaderV2;