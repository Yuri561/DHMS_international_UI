import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { userRegister } from '../AuthFolder/AuthFiles';
import { Eye, EyeOff, Mail } from 'lucide-react';
import signupng from '../../assets/signup.jpg'

import LoadingAnimation from '../LoadingAnimation/LoadingAnimation';
interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  shippingAddress: string;
}

const SignUp: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string>();

  const password = watch('password');


  const passwordStrength = useMemo(() => {
    if (!password) return { label: '', color: '' };

    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const conditions = [hasUpper, hasLower, hasNumber, hasSymbol].filter(Boolean).length;

    if (password.length >= 8 && conditions >= 3) {
      return { label: '✅ Strong', color: 'text-green-600' };
    } else if (password.length >= 6 && conditions >= 2) {
      return { label: '⚠️ Medium', color: 'text-yellow-500' };
    } else {
      return { label: '❌ Weak', color: 'text-red-500' };
    }
  }, [password]);

  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async (data: FormData) => {
    setError('');
    setLoading(true);
    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await userRegister(data);
      if (response.status === 201) {
        localStorage.setItem('user', JSON.stringify(response.data));
        navigate('/login');
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
    finally{
        setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col md:flex-row gap-4 p-4 min-h-screen mt-5 bg-transparent pt-36 md:pt-28 lg:pt-24">
        {loading && <LoadingAnimation/>}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-[-1] blur-sm brightness-30"
      >
        <source src='../../../public/videos/signin.MP4' type="video/mp4" />
      </video>

      <div className="relative flex items-center justify-center min-h-screen w-full mt-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-transparent backdrop-blur rounded-lg shadow-lg w-full max-w-6xl p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-white">
            <div className="flex flex-col justify-center items-center mt-6 md:mt-0 text-center space-y-4">
              <h1 className="text-5xl font-[satisfy] text-[#f3cb50]">Your journey starts here</h1>
              <img src={signupng} alt="Sign up" className="w-80 rounded-md mx-auto shadow-lg object-contain mb-6" />
            </div>

            <div className="flex flex-col justify-center items-center space-y-4">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#f3cb50]">Become a member</h2>
              <p className="text-lg text-white">The journey to DHMS starts here!</p>

              <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm text-center space-y-4">
                <div className="text-left flex flex-col space-y-6 text-lg font-semibold text-[#f3cb50] mb-2">
                  <input
                    {...register('email', { required: 'Email is required!' })}
                    type="email"
                    placeholder="Email Address"
                    className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

                  <div className="relative">
                    <input
                      {...register('password', { required: 'Password is required!' })}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-3 right-4 text-white"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                  {passwordStrength.label && (
                    <p className={`text-sm ${passwordStrength.color}`}>Password Strength: {passwordStrength.label}</p>
                  )}

                  <div className="relative">
                    <input
                      {...register('confirmPassword', {
                        required: 'Confirm your password!',
                        validate: (val) => val === watch('password') || 'Passwords do not match',
                      })}
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="Confirm Password"
                      className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute top-3 right-4 text-white"
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}

                  
                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  <button
                    type="submit"
                    className="w-full py-3 cursor-pointer bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-600 transition duration-200"
                  >
                    Become a Member
                  </button>

                  <div className="flex gap-4 justify-center text-sm text-gray-400">
                    <p className="hover:underline cursor-pointer">Forgot password?</p>
                    <Link to="/login" className="hover:underline cursor-pointer">Sign in instead?</Link>
                  </div>

                  <div className="flex items-center justify-center space-x-2 text-gray-400">
                    <Mail className="w-6 h-6 text-yellow-500" />
                    <button
                      type="button"
                      className="p-2 bg-yellow-500 cursor-pointer text-black font-semibold rounded-lg hover:bg-yellow-600 transition duration-200"
                    >
                      Sign in with Google
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
