import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

interface CartItem {
  productId: string;
  name: string;
  price: number;
  totalPrice: number;
  quantity: number;
  image: string;
  color: string;
  rating: string;
  category?: string;
}

interface CartState {
  itemsList: CartItem[];
  totalQuantity: number;
  showCart: boolean;
  loading: boolean;
}

const initialState: CartState = {
  itemsList: [],
  totalQuantity: 0,
  showCart: false,
  loading: false,
};

// Fetch user's cart from backend
export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
  const response = await axios.get(`${API_URL}/cart`, { withCredentials: true });
  return response.data.items || [];
});

// Add or update item in cart
export const addToCartServer = createAsyncThunk(
  'cart/addToCartServer',
  async (item: CartItem) => {
    const response = await axios.post(`${API_URL}/cart/add`, item, { withCredentials: true });
    return response.data.items;
  }
);

// Remove item from cart
export const removeFromCartServer = createAsyncThunk(
  'cart/removeFromCartServer',
  async (productId: string, { getState }) => {
    const state: any = getState();
    const item = state.cart.itemsList.find((i: any) => i.productId === productId);
    const color = item?.color;

    const response = await axios.delete(`${API_URL}/cart/remove/${productId}?color=${color}`, {
      withCredentials: true,
    });

    return response.data.items;
  }
);

// Clear cart on logout
export const clearCartServer = createAsyncThunk('cart/clearCartServer', async () => {
  await axios.delete(`${API_URL}/cart/clear`, { withCredentials: true });
  return [];
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setShowCart(state) {
      state.showCart = !state.showCart;
    },
    updateQty(state, action: PayloadAction<{ id: string; quantity: number }>) {
      const item = state.itemsList.find(i => i.productId === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
        item.totalPrice = item.price * item.quantity;
      }
      state.totalQuantity = state.itemsList.reduce((sum, item) => sum + item.quantity, 0);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action: PayloadAction<CartItem[]>) => {
        state.itemsList = action.payload;
        state.totalQuantity = action.payload.reduce((sum, item) => sum + item.quantity, 0);
      })
      .addCase(addToCartServer.fulfilled, (state, action: PayloadAction<CartItem[]>) => {
        state.itemsList = action.payload;
        state.totalQuantity = action.payload.reduce((sum, item) => sum + item.quantity, 0);
      })
      .addCase(removeFromCartServer.fulfilled, (state, action: PayloadAction<CartItem[]>) => {
        state.itemsList = action.payload;
        state.totalQuantity = action.payload.reduce((sum, item) => sum + item.quantity, 0);
      })
      .addCase(clearCartServer.fulfilled, (state) => {
        state.itemsList = [];
        state.totalQuantity = 0;
      });
  },
});

export const { setShowCart, updateQty } = cartSlice.actions;
export default cartSlice.reducer;
