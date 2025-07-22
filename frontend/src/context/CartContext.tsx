// src/context/CartContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';

interface CartContextType {
  cartCount: number;
  refreshCartCount: () => void;
}

const CartContext = createContext<CartContextType>({
  cartCount: 0,
  refreshCartCount: () => {},
});

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  const refreshCartCount = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch('http://localhost:5000/api/panier/count', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Cart fetch failed');
      const data = await res.json();
      setCartCount(data.count || 0);
    } catch (err) {
      console.warn('🔴 Failed to refresh cart count:', err);
    }
  };

  useEffect(() => {
    refreshCartCount();
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, refreshCartCount }}>
      {children}
    </CartContext.Provider>
  );
};
