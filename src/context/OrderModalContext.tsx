// context/ModalContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type ModalContextType = {
  openOrder: () => void;
  closeOrder: () => void;
  isOrderOpen: boolean;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isOrderOpen, setIsOrderOpen] = useState(false);

  const openOrder = () => setIsOrderOpen(true);
  const closeOrder = () => setIsOrderOpen(false);

  return (
    <ModalContext.Provider value={{ openOrder, closeOrder, isOrderOpen }}>
      {children}
    </ModalContext.Provider>
  );
}

export const useModal = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be inside ModalProvider");
  return ctx;
};
