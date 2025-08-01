import React, { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import { Trash2} from 'lucide-react';
import { useCart } from '../Context/CartContext';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useForm } from 'react-hook-form';

interface FormData {
  name: string;
  homeAddress: string;
  city: string;
  state: string;
  zipCode: number;
}

const Cart: React.FC = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { cart, fetchCart, removeFromCart, updateQty } = useCart();
  const cartItems = cart || [];
  // const [formData, setFormData] = useState<FormData | null>(null);
  // const navigate = useNavigate();

  const subtotal: number = cartItems.reduce((acc: number, item: any) => {
    const price = parseFloat(item.price) || 0;
    const quantity = parseInt(item.quantity) || 0;
    return acc + price * quantity;
  }, 0);

  const deliveryFee = 4.99;
  const total = subtotal + deliveryFee;

  const {
    register,
    handleSubmit,
   
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      const line_items = cartItems.map((item: any) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(parseFloat(item.price) * 100),
        },
        quantity: parseInt(item.quantity),
      }));

      const res = await axios.post(`${API_URL}/checkout/create-checkout-session`, {
        ...data,
        line_items,
      });

      if (res.data.url) {
        window.location = res.data.url;
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to initiate checkout');
    }
  };

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <div className='bg-[#fdf9f3] min-h-screen max-w-8xl px-4 py-2 md:px-10 mt-28 pt-36 md:pt-28 lg:pt-24 text-white'>
      <h1 className='text-6xl md:text-8xl text-center font-[satisfy] text-[#2f2a28] mb-6'>Your Cart</h1>

      <div className='bg-white rounded-xl p-6 text-black max-w-6xl mx-auto flex flex-col gap-8 shadow-lg'>
        {/* Cart Items */}
        <div className='space-y-4'>
          <div className='hidden md:grid grid-cols-5 font-semibold border-b pb-2'>
            <span>Product</span>
            <span>Name</span>
            <span>Quantity</span>
            <span>Price</span>
            <span>Action</span>
          </div>

          {cartItems.length === 0 ? (
            <p className='text-center text-gray-500'>Your cart is empty.</p>
          ) : (
            cartItems.map((item: any, index: number) => (
              <div key={item._id || index} className='grid grid-cols-2 md:grid-cols-5 items-center text-left border-b py-3'>
                <img src={item.image} alt={item.name} className='w-16 h-16 object-cover mb-2 rounded mx-auto' />
                <span className='md:block'>{item.name}</span>

                <div className='flex justify-center gap-2'>
                  {/*sub onclick*/}
                  <button
                    onClick={() => {
                      const qty = parseInt(item.quantity);
                      if (qty > 1) {
                        updateQty(item._id, qty - 1);
                      } else {
                        removeFromCart(item._id);
                        toast.success("Removed item");
                      }
                    }}
                    className='px-2 py-1 bg-gray-200 cursor-pointer text-left hover:scale-105 active:scale-105 rounded'
                  >
                    -

                  </button>
                  <span>{item.quantity}</span>
                  {/*add onclick*/}
                  <button
                    onClick={() => {
                      const qty = parseInt(item.quantity);
                      if (qty < 50) {
                        updateQty(item._id, qty + 1);
                        toast.success("Quantity increased");
                      }
                    }}
                    className='px-2 py-1 bg-gray-200 cursor-pointer hover:scale-105 active:scale-105 rounded'
                  >
                    +
                  </button>
                </div>

                <span className='hidden md:block'>${(parseFloat(item.price) || 0).toFixed(2)}</span>
                  {/*Trash onclick*/}
                <button
                  onClick={() => removeFromCart(item._id)}
                  className='text-red-500 cursor-pointer hover:scale-105 hover:text-red-700 mx-auto'
                >
                  <Trash2 className='w-5 h-5' />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Delivery Info and Order Summary */}
        <form onSubmit={handleSubmit(onSubmit)} className='grid md:grid-cols-2 gap-6 mt-6'>
          <div className='space-y-6'>
            <h2 className='text-2xl font-bold'>Delivery Info</h2>

            <input type='text' placeholder='Name' {...register('name', { required: true })} className='w-full p-3 rounded-lg bg-gray-100 border' />
            <input type='text' placeholder='Address' {...register('homeAddress', { required: true })} className='w-full p-3 rounded-lg bg-gray-100 border' />
            <div className='flex gap-4'>
              <input type='text' placeholder='City' {...register('city', { required: true })} className='w-1/2 p-3 rounded-lg bg-gray-100 border' />
              <input type='text' placeholder='State' {...register('state', { required: true })} className='w-1/2 p-3 rounded-lg bg-gray-100 border' />
            </div>
            <input type='number' placeholder='Zip Code' {...register('zipCode', { required: true })} className='w-full p-3 rounded-lg bg-gray-100 border' />
          </div>

          <div className='bg-gray-100 p-6 rounded-lg flex flex-col justify-between'>
            <div>
              <h2 className='text-lg font-semibold mb-4'>Order Summary</h2>
              <div className='flex justify-between mb-2'><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className='flex justify-between mb-2'><span>Discount</span><span>$0.00</span></div>
              <div className='flex justify-between mb-2'><span>Delivery Fee</span><span>${deliveryFee.toFixed(2)}</span></div>
              <div className='flex justify-between text-lg font-bold mt-4'><span>Total</span><span>${total.toFixed(2)}</span></div>
            </div>
            <button type='submit' className='w-full mt-6 cursor-pointer bg-[#f3cb50] text-black py-2 rounded-lg hover:scale-105 transition-transform'>Checkout Now</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Cart;
