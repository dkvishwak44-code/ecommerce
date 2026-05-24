import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // Add more slices here as your app grows:
    // products: productsReducer,
    // cart: cartReducer,
    // orders: ordersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types if you use non-serializable data
        ignoredActions: ['auth/loginSuccess'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});
