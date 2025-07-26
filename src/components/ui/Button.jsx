// components/ui/Button.jsx
"use client";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  onClick,
  type = "button",
  className = "",
  ...props
}) {
  const baseStyles = "font-semibold rounded-xl transition-all duration-300 ease-out transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

  const variants = {
    // Primary button - ivory/white background with burgundy text (matches theme)
    primary: `
      bg-gradient-to-r from-white via-ivory to-white/95 
      text-burgundy border border-gold/30
      hover:from-ivory hover:via-white hover:to-ivory 
      hover:scale-105 hover:shadow-lg hover:shadow-gold/20
      focus:ring-burgundy/30
      disabled:from-white/50 disabled:via-ivory/50 disabled:to-white/50
    `,
    
    // Secondary button - matches the page background gradient
    secondary: `
      bg-gradient-to-br from-ivory via-white to-ivory/90 
      text-burgundy border border-gold/30
      hover:from-ivory/90 hover:via-white hover:to-ivory 
      hover:scale-105 hover:shadow-lg hover:shadow-gold/20
      focus:ring-burgundy/30
      disabled:from-ivory/50 disabled:via-white/50 disabled:to-ivory/50
    `,
    
    // Burgundy button - burgundy background with white text (moved from secondary)
    burgundy: `
      bg-gradient-to-r from-burgundy via-burgundy to-burgundy/90 
      text-white border border-burgundy/20
      hover:from-burgundy/90 hover:via-burgundy hover:to-burgundy 
      hover:scale-105 hover:shadow-lg hover:shadow-burgundy/25
      focus:ring-burgundy/50
      disabled:from-burgundy/50 disabled:via-burgundy/50 disabled:to-burgundy/50
    `,
    
    // Gold accent button - gold background with burgundy text
   gold: `
  cursor-pointer
  px-6 py-3 rounded-lg font-semibold 
  hover:bg-yellow-400 
  transition-shadow shadow-md hover:shadow-lg
  focus:ring-gold/50
  disabled:bg-gold/50 disabled:text-burgundy/50
`,


    // Outline button - transparent with burgundy border
    outline: `
      bg-transparent text-burgundy border-2 border-burgundy
      hover:bg-burgundy hover:text-white hover:scale-105 hover:shadow-lg
      focus:ring-burgundy/50
      disabled:border-burgundy/50 disabled:text-burgundy/50
    `,
    
    // Ghost button - minimal styling with theme colors
    ghost: `
      bg-transparent text-charcoal border border-transparent
      hover:bg-ivory hover:text-burgundy hover:scale-105
      focus:ring-gold/30
      disabled:text-charcoal/50
    `,
    // Danger button - for delete/cancel actions
    danger: `
      bg-gradient-to-r from-red-500 via-red-500 to-red-600 
      text-white border border-red-500/20
      hover:from-red-600 hover:via-red-500 hover:to-red-500 
      hover:scale-105 hover:shadow-lg hover:shadow-red-500/25
      focus:ring-red-500/50
      disabled:from-red-500/50 disabled:via-red-500/50 disabled:to-red-600/50
    `
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-12 py-5 text-xl"
  };

  const combinedClassName = `
    ${baseStyles}
    ${variants[variant]}
    ${sizes[size]}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={combinedClassName}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-3 opacity-70"></div>
          <span className="opacity-70">Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}

// Usage Examples:
/*
// Primary button (ivory/white with burgundy text - matches theme)
<Button variant="primary" size="lg" onClick={handleClick}>
  Confirm Reservation
</Button>

// Secondary button (matches page background gradient)
<Button variant="secondary" size="md" onClick={handleClick}>
  Learn More
</Button>

// Burgundy button (solid burgundy with white text)
<Button variant="burgundy" size="md" onClick={handleClick}>
  View Menu
</Button>

// Gold accent button (for special actions)
<Button variant="gold" size="md" onClick={handleClick}>
  Special Offer
</Button>

// Outline button
<Button variant="outline" size="md" onClick={handleClick}>
  Cancel
</Button>

// With loading state
<Button variant="primary" loading={isSubmitting} disabled={isSubmitting}>
  {isSubmitting ? 'Processing...' : 'Submit'}
</Button>

// Ghost button
<Button variant="ghost" size="sm" onClick={handleClick}>
  Subtle Action
</Button>

// Custom className
<Button variant="primary" className="w-full" onClick={handleClick}>
  Full Width Button
</Button>
*/