import React, { useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { useCart } from '../Context/CartContext';
import toast from 'react-hot-toast';

const Cart: React.FC = () => {
  const { cart, fetchCart, removeFromCart, updateQty } = useCart();
  const cartItems = cart || [];

  const subtotal: number = cartItems.reduce((acc: number, item: any) => {
    const price = parseFloat(item.price) || 0;
    const quantity = parseInt(item.quantity) || 0;
    return acc + price * quantity;
  }, 0);

  const deliveryFee = 4.99;
  const total = subtotal + deliveryFee;

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <div className='bg-[#fdf9f3] min-h-screen px-4 py-10 md:px-10 mt-28 pt-36 md:pt-28 lg:pt-24 text-white'>
      <h1 className='text-[#f3cb50] text-5xl sm:text-8xl font-[satisfy] text-center mb-8'>Your Cart</h1>

     <div className='bg-white rounded-xl p-6 text-black max-w-6xl mx-auto flex flex-col md:flex-row gap-8 shadow-lg'>

        {/* Cart Items */}
        <div className='w-full md:w-2/3 space-y-4'>
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
              <div key={item._id || index} className='grid grid-cols-2 md:grid-cols-5 items-center text-center border-b py-3'>
                <img src={item.image} alt={item.name} className='w-16 h-16 object-cover rounded mx-auto' />
                <span className='md:block'>{item.name}</span>

                <div className='flex justify-center items-center gap-2'>
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
                    className='px-2 py-1 bg-gray-200 cursor-pointer hover:scale-105 active:scale-105 rounded'
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
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

        {/* Order Summary */}
        <div className='w-full md:w-1/3 bg-gray-100 p-6 rounded-lg'>
          <h2 className='text-lg font-semibold mb-4'>Order Summary</h2>
          <div className='flex justify-between mb-2'>
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className='flex justify-between mb-2'>
            <span>Discount</span>
            <span>$0.00</span>
          </div>
          <div className='flex justify-between mb-2'>
            <span>Delivery Fee</span>
            <span>${deliveryFee.toFixed(2)}</span>
          </div>
          <div className='flex justify-between text-lg font-bold mt-4'>
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button className='w-full mt-6 cursor-pointer bg-[#f3cb50] text-black py-2 rounded-lg hover:scale-105 transition-transform'>
            Checkout Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
