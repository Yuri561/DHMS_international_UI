import React, { useState } from 'react';
import signinpng from '../../assets/signin1.jpg';
import { useForm } from 'react-hook-form';
import { userLogin } from '../AuthFolder/AuthFiles';
import { useNavigate, Link } from 'react-router-dom';
import LoadingAnimation from '../LoadingAnimation/LoadingAnimation';
import { useAuth } from '../Context/AuthContext';
import { useCart } from '../Context/CartContext';
import { GoogleLogin } from '@react-oauth/google';

import axios from 'axios';
interface FormData {
  username: string;
  password: string;

}

const SignIn: React.FC = () => {
  const { fetchCart } = useCart()
  // const {fetchSession} = useAuth()
  const [loading, setLoading] = useState<boolean>(false);
  // const [forgotPassword, setForgotPassword] = useState<boolean>(false);

  const { setIsAuthenticated } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [error, setError] = useState<string>();
  const navigate = useNavigate();

  // const onForgotPwdClick = async ()=>{
  //   setError('')
  //   setForgotPassword(true);
  // }
  const onSubmit = async (data: FormData) => {
    setError('');
    setLoading(true);
    try {
      const response = await userLogin(data);
      if (response.status === 200) {
        const user = response.data;
        // for debugging purposes 
        console.log('here is the response')
        setIsAuthenticated(true);
        localStorage.setItem('username', user.username);
        await fetchCart();
        navigate('/dashboard');
      } else {
        setError('Unable to sign in');
      }
    } catch (err: any) {
      console.log('Error occurred:', err);
      setError(err?.message || 'Sign in failed');
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className=" relative flex flex-col md:flex-row gap-4 p-4 min-h-screen mt-5 bg-transparent pt-36 md:pt-28 lg:pt-24">

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

      {/* Overlay Content */}
      <div className="relative flex items-center justify-center min-h-screen w-full mt-8 px-4 sm:px-6 lg:px-8">

        <div className="bg-transparent backdrop-blur rounded-lg shadow-lg w-full max-w-6xl p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-white ">
            {/* Left side */}
            <div className="flex flex-col justify-center items-center mt-6 md:mt-0 text-center space-y-4">
              <h1 className="text-5xl  font-[satisfy] text-[#f3cb50] ">

                Welcome to DHMS
              </h1>
              <img
                src={signinpng}
                alt="Logo"
                className="w-80  rounded-md mx-auto shadow-lg object-contain mb-6"
              />
            </div>

            {/* Right side - Form */}
            <div className="flex flex-col justify-center items-center space-y-4">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#f3cb50]">We've missed you!</h2>
              <p className="text-lg text-white">Shop all your cultural needs</p>

              <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm text-center space-y-4">
                <div className="text-left flex flex-col space-y-6 text-lg font-semibold text-[#f3cb50] mb-2">
                  {/* {forgotPassword && ( 
                    <input
                    {...register('username', { required: 'Username is required!' })}
                    type="name"
                    placeholder="Enter Username"
                    className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                  
                  )} */}
                  <input
                    {...register('username', { required: 'Username is required!' })}
                    type="name"
                    placeholder="Username"
                    className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                  {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}

                  <input
                    {...register('password', { required: 'Password is required!' })}
                    type="password"
                    placeholder="Password"
                    className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  {errors.password && (
                    <p className="text-red-500 text-sm">{errors.password.message}</p>
                  )}



                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 cursor-pointer bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-600 transition duration-200"
                    >
                    {loading ? "Signing In" : "Sign in"}
                  </button>

                  <div className="flex gap-4 justify-center text-sm text-gray-400">
                    <button className="hover:underline cursor-pointer">Forgot password?</button>
                    <Link to="/register" className="hover:underline cursor-pointer">
                      Create an account
                    </Link>
                  </div>

                  {/* <div className="flex items-center justify-center space-x-2 text-gray-400">
                    <GoogleLogin
                      onSuccess={async (credentialResponse) => {
                        const { credential } = credentialResponse;

                          try {
                            const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/google`, {credential
                            }, { withCredentials: true });

                            localStorage.setItem('username', res.data.username);
                            console.log(res.data.user.username) // debugging only
                            setIsAuthenticated(true);
                            await fetchCart();
                            // await fetchSession();
                            navigate('/dashboard');
                          } catch (err) {
                            console.error('Google login failed', err);
                          }
            
                      }}
                      onError={() => {
                        console.error('Login Failed');
                      }}
                    />
                  </div> */}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default SignIn