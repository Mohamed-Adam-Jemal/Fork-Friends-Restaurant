// components/ui/Modal.tsx
"use client";

import { ReactNode } from "react";
import Button from "./Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-8 text-center">
        <h2 className="!text-2xl font-bold mb-4">{title}</h2>
        <div className="mb-6">{children}</div>
        <Button onClick={onClose} variant="primary">
          Close
        </Button>
      </div>
    </div>
  );
}
