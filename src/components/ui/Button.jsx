import { cn } from '../../lib/utils';

function Button({ 
  children, 
  variant = 'default', 
  size = 'default', 
  asChild = false,
  onClick,
  disabled = false,
  className = '',
  ...props 
}) {
  // Base styles
  const baseStyles = "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors";
  
  // Variants
  const variants = {
    default: "bg-white/10 hover:bg-white/20 text-white",
    destructive: "bg-white/10 hover:bg-white/20 text-white",
    outline: "border border-white/20 hover:border-white/30",
    secondary: "bg-white/20 hover:bg-white/30 text-white",
    success: "bg-green-500 hover:bg-green-600 text-white",
    warning: "bg-yellow-500 hover:bg-yellow-600 text-white",
    error: "bg-red-500 hover:bg-red-600 text-white",
  };
  
  // Sizes
  const sizes = {
    default: "",
    sm: "px-2 py-1 text-xs",
    lg: "px-4 py-2 text-base",
  };
  
  // Active state styles (for toggled buttons)
  const activeStyles = "bg-white text-[#e12f27]";
  
  // Determine if active (based on additional props)
  const isActive = props.isActive || false;
  
  const Component = asChild ? props.children : 'button';
  
  return (
    <Component
      {...props}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        baseStyles,
        variants[variant] || variants.default,
        sizes[size] || sizes.default,
        isActive && activeStyles,
        disabled && "opacity-40 cursor-not-allowed",
        className
      )}
    >
      {children}
    </Component>
  );
}

export default Button;