import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { Smile, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || "/";

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("يرجى إدخال البريد الإلكتروني وكلمة المرور");
      return;
    }

    const success = await login(email, password);
    if (!success) {
      setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      dir="rtl"
    >
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link
            to="/"
            className="flex items-center justify-center space-x-reverse space-x-2 mb-6"
          >
            <Smile className="h-10 w-10 text-dental-primary" />
            <span className="text-2xl font-bold text-gray-900 font-arabic">
              عيادة الدكتور كمال
            </span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 font-arabic">
            تسجيل الدخول
          </h2>
          <p className="mt-2 text-sm text-gray-600 font-arabic">
            يرجى تسجيل الدخول ��لوصول إلى خدمة الحجز
          </p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle className="font-arabic">
              تسجيل الدخول إلى حسابك
            </CardTitle>
            <CardDescription className="font-arabic">
              أدخل بياناتك للوصول إلى النظام
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="font-arabic">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div>
                  <Label htmlFor="email" className="font-arabic">
                    البريد الإلكتروني
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="أدخل بريدك الإلكتروني"
                    className="font-arabic"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="password" className="font-arabic">
                    كلمة المرور
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="أدخل كلمة المرور"
                      className="font-arabic pl-10"
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute left-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full font-arabic"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    جاري تسجيل الدخول...
                  </>
                ) : (
                  "تسجيل الدخول"
                )}
              </Button>
            </form>

            {/* Default Admin Login Button */}
            <div className="mt-4 space-y-2">
              <Button
                type="button"
                variant="outline"
                className="w-full font-arabic"
                onClick={() => {
                  setEmail("admin@clinic.com");
                  setPassword("admin123");
                }}
                disabled={isLoading}
              >
                تعبئة بيانات المدير الأساسي
              </Button>

              <div className="text-center">
                <Link
                  to="/welcome"
                  className="text-sm text-dental-primary hover:text-dental-primary/80 font-arabic"
                >
                  نظام جديد؟ اعرض صفحة الترحيب
                </Link>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/register"
                className="text-sm text-dental-primary hover:underline font-arabic"
              >
                ليس لديك حسا��؟ إنشاء حساب جديد
              </Link>
            </div>

            <div className="mt-4 text-center">
              <Link
                to="/"
                className="text-sm text-gray-600 hover:text-gray-900 font-arabic"
              >
                العودة للصفحة الرئيسية
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
