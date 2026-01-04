"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Product } from "@/types";

export type SelectedVariations = Record<string, string>;

export type CartItem = {
  product: Product;
  qty: number;
  selectedVariations?: SelectedVariations;
};

type CartContextType = {
  items: CartItem[];
  addItem: (product: Product, qty?: number, variations?: SelectedVariations) => void;
  updateQty: (productId: string, qty: number, variations?: SelectedVariations) => void;
  removeItem: (productId: string, variations?: SelectedVariations) => void;
  updateItemVariation: (productId: string, oldVar?: SelectedVariations, newVar?: SelectedVariations) => void;
  getTotalQty: () => number;
  getTotal: () => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cartItems");
      if (saved) setItems(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cartItems", JSON.stringify(items));
    }
  }, [items]);

  const addItem = (product: Product, qty = 1, variations?: SelectedVariations) => {
    setItems((prev) => {
      const idx = prev.findIndex(
        (i) =>
          i.product.id === product.id &&
          JSON.stringify(i.selectedVariations || {}) === JSON.stringify(variations || {})
      );
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx].qty += qty;
        return copy;
      }
      return [...prev, { product, qty, selectedVariations: variations }];
    });
  };

  const updateQty = (productId: string, qty: number, variations?: SelectedVariations) => {
    setItems((prev) =>
      prev.map((i) =>
        i.product.id === productId &&
        JSON.stringify(i.selectedVariations || {}) === JSON.stringify(variations || {})
          ? { ...i, qty: Math.max(1, qty) }
          : i
      )
    );
  };

  const removeItem = (productId: string, variations?: SelectedVariations) => {
    setItems((prev) =>
      prev.filter(
        (i) =>
          !(i.product.id === productId &&
          JSON.stringify(i.selectedVariations || {}) === JSON.stringify(variations || {}))
      )
    );
  };

  const updateItemVariation = (productId: string, oldVar?: SelectedVariations, newVar?: SelectedVariations) => {
    setItems((prev) =>
      prev.map((i) =>
        i.product.id === productId &&
        JSON.stringify(i.selectedVariations || {}) === JSON.stringify(oldVar || {})
          ? { ...i, selectedVariations: newVar }
          : i
      )
    );
  };

  const getTotalQty = () => items.reduce((sum, i) => sum + i.qty, 0);
  const getTotal = () =>
    items.reduce((sum, i) => sum + (i.product.discountPrice ?? i.product.price) * i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, updateQty, removeItem, updateItemVariation, getTotalQty, getTotal }}>
      {children}
    </CartContext.Provider>
  );
};
