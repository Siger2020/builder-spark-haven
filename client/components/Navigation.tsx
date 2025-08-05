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
  Bell,
  LogIn,
  LogOut,
  User,
  Shield,
  Mail,
} from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

// قوائم للمرضى
const patientNavigationItems = [
  { name: "الرئيسية", path: "/", icon: Smile },
  { name: "حجز موعد", path: "/booking", icon: Calendar },
  { name: "خدماتنا", path: "/services", icon: FileText },
  { name: "الأطباء", path: "/doctors", icon: Users },
  { name: "لوحة التحكم", path: "/patient-dashboard", icon: User },
];

// قوائم للأطباء والموظفين (بدون العناصر الإدارية الحساسة)
const doctorNavigationItems = [
  { name: "الرئيسية", path: "/", icon: Smile },
  { name: "إدارة المرضى", path: "/patients", icon: Users },
  { name: "إدارة المواعيد", path: "/appointment-management", icon: Calendar },
];

// قوائم لمدير النظام فقط (تتضمن جميع العناصر الإدارية)
const adminNavigationItems = [
  { name: "الرئيسية", path: "/", icon: Smile },
  { name: "لوحة المدير", path: "/admin-dashboard", icon: Settings },
  { name: "إدارة المرضى", path: "/patients", icon: Users },
  { name: "إدارة المواعيد", path: "/appointment-management", icon: Calendar },
  { name: "إدارة الإشعارات", path: "/notifications", icon: Mail },
  { name: "التقارير المالية", path: "/transactions", icon: CreditCard },
  { name: "إدارة قاعدة البيانات", path: "/database", icon: Shield },
  { name: "فحص النظام", path: "/system-check", icon: Shield },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  // تحديد القوائم حسب نوع المستخدم
  const getNavigationItems = () => {
    if (user?.role === 'patient') {
      return patientNavigationItems;
    } else if (user?.role === 'admin') {
      return adminNavigationItems;
    } else {
      // للأطباء والموظفين الآخرين
      return doctorNavigationItems;
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <nav
      className="bg-white shadow-lg border-b border-dental-secondary/20"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              to="/"
              className="text-gray-900 text-xl font-arabic pr-2"
            >
              <p>عيادة الدكتور كمال&nbsp;الملصي</p>
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
                      : "text-gray-700 hover:text-dental-primary hover:bg-dental-light",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-arabic">{item.name}</span>
                </Link>
              );
            })}
            {/* Auth Section */}
            <div className="flex items-center space-x-reverse space-x-4">
              {/* Test User Info Link */}
              {isAuthenticated && (
                <Link to="/user-info">
                  <Button variant="ghost" size="sm" className="font-arabic">
                    معلومات المستخدم
                  </Button>
                </Link>
              )}

              {/* Notification Bell */}
              {isAuthenticated && (
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    3
                  </span>
                </Button>
              )}

              {isAuthenticated ? (
                <div className="flex items-center space-x-reverse space-x-2">
                  <div className="flex items-center space-x-reverse space-x-2">
                    <User className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-700 font-arabic">
                      {user?.name}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={logout}
                    className="font-arabic"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    تسجيل الخروج
                  </Button>
                </div>
              ) : (
                <Link to="/login">
                  <Button size="sm" className="font-arabic">
                    <LogIn className="h-4 w-4 mr-1" />
                    تسجيل الدخول
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
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
                      : "text-gray-700 hover:text-dental-primary hover:bg-dental-light",
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
