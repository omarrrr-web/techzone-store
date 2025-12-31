import { create } from 'zustand';

// Definimos cómo se ve un producto en el carrito
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface CartState {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
}

export const useCart = create<CartState>((set) => ({
  cart: [], // Empieza vacío
  
  // Función para agregar
  addToCart: (product) => set((state) => ({ 
    cart: [...state.cart, product] 
  })),

  // Función para quitar
  removeFromCart: (id) => set((state) => ({
    cart: state.cart.filter(item => item.id !== id)
  })),

  // Limpiar todo
  clearCart: () => set({ cart: [] }),
}));