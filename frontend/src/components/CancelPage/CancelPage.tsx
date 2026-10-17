import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ShoppingBag } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
const CancelPage: React.FC = () => {

    const navigate = useNavigate();
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <div className="flex flex-col justify-center items-center bg-white rounded-2xl shadow-lg p-10 w-full max-w-3xl text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-slate-700 mb-4">
          Your Order was unsucessful 
        </h1>
        <p className="mt-2 text-xl text-gray-600 mb-6">
          Your payment was not completed. Please try again later.
        </p>

        <DotLottieReact
          className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 mb-8"
          src="https://lottie.host/4b144667-1270-4d3e-8607-786a2a31fa2d/23IXgAdub9.lottie"
          loop
          autoplay
        />

        <div className="flex gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 cursor-pointer bg-slate-700 text-white px-5 py-3 rounded-md hover:bg-slate-800 transition"
          >
            <Home className="w-5 h-5" />
            Dashboard
          </button>

          <button
            onClick={() => navigate('/shop')}
            className="flex items-center gap-2 cursor-pointer bg-yellow-500 text-black px-5 py-3 rounded-md hover:bg-yellow-600 transition"
          >
            <ShoppingBag className="w-5 h-5" />
            Shop
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelPage;