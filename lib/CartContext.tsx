"use client";

import { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import { Product } from "./products";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  isCheckoutOpen: boolean;
}

type CartAction =
  | { type: "ADD_ITEM"; product: Product }
  | { type: "REMOVE_ITEM"; productId: number }
  | { type: "UPDATE_QUANTITY"; productId: number; quantity: number }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" }
  | { type: "OPEN_CHECKOUT" }
  | { type: "CLOSE_CHECKOUT" };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      if (action.product.stock <= 0) return state;
      const existing = state.items.find((i) => i.product.id === action.product.id);
      if (existing) {
        if (existing.quantity >= action.product.stock) return state;
        return {
          ...state,
          items: state.items.map((i) =>
            i.product.id === action.product.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return { ...state, items: [...state.items, { product: action.product, quantity: 1 }] };
    }
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((i) => i.product.id !== action.productId) };
    case "UPDATE_QUANTITY":
      if (action.quantity <= 0) {
        return { ...state, items: state.items.filter((i) => i.product.id !== action.productId) };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.product.id === action.productId
            ? { ...i, quantity: Math.min(action.quantity, i.product.stock) }
            : i
        ),
      };
    case "CLEAR_CART":
      return { ...state, items: [] };
    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen };
    case "OPEN_CART":
      return { ...state, isOpen: true, isCheckoutOpen: false };
    case "CLOSE_CART":
      return { ...state, isOpen: false };
    case "OPEN_CHECKOUT":
      return { ...state, isCheckoutOpen: true, isOpen: false };
    case "CLOSE_CHECKOUT":
      return { ...state, isCheckoutOpen: false };
    default:
      return state;
  }
}

interface CartContextType {
  state: CartState;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false,
    isCheckoutOpen: false,
  });

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = state.items.reduce(
    (sum, item) => sum + item.product.retailPrice * item.quantity,
    0
  );

  const value: CartContextType = {
    state,
    addToCart: (product) => dispatch({ type: "ADD_ITEM", product }),
    removeFromCart: (productId) => dispatch({ type: "REMOVE_ITEM", productId }),
    updateQuantity: (productId, quantity) =>
      dispatch({ type: "UPDATE_QUANTITY", productId, quantity }),
    clearCart: () => dispatch({ type: "CLEAR_CART" }),
    openCart: () => dispatch({ type: "OPEN_CART" }),
    closeCart: () => dispatch({ type: "CLOSE_CART" }),
    openCheckout: () => dispatch({ type: "OPEN_CHECKOUT" }),
    closeCheckout: () => dispatch({ type: "CLOSE_CHECKOUT" }),
    totalItems,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
