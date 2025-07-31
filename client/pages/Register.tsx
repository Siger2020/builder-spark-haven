import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { Smile, Eye, EyeOff, Loader2, AlertCircle, CheckCircle } from "lucide-react";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "patient"
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, register } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.phone) {
      setError("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("كلمة المرور وتأكيد كلمة المرور غير متطابقتين");
      return;
    }

    if (formData.password.length < 6) {
      setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }

    setIsLoading(true);

    // تسجيل المستخدم في قاعدة البيانات
    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      role: formData.role
    });

    setIsLoading(false);

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error || 'خطأ في إنشاء الحساب');
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
        <div className="max-w-md w-full space-y-8">
          <Card>
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4 font-arabic">
                تم إنشاء الحساب بنجاح!
              </h2>
              <p className="text-gray-600 mb-6 font-arabic">
                يمكنك الآن تسجيل الدخول باستخدام بياناتك
              </p>
              <Link to="/login">
                <Button className="w-full font-arabic">
                  الانتقال لتسجيل الدخول
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="flex items-center justify-center space-x-reverse space-x-2 mb-6">
            <Smile className="h-10 w-10 text-dental-primary" />
            <span className="text-2xl font-bold text-gray-900 font-arabic">عيادة الدكتور كمال</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 font-arabic">
            إنشاء حساب جديد
          </h2>
          <p className="mt-2 text-sm text-gray-600 font-arabic">
            أنشئ حسابك للوصول إلى خدمات العيادة
          </p>
        </div>

        {/* Registration Form */}
        <Card>
          <CardHeader>
            <CardTitle className="font-arabic">بيانات الحساب الجديد</CardTitle>
            <CardDescription className="font-arabic">
              أدخل بياناتك لإنشاء حساب جديد
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="font-arabic">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="font-arabic">الاسم الكامل *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="أدخل اسمك الكامل"
                    className="font-arabic"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="font-arabic">البريد الإلكتروني *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="أدخل بريدك الإلكتروني"
                    className="font-arabic"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="font-arabic">رقم الهاتف *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="00967xxxxxxxxx"
                    className="font-arabic"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="role" className="font-arabic">نوع الحساب</Label>
                  <Select 
                    value={formData.role} 
                    onValueChange={(value) => handleInputChange("role", value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="font-arabic">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="patient" className="font-arabic">مريض</SelectItem>
                      <SelectItem value="doctor" className="font-arabic">طبيب</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="password" className="font-arabic">كلمة المرور *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      placeholder="أدخل كلمة المرور (6 أحرف على الأقل)"
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

                <div>
                  <Label htmlFor="confirmPassword" className="font-arabic">تأكيد كلمة المرور *</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      placeholder="أعد إدخال كلمة المرور"
                      className="font-arabic pl-10"
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute left-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full font-arabic" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    جاري إنشاء الحساب...
                  </>
                ) : (
                  "إنشاء الحساب"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link 
                to="/login" 
                className="text-sm text-dental-primary hover:underline font-arabic"
              >
                لديك حساب بالفعل؟ تسجيل الدخول
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
