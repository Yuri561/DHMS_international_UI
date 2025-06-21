import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import {toast} from 'react-hot-toast'

const API_URL = import.meta.env.VITE_API_URL;
const CartContext = createContext<any>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {

    const [cart, setCart] = useState<any[]>([]);

    const fetchCart = async () => {
        try {
            const res = await axios.get(`${API_URL}/cart`, { withCredentials: true });
            setCart(res.data.cart);
            
        } catch (err) {
            console.error('Fetch cart failed', err);
        }
    };

    type Product = {
        id: number;
        name: string;
        price: number;
        brand: string;
        imageUrl: string;
        category: string;
        rating: number;
        color: string;
        quantity: number;
        totalPrice: number;
    };

    const addToCart = async (product: Product) => {
        try {
            await axios.post(
                `${API_URL}/cart/add`,
                {
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                    brand: product.brand,
                    image: product.imageUrl,
                    category: product.category,
                    rating: product.rating,
                    color: product.color,
                    quantity: product.quantity,
                    totalPrice: product.totalPrice,
                },
                { withCredentials: true }
            );

            await fetchCart(); // refresh state
        } catch (err) {
            console.error('Add to cart failed', err);
        }
    };
    const cartQuantity = cart.reduce((total, item) => total + item.quantity, 0);

    const removeFromCart = async (itemId: any) => {
        try {
            await axios.delete(
                `${API_URL}/cart/remove/${itemId}`, {
                withCredentials: true
            }
            );
            fetchCart();
            toast.success("successfully removed item")
        } catch (err) {
            console.error('Remove failed', err);
        }
    };
    const updateQty = async (itemId: any, qty: number) => {
        try{
            await axios.patch(`
            ${API_URL}/cart/update/${itemId}`,
                { quantity: qty },
                { withCredentials: true })
            }
        catch (err) {
            console.error("error updating item", err)
        }
    }


    useEffect(() => {
        fetchCart();
    }, []);

    return (
        <CartContext.Provider value={{ cart, addToCart, cartQuantity, removeFromCart, fetchCart, updateQty }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
