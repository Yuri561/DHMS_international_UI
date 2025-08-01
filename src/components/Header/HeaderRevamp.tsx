import { useState, useEffect } from 'react';
import logo from '../../../public/logo.png';
import SearchBar from './SearchBar';
import { User, ShoppingCart } from 'lucide-react';
import NavigationMenuBeauty from './HeaderLinks';
import { Link, useNavigate } from 'react-router-dom';
import LoadingAnimation from '../LoadingAnimation/LoadingAnimation';
import { useAuth } from '../Context/AuthContext';
import { useCart } from '../Context/CartContext';

const HeaderRevamp = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { isAuthenticated, setIsAuthenticated, logout } = useAuth();
  const { cartQuantity } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const username = localStorage.getItem('username');
      setIsAuthenticated(!!username);
    };
    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, [setIsAuthenticated]);

  const handleLogout = async () => {
    setLoading(true);
    await logout();
    navigate('/login');
    setLoading(false);
  };

  const handleOnClick = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1800);
  };

  return (
    <>
      {loading && <LoadingAnimation />}

      {/* Compact Top Header */}
      <div className='w-full bg-[#d5a86b] fixed top-0 left-0 right-0 shadow-md px-4 py-2 z-50'>
        <div className='flex flex-col md:flex-row items-center justify-between gap-2'>

          {/* Logo */}
          <div className='flex items-center space-x-2'>
            <img src={logo} alt='Logo' className='w-8 h-8 rounded-full p-1' />
            <div className='leading-tight'>
              <span className='text-[#f3cb50] text-lg font-[satisfy]'>DHMS</span>
              <span className='block text-[#f3eae2] text-xs uppercase font-bold'>
                International Limit
              </span>
            </div>
          </div>

          {/* Search */}
          <div className='w-full md:w-96'>
            <SearchBar />
          </div>

          {/* Cart & Auth */}
          <div className='flex items-center gap-8 text-white'>
            <Link
              to='/cart'
              onClick={handleOnClick}
              className='relative flex flex-col items-center hover:scale-105'
            >
              <ShoppingCart className='w-10 h-10' />
              <span className='text-sm text-[#f3cb50]'>Cart</span>
              {cartQuantity > 0 && (
                <span className='absolute -top-1 -right-2 bg-red-600 text-white text-[10px] font-bold rounded-full px-1'>
                  {cartQuantity}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <button onClick={handleLogout} className='flex flex-col items-center hover:scale-105'>
                <User className='w-10 h-10' />
                <span className='text-sm text-[#f3cb50]'>Sign Out</span>
              </button>
            ) : (
              <Link to='/login' onClick={handleOnClick} className='flex flex-col items-center hover:scale-105'>
                <User className='w-10 h-10' />
                <span className='text-sm text-[#f3cb50]'>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Navigation */}
      <div className='fixed  bg-[#2f4f4f] flex justify-center items-center  bottom-0 left-0 right-0  bg-[#d5a86b] shadow-t z-50 px-5 py-2 md:py-3'>
        <NavigationMenuBeauty />
      </div>
    </>
  );
};

export default HeaderRevamp;
