import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

interface SafeSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

interface SafeSelectItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

// Error boundary specifically for Select components
class SelectErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    console.warn("Select component error caught:", error);
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.warn("Select error details:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm">
          <span className="text-muted-foreground">حدث خطأ في القائمة</span>
        </div>
      );
    }

    return this.props.children;
  }
}

// Safe Select wrapper
export function SafeSelect({ 
  value, 
  onValueChange, 
  placeholder = "اختر خياراً", 
  children, 
  className,
  disabled = false 
}: SafeSelectProps) {
  return (
    <SelectErrorBoundary
      fallback={
        <select 
          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={value}
          onChange={(e) => onValueChange?.(e.target.value)}
          disabled={disabled}
        >
          <option value="">{placeholder}</option>
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child) && child.props.value) {
              return (
                <option key={child.props.value} value={child.props.value}>
                  {child.props.children}
                </option>
              );
            }
            return null;
          })}
        </select>
      }
    >
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger className={className}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {children}
        </SelectContent>
      </Select>
    </SelectErrorBoundary>
  );
}

// Safe SelectItem wrapper
export function SafeSelectItem({ value, children, className }: SafeSelectItemProps) {
  return (
    <SelectItem value={value} className={className}>
      {children}
    </SelectItem>
  );
}

// Export all the safe components
export { SafeSelect as Select, SafeSelectItem as SelectItem };
export { SelectContent, SelectTrigger, SelectValue } from "./select";
