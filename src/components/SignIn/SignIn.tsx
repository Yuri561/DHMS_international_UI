import React, { useState } from 'react';
import signinpng from '../../assets/signin1.jpg';
import { useForm } from 'react-hook-form';
import { userLogin } from '../AuthFolder/AuthFiles';
import { useNavigate, Link } from 'react-router-dom';
import LoadingAnimation from '../LoadingAnimation/LoadingAnimation';
import { useAuth } from '../Context/AuthContext';
import { useCart } from '../Context/CartContext';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

interface FormData {
  username: string;
  password: string;
}

const SignIn: React.FC = () => {
  const { fetchCart } = useCart();
  const { setIsAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setError('');
    setLoading(true);
    try {
      const response = await userLogin({
        username: data.username.trim(),
        password: data.password.trim(),
      });

      if (response.status === 200) {
        const user = response.data.username;
        console.log('Logged in as:', user);
        setIsAuthenticated(true);
        localStorage.setItem('username', user);
        await fetchCart();
        navigate('/dashboard');
      } else {
        toast.error('Incorrect credentials');
        setError('Unable to sign in');
      }
    } catch (err: any) {
      console.error('Error occurred:', err);
      setError(err?.message || 'Sign in failed');
      toast.error('Sign in error, please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col md:flex-row gap-4 p-4 min-h-screen mt-5 bg-transparent pt-36 md:pt-28 lg:pt-24">
      {loading && <LoadingAnimation />}

      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-[-1] blur-sm brightness-30"
      >
        <source src="/videos/signin.MP4" type="video/mp4" />
      </video>

      {/* Form Wrapper */}
      <div className="relative flex items-center justify-center min-h-screen w-full mt-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-transparent backdrop-blur rounded-lg shadow-lg w-full max-w-6xl p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-white">
            {/* Left Side */}
            <div className="flex flex-col justify-center items-center mt-6 md:mt-0 text-center space-y-4">
              <h1 className="text-5xl font-[satisfy] text-[#f3cb50]">Welcome to DHMS</h1>
              <img
                src={signinpng}
                alt="Logo"
                className="w-80 rounded-md mx-auto shadow-lg object-contain mb-6"
              />
            </div>

            {/* Right Side */}
            <div className="flex flex-col justify-center items-center space-y-4">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#f3cb50]">
                We've missed you!
              </h2>
              <p className="text-lg text-white">Shop all your cultural needs</p>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-sm text-center space-y-4 relative"
              >
                <input
                  {...register('username', { required: 'Username is required!' })}
                  type="text"
                  placeholder="Username"
                  className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}

                <div className="relative">
                  <input
                    {...register('password', { required: 'Password is required!' })}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                  <button
                    type="button"
                    aria-label="Toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-3 right-4 text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password.message}</p>
                )}

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-yellow-500 cursor-pointer  text-black font-semibold rounded-lg hover:bg-yellow-600 transition duration-200"
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>

                <div className="flex gap-4 justify-center text-sm text-gray-400">
                  <button className="hover:underline cursor-pointer" type="button">
                    Forgot password?
                  </button>
                  <Link to="/register" className="hover:underline cursor-pointer">
                    Create an account
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
