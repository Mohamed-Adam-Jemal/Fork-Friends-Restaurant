import { useRef } from "react";

export function useFlyToCart() {
  const cartRef = useRef<HTMLButtonElement | null>(null);
  
  const flyToCart = (imgElement: HTMLImageElement) => {
    if (!imgElement || !cartRef.current) {
      console.log("Missing elements:", { imgElement: !!imgElement, cartRef: !!cartRef.current });
      return;
    }

    try {
      const imgRect = imgElement.getBoundingClientRect();
      const cartRect = cartRef.current.getBoundingClientRect();
      
      // Ensure both elements are visible
      if (imgRect.width === 0 || imgRect.height === 0 || cartRect.width === 0 || cartRect.height === 0) {
        console.log("Elements not visible:", { imgRect, cartRect });
        return;
      }

      const clone = imgElement.cloneNode(true) as HTMLImageElement;
      
      // Set initial styles
      Object.assign(clone.style, {
        position: "fixed",
        left: `${imgRect.left}px`,
        top: `${imgRect.top}px`,
        width: `${imgRect.width}px`,
        height: `${imgRect.height}px`,
        zIndex: "9999",
        borderRadius: "12px",
        pointerEvents: "none",
        transition: "none" // Start without transition
      });

      document.body.appendChild(clone);
      
      // Force reflow to ensure initial position is set
      clone.offsetHeight;
      
      // Add transition and animate
      clone.style.transition = "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
      clone.style.left = `${cartRect.left + cartRect.width / 2 - imgRect.width / 4}px`;
      clone.style.top = `${cartRect.top + cartRect.height / 2 - imgRect.height / 4}px`;
      clone.style.width = `${imgRect.width / 2}px`;
      clone.style.height = `${imgRect.height / 2}px`;
      clone.style.opacity = "0.3";
      clone.style.transform = "scale(0.5)";

      // Add cart shake animation
      if (cartRef.current) {
        cartRef.current.style.transform = "scale(1.1)";
        setTimeout(() => {
          if (cartRef.current) {
            cartRef.current.style.transform = "scale(1)";
          }
        }, 200);
      }

      // Remove clone after animation
      setTimeout(() => {
        if (clone.parentNode) {
          clone.remove();
        }
      }, 800);
      
    } catch (error) {
      console.error("Fly to cart animation failed:", error);
    }
  };

  return { cartRef, flyToCart };
}