import React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface NativeSelectProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

interface NativeSelectItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

// Completely native Select implementation
export function NativeSelect({
  value,
  defaultValue,
  onValueChange,
  placeholder = "اختر خياراً",
  children,
  className,
  disabled = false,
  required = false
}: NativeSelectProps) {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      onValueChange?.(event.target.value);
    } catch (error) {
      console.error('Error in NativeSelect onChange:', error);
    }
  };

  const selectValue = value !== undefined ? value : defaultValue || "";

  return (
    <div className="relative">
      <select
        value={selectValue}
        onChange={handleChange}
        disabled={disabled}
        required={required}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none pr-8",
          className
        )}
      >
        {placeholder && !selectValue && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {React.Children.map(children, (child) => {
          try {
            if (React.isValidElement(child) && child.props.value) {
              return (
                <option key={child.props.value} value={child.props.value}>
                  {child.props.children}
                </option>
              );
            }
          } catch (error) {
            console.error('Error rendering NativeSelect option:', error);
          }
          return null;
        })}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50 pointer-events-none" />
    </div>
  );
}

// Native SelectItem component
export function NativeSelectItem({ value, children, className }: NativeSelectItemProps) {
  // This is just for compatibility - the actual option is rendered in the parent
  return null;
}

// Export with standard names for easy replacement
export { NativeSelect as Select, NativeSelectItem as SelectItem };
