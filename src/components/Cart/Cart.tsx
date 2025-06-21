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
    const fetchData = async () => {
      try {
        await fetchCart();
      } catch (err) {
        console.error('Error fetching cart:', err);
      }
    };
    fetchData();
  }, [fetchCart]);

  return (
    <div className='bg-black flex flex-col items-center justify-center px-2 md:px-6 py-10 mt-28 pt-36 md:pt-28 lg:pt-24'>
      <h1 className='text-[#f3cb50] text-3xl font-bold mb-8'>YOUR CART</h1>

      <div className='bg-white max-w-6xl rounded-xl p-6 w-full flex flex-col md:flex-row gap-6'>
        {/* Cart Items */}
        <div className='w-full md:w-2/3'>
          <div className='border rounded-lg'>
            <div className='grid grid-cols-4 p-4 border-b text-center font-semibold'>
              <span>Product</span>
              <span>Quantity</span>
              <span>Price</span>
              <span>Action</span>
            </div>

            {cartItems.length === 0 ? (
              <div className='text-center p-4'>
                <p className='text-gray-500'>Your cart is empty.</p>
              </div>
            ) : (
              cartItems.map((item: any, index: number) => (
                <div
                  key={item._id || index}
                  className='grid grid-cols-4 items-center text-center p-4 border-b'
                >
                  <img
                    src={item.image}
                    alt={item.name || 'Product image'}
                    className='w-16 h-16 mx-auto rounded'
                  />

                  <div className='flex items-center justify-center gap-2'>
                    <button
                      onClick={() => {
                        const qty = parseInt(item.quantity) || 0;
                        if (qty > 1) {
                          updateQty(item._id, qty - 1);
                        } else {
                          removeFromCart(item._id); // delete if quantity is 1
                          toast.success("successfully removed quantity")
                        }
                      }}
                      className='px-2 py-1 cursor-pointer bg-gray-200 rounded'
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() => {
                        const qty = parseInt(item.quantity) || 0;
                        if (qty < 50) {
                          updateQty(item._id, qty + 1);
                          toast.success("successfully added quantity")
                        }
                      }}
                      className='px-2 py-1 cursor-pointer bg-gray-200 rounded'
                    >
                      +
                    </button>
                  </div>

                  <span>${(parseFloat(item.price) || 0).toFixed(2)}</span>

                  <button
                    onClick={() => removeFromCart(item._id)}
                    className='text-red-500 cursor-pointer hover:text-red-700'
                  >
                    <Trash2 className='w-5 h-5 mx-auto' />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className='w-full md:w-1/3'>
          <div className='border rounded-lg p-4'>
            <h2 className='text-lg font-semibold mb-4'>Order Summary</h2>
            <div className='flex justify-between mb-2'>
              <span>SubTotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className='flex justify-between mb-2'>
              <span>Discount</span>
              <span>$0.00</span>
            </div>
            <div className='flex justify-between mb-4'>
              <span>Delivery Fee</span>
              <span>${deliveryFee.toFixed(2)}</span>
            </div>
            <div className='flex justify-between text-lg font-bold mb-6'>
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button className='w-full bg-[#f3cb50] cursor-pointer text-black py-2 rounded-lg shadow hover:opacity-90 hover:scale-105 transition-transform'>
              Checkout Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
