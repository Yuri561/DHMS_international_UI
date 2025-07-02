
import logo from '../../../public/logo.png';
import SearchBar from './SearchBar';
import { User, ShoppingCart } from 'lucide-react';
import NavigationMenuBeauty from './HeaderLinks';
import { Link, useNavigate } from 'react-router-dom';
// import LoadingAnimation from '../LoadingAnimation/LoadingAnimation';
import { useAuth } from '../Context/AuthContext';
import { useCart } from '../Context/CartContext'; // 

const Header = () => {
  // const [loading, setLoading] = useState<boolean>(false);
  const { isAuthenticated, logout } = useAuth();
  const { cartQuantity, clearCart } = useCart(); // 
  const navigate = useNavigate();

  // useEffect(() => {
  //   const checkAuth = () => {
  //     const username = localStorage.getItem('username');
  //     setIsAuthenticated(!!username);
  //   };

  //   checkAuth();
  //   window.addEventListener('storage', checkAuth);
  //   return () => window.removeEventListener('storage', checkAuth);
  // }, [setIsAuthenticated]);

  const handleLogout = async () => {
    // setLoading(true);
    await logout();
    await clearCart()
    window.location.reload();
    navigate('/login');
    // setLoading(false);
  };

  // const handleOnClick = () => {
  //   setLoading(true);
  //   setTimeout(() => setLoading(false), 1800);
  // };

  return (
    <>
      <div className='w-full bg-black fixed top-0 left-0 right-0 shadow-md px-8 z-50'>
        <div className='p-4 flex flex-col items-center space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0'>
      {/* {loading && <LoadingAnimation />} */}
          {/* Logo Section */}
          <div className='flex items-center space-x-2'>
            <img src={logo} alt='Logo' className='w-10 h-10 rounded-full p-1 mr-2' />
            <div className='flex flex-col items-start'>
              <span className='text-[#f3cb50] text-xl font-[satisfy]'>DHMS</span>
              <span className='text-[#e3c981] text-sm uppercase font-bold'>
                International Limit
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className='w-full md:w-150 flex justify-center'>
            <SearchBar />
          </div>

          {/* Icons Section */}
          <div className='flex items-center space-x-4 text-white'>
            {/* Cart */}
            <Link to='/cart' className='flex flex-col items-center hover:scale-105 relative'>
              <ShoppingCart />
              <span className='text-[#f3cb50]'>My Cart</span>

             <span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1'>
  {cartQuantity}
</span>
            </Link>

            {/* Auth */}
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className='flex flex-col items-center cursor-pointer hover:scale-105'
              >
                <User />
                <span className='text-[#f3cb50]'>Sign Out</span>
              </button>
            ) : (
              <Link to='/login#top' className='flex flex-col items-center hover:scale-105'>
                <User />
                <span className='text-[#f3cb50]'>Sign In</span>
              </Link>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <div className='w-full flex justify-center pb-4'>
          <NavigationMenuBeauty />
        </div>
      </div>
    </>
  );
};

export default Header;
