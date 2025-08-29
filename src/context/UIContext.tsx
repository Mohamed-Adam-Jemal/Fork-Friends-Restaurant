"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type UIContextType = {
  isCartOpen: boolean;
  isChatOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
};

const UIContext = createContext<UIContextType | undefined>(undefined);

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) throw new Error("useUI must be used within a UIProvider");
  return context;
};

export function UIProvider({ children }: { children: ReactNode }) {
  const [isCartOpen, setCartOpen] = useState(false);
  const [isChatOpen, setChatOpen] = useState(false);

  const openCart = () => {
    setCartOpen(true);
    setChatOpen(false); // 🔥 auto-close chat
  };

  const closeCart = () => setCartOpen(false);
  const toggleCart = () => {
    setCartOpen((prev) => {
      if (!prev) setChatOpen(false); // 🔥 close chat if opening cart
      return !prev;
    });
  };

  const openChat = () => {
    setChatOpen(true);
    setCartOpen(false); // 🔥 auto-close cart
  };

  const closeChat = () => setChatOpen(false);
  const toggleChat = () => {
    setChatOpen((prev) => {
      if (!prev) setCartOpen(false); // 🔥 close cart if opening chat
      return !prev;
    });
  };

  return (
    <UIContext.Provider
      value={{
        isCartOpen,
        isChatOpen,
        openCart,
        closeCart,
        toggleCart,
        openChat,
        closeChat,
        toggleChat,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}
