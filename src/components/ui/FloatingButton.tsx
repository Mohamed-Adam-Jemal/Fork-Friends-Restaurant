import { useState, useEffect, useRef } from "react";

export default function FloatingButton({ onClick, children }: any) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [bottomOffset, setBottomOffset] = useState(16); // initial offset from bottom

  useEffect(() => {
    const handleScroll = () => {
      if (!buttonRef.current) return;

      const viewportHeight = window.innerHeight;
      const rect = buttonRef.current.getBoundingClientRect();
      
      // Move button dynamically if it would be hidden by browser UI
      const newBottom = Math.max(16, viewportHeight - rect.bottom - 16);
      setBottomOffset(newBottom);
    };

    window.addEventListener("resize", handleScroll);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("resize", handleScroll);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      ref={buttonRef}
      className="fixed left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300"
      style={{ bottom: `${bottomOffset}px` }}
    >
      {children}
    </div>
  );
}
