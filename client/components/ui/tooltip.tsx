import React, { useState, ReactNode, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface TooltipProps {
  content: string;
  children: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  className?: string;
  disabled?: boolean;
}

// Main Tooltip component
export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  side = "top",
  className,
  disabled = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);

  const showTooltip = () => {
    if (disabled || !content) return;
    
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;
      
      let x = 0, y = 0;
      
      switch (side) {
        case "top":
          x = rect.left + scrollX + rect.width / 2;
          y = rect.top + scrollY - 8;
          break;
        case "bottom":
          x = rect.left + scrollX + rect.width / 2;
          y = rect.bottom + scrollY + 8;
          break;
        case "left":
          x = rect.left + scrollX - 8;
          y = rect.top + scrollY + rect.height / 2;
          break;
        case "right":
          x = rect.right + scrollX + 8;
          y = rect.top + scrollY + rect.height / 2;
          break;
      }
      
      setPosition({ x, y });
    }
    
    setIsVisible(true);
  };

  const hideTooltip = () => {
    setIsVisible(false);
  };

  const sideClasses = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2", 
    left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
    right: "left-full top-1/2 transform -translate-y-1/2 ml-2",
  };

  return (
    <>
      <div
        ref={triggerRef}
        className="inline-block"
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
      >
        {children}
      </div>
      
      {isVisible && content && (
        <div
          className={cn(
            "fixed z-50 px-2 py-1 text-sm text-white bg-gray-900 rounded shadow-lg whitespace-nowrap pointer-events-none",
            className
          )}
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            transform: side === "top" || side === "bottom" 
              ? "translateX(-50%)" 
              : side === "left" 
                ? "translateX(-100%)" 
                : side === "right" 
                  ? "translateX(0)"
                  : "translateY(-50%)"
          }}
          role="tooltip"
        >
          {content}
        </div>
      )}
    </>
  );
};

// Compatibility components for existing code
export const TooltipProvider: React.FC<{ children: ReactNode }> = ({ children }) => (
  <>{children}</>
);

export const TooltipTrigger: React.FC<{ 
  children: ReactNode;
  asChild?: boolean;
}> = ({ children }) => (
  <>{children}</>
);

export const TooltipContent: React.FC<{ 
  children: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  className?: string;
}> = ({ children }) => (
  <>{children}</>
);

// Root component for compatibility
export const TooltipRoot: React.FC<{ children: ReactNode }> = ({ children }) => (
  <>{children}</>
);

// Default export
export default Tooltip;
