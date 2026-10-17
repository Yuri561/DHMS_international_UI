// this is where our Redux store will live for our shopping cart

import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';

// Create a Redux store
export const store = configureStore({
    reducer: {
        cart: cartReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;