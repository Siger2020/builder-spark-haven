import { Link, useLocation } from "react-router-dom";
import {
  Calendar,
  Users,
  Settings,
  FileText,
  CreditCard,
  Activity,
  Menu,
  X,
  Smile,
  Bell
} from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navigationItems = [
  { name: "الرئيسية", path: "/", icon: Smile },
  { name: "حجز موعد", path: "/booking", icon: Calendar },
  { name: "المرضى", path: "/patients", icon: Users },
  { name: "المعاملات", path: "/transactions", icon: CreditCard },
  { name: "الكشوفات", path: "/reports", icon: FileText },
  { name: "جلسات العلاج", path: "/sessions", icon: Activity },
  { name: "لوحة الإدارة", path: "/admin", icon: Settings },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="bg-white shadow-lg border-b border-dental-secondary/20" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-reverse space-x-2">
              <Smile className="h-8 w-8 text-dental-primary" />
              <span className="text-xl font-bold text-gray-900 font-arabic">عيادة الأسنان المتقدمة</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-reverse space-x-8">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center space-x-reverse space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-dental-primary text-white"
                      : "text-gray-700 hover:text-dental-primary hover:bg-dental-light"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-arabic">{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center space-x-reverse space-x-2 px-3 py-2 rounded-md text-base font-medium",
                    isActive
                      ? "bg-dental-primary text-white"
                      : "text-gray-700 hover:text-dental-primary hover:bg-dental-light"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-arabic">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
