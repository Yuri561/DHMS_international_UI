import React from 'react';
// import { useAuth } from '../Context/AuthContext';
import { useForm } from 'react-hook-form';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
// import { useCart } from '../Context/CartContext';
import { ShoppingBagIcon } from 'lucide-react';

interface FormData {
  name: string;
  homeAddress: string;
  city: string;
  state: string;
  zipCode: number;
  cardNumber: number;
  expDate: number;
  cvc: number;
}

const CheckOut: React.FC = () => {
  // const setFormData = useState<FormData | null>(null);
  // const { setIsAuthenticated } = useAuth();
  // const {fetchCart} = useCart();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  // const [error, setError] = useState<string>();

  const onSubmit = (data: FormData) => {
    // setFormData(data);
    console.log('Delivery Info:', data);

  };

  return (
    <section className="min-h-screen bg-[#fdf9f3] flex items-center justify-center mt-5">
      {/* Main wrapper */}
      <div className="bg-white flex flex-col p-8 rounded-xl shadow-md w-full max-w-6xl">
        <h1 className="text-6xl md:text-8xl text-center font-[satisfy] text-[#2f2a28] mb-6">
          Checkout
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left side - Delivery Info */}
          <div className="flex flex-col items-start px-6">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
              {/* Name */}
              <div className="w-full">
                <label className="block text-left mb-1 font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  {...register('name', { required: 'Name is required' })}
                  className="w-full p-3 rounded-lg bg-gray-100 text-black border"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>

              {/* Address */}
              <div className="w-full">
                <label className="block text-left mb-1 font-medium text-gray-700">Home Address</label>
                <input
                  type="text"
                  {...register('homeAddress', { required: 'Address is required' })}
                  className="w-full p-3 rounded-lg bg-gray-100 text-black border"
                />
                {errors.homeAddress && (
                  <p className="text-red-500 text-sm">{errors.homeAddress.message}</p>
                )}
              </div>

              {/* City & State */}
              <div className="flex space-x-4 w-full">
                <div className="w-1/2">
                  <label className="block text-left mb-1 font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    {...register('city', { required: 'City is required' })}
                    className="w-full p-3 rounded-lg bg-gray-100 text-black border"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm">{errors.city.message}</p>
                  )}
                </div>

                <div className="w-1/2">
                  <label className="block text-left mb-1 font-medium text-gray-700">State</label>
                  <input
                    type="text"
                    {...register('state', { required: 'State is required' })}
                    className="w-full p-3 rounded-lg bg-gray-100 text-black border"
                  />
                  {errors.state && (
                    <p className="text-red-500 text-sm">{errors.state.message}</p>
                  )}
                </div>
              </div>

              {/* Zip Code */}
              <div className="w-full">
                <label className="block text-left mb-1 font-medium text-gray-700">Zip Code</label>
                <input
                  type="number"
                  {...register('zipCode', { required: 'Zip Code is required' })}
                  className="w-full p-3 rounded-lg bg-gray-100 text-black border"
                />
                {errors.zipCode && (
                  <p className="text-red-500 text-sm">{errors.zipCode.message}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-900 transition"
              >
                Save & Continue →
              </button>
            </form>
          </div>

          {/* Middle side (Arrow animation) */}
          <div className="flex flex-col items-center justify-between p-6 space-y-3 text-center">
            <DotLottieReact
              src="https://lottie.host/3500ad70-a591-46af-93e1-28f022b4877e/yOoc89YGES.lottie"
              className='w-40 h-40'
              loop
              autoplay
            />
            <DotLottieReact
              src="https://lottie.host/3500ad70-a591-46af-93e1-28f022b4877e/yOoc89YGES.lottie"
              className='w-40 h-40'
              loop
              autoplay
            />
          </div>
          {/* Right side (Payment Details Placeholder) */}
          <div className="flex flex-col items-center justify-center p-6 text-center w-full text-gray-500">
            <div className="flex flex-col p-3 space-y-3 w-full max-w-sm border shadow rounded-lg bg-white">
              <h2 className="text-left text-3xl">
                Order Summary
              </h2>
              <p className='text-md text-left text-slate-700 mt-2'>Review before continuing</p>
                <div className='flex flex-col justify-between border-t gap-x-3 gap-4 mt-4'>
                  <div className="flex justify-between mt-3 items-center">
                  <ShoppingBagIcon className='text-gray-400'/>
                  <span className=''>Shea Butter</span>
                  <span>x4</span>
                  <span>$10.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                  <ShoppingBagIcon className='text-gray-400'/>
                  <span>Shea Butter</span>
                  <span>x2</span>
                  <span>$10.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                  <ShoppingBagIcon className='text-gray-400'/>
                  <span>Shea Butter</span>
                  <span>x10</span>
                  <span>$10.00</span>
                  </div>
                  
                 

                </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckOut;
