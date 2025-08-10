import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Users, Key, ArrowRight, Info, AlertTriangle } from "lucide-react";

interface SystemStatus {
  totalUsers: number;
  hasUsers: boolean;
  defaultAdminCreated: boolean;
  adminAccount: {
    id: number;
    name: string;
    email: string;
    role: string;
  } | null;
  loginCredentials: {
    email: string;
    password: string;
    note: string;
  } | null;
}

export default function Welcome() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSystemStatus();
  }, []);

  const fetchSystemStatus = async () => {
    try {
      const response = await fetch('/api/auth/system-status');
      const data = await response.json();
      
      if (data.success) {
        setSystemStatus(data.systemStatus);
      } else {
        setError(data.error || 'فشل في التحقق من حالة النظام');
      }
    } catch (error) {
      console.error('Error fetching system status:', error);
      setError('خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-dental-light flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dental-primary mx-auto mb-4"></div>
          <p className="text-gray-600 font-arabic">جاري التحقق من حالة النظام...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-100 flex items-center justify-center" dir="rtl">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600 font-arabic">خطأ في النظام</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 font-arabic mb-4">{error}</p>
            <Button onClick={fetchSystemStatus} className="w-full font-arabic">
              إعادة المحاولة
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dental-primary/10 to-dental-light" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-dental-primary/10 rounded-lg">
              <CheckCircle className="h-8 w-8 text-dental-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-arabic">
                مرحباً بك في نظام إدارة عيادة الأسنان
              </h1>
              <p className="text-gray-600 font-arabic">
                تم تنظيف النظام وهو جاهز للاستخدام
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-arabic">
                <Users className="h-5 w-5 text-dental-primary" />
                حالة النظام
              </CardTitle>
              <CardDescription className="font-arabic">
                معلومات حول النظام والمستخدمين
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-arabic">عدد المستخدمين:</span>
                <Badge variant="secondary" className="font-arabic">
                  {systemStatus?.totalUsers || 0} مستخدم
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="font-arabic">حال�� النظام:</span>
                {systemStatus?.hasUsers ? (
                  <Badge className="bg-green-100 text-green-800 font-arabic">
                    جاهز للاستخدام
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="font-arabic">
                    فارغ
                  </Badge>
                )}
              </div>

              {systemStatus?.defaultAdminCreated && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800 font-arabic">
                    تم إنشاء حساب مدير أساسي تلقائياً
                  </AlertDescription>
                </Alert>
              )}

              {systemStatus?.adminAccount && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="font-semibold font-arabic mb-2">حساب المدير:</h4>
                  <div className="space-y-1 text-sm">
                    <p className="font-arabic"><strong>الاسم:</strong> {systemStatus.adminAccount.name}</p>
                    <p className="font-arabic"><strong>البريد:</strong> {systemStatus.adminAccount.email}</p>
                    <p className="font-arabic"><strong>الصلاحية:</strong> {systemStatus.adminAccount.role}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Login Information */}
          {systemStatus?.loginCredentials && (
            <Card className="border-dental-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-arabic">
                  <Key className="h-5 w-5 text-dental-primary" />
                  بيانات تسجيل الدخول
                </CardTitle>
                <CardDescription className="font-arabic">
                  استخدم هذه البيانات لتسجيل الدخول كمدير
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-dental-primary/5 p-4 rounded-lg">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 font-arabic">
                        البريد الإلكتروني:
                      </label>
                      <div className="mt-1 p-2 bg-white border rounded text-left font-mono">
                        {systemStatus.loginCredentials.email}
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-semibold text-gray-700 font-arabic">
                        كلمة المرور:
                      </label>
                      <div className="mt-1 p-2 bg-white border rounded text-left font-mono">
                        {systemStatus.loginCredentials.password}
                      </div>
                    </div>
                  </div>
                </div>

                <Alert className="border-yellow-200 bg-yellow-50">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800 font-arabic">
                    {systemStatus.loginCredentials.note}
                  </AlertDescription>
                </Alert>

                <Link to="/login" className="block">
                  <Button className="w-full font-arabic" size="lg">
                    تسجيل الدخول الآن
                    <ArrowRight className="h-5 w-5 mr-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="font-arabic">الخطوات التالية</CardTitle>
              <CardDescription className="font-arabic">
                ما يمكنك فعله الآن للبدء في استخدام النظام
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="bg-dental-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-dental-primary font-bold">1</span>
                  </div>
                  <h3 className="font-semibold font-arabic mb-2">سجل الدخول</h3>
                  <p className="text-sm text-gray-600 font-arabic">
                    استخدم بيانات الدخول أعلاه للوصول للنظام
                  </p>
                </div>

                <div className="text-center p-4 border rounded-lg">
                  <div className="bg-dental-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-dental-primary font-bold">2</span>
                  </div>
                  <h3 className="font-semibold font-arabic mb-2">اضبط الإعدادات</h3>
                  <p className="text-sm text-gray-600 font-arabic">
                    غيّر كلمة المرور وأضف معلومات العيادة
                  </p>
                </div>

                <div className="text-center p-4 border rounded-lg">
                  <div className="bg-dental-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-dental-primary font-bold">3</span>
                  </div>
                  <h3 className="font-semibold font-arabic mb-2">ابدأ الاستخدام</h3>
                  <p className="text-sm text-gray-600 font-arabic">
                    أضف الأطباء والمرضى وابدأ بإدارة المواعيد
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Information */}
          <Card className="lg:col-span-2 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800 font-arabic">
                <Info className="h-5 w-5" />
                معلومات مهمة
              </CardTitle>
            </CardHeader>
            <CardContent className="text-blue-800">
              <ul className="space-y-2 font-arabic">
                <li>• تم حذف جميع البيانات التجريبية من النظام</li>
                <li>• النظام الآن نظيف وجاهز للاستخدام مع بيانات حقيقية</li>
                <li>• تم إنشاء حساب مدير أساسي للدخول الأولي</li>
                <li>• يُنصح بتغيير كلمة المرور وإضافة معلومات العيادة</li>
                <li>• يمكنك الآن البدء بإضافة الأطباء والمرضى الحقيقيين</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
