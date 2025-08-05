import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Shield, Mail, Phone } from "lucide-react";

export default function UserInfo() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4 font-arabic">
              غير مسجل دخول
            </h1>
            <p className="text-gray-600 font-arabic">
              يجب تسجيل الدخول أولاً لعرض معلومات المستخدم
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 font-arabic">
            معلومات المستخدم الحالي
          </h1>
          <p className="text-gray-600 font-arabic">
            معلومات حسابك والصلاحيات المتاحة
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 font-arabic">
                <User className="h-6 w-6" />
                معلومات أساسية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 font-arabic">��لاسم</label>
                  <p className="text-lg font-bold text-gray-900 font-arabic">{user.name}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600 font-arabic">البريد الإلكتروني</label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <p className="text-gray-900">{user.email}</p>
                  </div>
                </div>
                
                {user.phone && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 font-arabic">رقم الهاتف</label>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <p className="text-gray-900">{user.phone}</p>
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="text-sm font-medium text-gray-600 font-arabic">نوع الحساب</label>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-blue-500" />
                    <Badge 
                      variant={user.role === 'admin' ? 'default' : user.role === 'doctor' ? 'secondary' : 'outline'}
                      className="font-arabic"
                    >
                      {user.role === 'admin' && 'مدير النظام'}
                      {user.role === 'doctor' && 'طبيب'}
                      {user.role === 'patient' && 'مريض'}
                      {user.role === 'receptionist' && 'موظف استقبال'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-arabic">الصلاحيات المتاحة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {user.role === 'admin' && (
                  <>
                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="font-arabic">✅ إدارة كاملة للنظام</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="font-arabic">✅ إدارة المستخدمين</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="font-arabic">✅ إدارة قاعدة البيانات</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="font-arabic">✅ التقارير المالية</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="font-arabic">✅ إدارة الإشعارات</Badge>
                    </div>
                  </>
                )}
                
                {user.role === 'doctor' && (
                  <>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="font-arabic">✅ إدارة المرضى</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="font-arabic">✅ إدارة المواعيد</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="font-arabic">�� كتابة التقارير الطبية</Badge>
                    </div>
                  </>
                )}
                
                {user.role === 'patient' && (
                  <>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-arabic">✅ حجز المواعيد</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-arabic">✅ عرض ملفه الطبي</Badge>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-arabic">معلومات تقنية للمطور</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 p-4 rounded-lg">
                <pre className="text-sm text-gray-800 font-mono overflow-auto">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
