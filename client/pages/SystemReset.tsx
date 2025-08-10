import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Trash2, Database, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react";

export default function SystemReset() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const handleResetAdmin = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/auth/reset-admin', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setMessage({
          type: 'success',
          text: `تم حذف البيانات التجريبية بنجاح. تم حذف ${data.details.adminDeleted} حساب مدير و ${data.details.testUsersDeleted} مستخدم تجريبي و ${data.details.totalRecordsDeleted} سجل إضافي.`
        });
      } else {
        throw new Error(data.error || 'فشل في حذف البيانات');
      }
    } catch (error) {
      console.error('Error resetting admin data:', error);
      setMessage({
        type: 'error',
        text: `خطأ في حذف البيانات التجريبية: ${error.message}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetDatabase = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/auth/reset-database', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setMessage({
          type: 'success',
          text: `تم إعادة تهيئة قاعدة البيانات بنجاح. تم حذف ${data.details.totalRecordsDeleted} سجل من ${data.details.tablesReset} جدول.`
        });
      } else {
        throw new Error(data.error || 'فشل في إعادة تهيئة قاعدة البيانات');
      }
    } catch (error) {
      console.error('Error resetting database:', error);
      setMessage({
        type: 'error',
        text: `خطأ في إعادة تهيئة قاعدة البيانات: ${error.message}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 font-arabic">
            إعادة تعيين النظام
          </h1>
          <p className="text-gray-600 font-arabic">
            إدارة وحذف البيانات التجريبية من النظام
          </p>
        </div>

        {message && (
          <Alert className={`mb-6 ${message.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
            {message.type === 'success' ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={`font-arabic ${message.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* حذف بيانات المدير التجريبية */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-arabic">
                <Trash2 className="h-5 w-5 text-orange-600" />
                حذف البيانات التجريبية
              </CardTitle>
              <CardDescription className="font-arabic">
                حذف بيانات المدير والمستخدمين التجريبيين فقط
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm font-arabic">سيتم حذف:</h4>
                <ul className="text-sm text-gray-600 space-y-1 font-arabic">
                  <li>• حساب المدير (admin@dkalmoli.com)</li>
                  <li>• المستخدمين التجريبيين</li>
                  <li>• المرضى التجريبيين</li>
                  <li>• الأطباء التجريبيين</li>
                  <li>• المواعيد التجريبية</li>
                  <li>• المعاملات المالية التجريبية</li>
                </ul>
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full font-arabic"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        جاري الحذف...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-2" />
                        حذف البيانات التجريبية
                      </>
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="font-arabic">تأكيد حذف البيانات التجريبية</AlertDialogTitle>
                    <AlertDialogDescription className="font-arabic">
                      هل أنت متأكد من حذف جميع البيانات التجريبية؟ 
                      <br />
                      <strong>لا يمكن التراجع عن هذا الإجراء.</strong>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="font-arabic">إلغاء</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleResetAdmin}
                      className="bg-orange-600 hover:bg-orange-700 font-arabic"
                    >
                      نعم، احذف البيانات
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>

          {/* إعادة تهيئة قاعدة البيانات كاملة */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-arabic">
                <Database className="h-5 w-5 text-red-600" />
                إعادة تهيئة قاعدة البيانات
              </CardTitle>
              <CardDescription className="font-arabic">
                حذف جميع البيانات وإعادة تهيئة النظام بالكامل
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800 font-arabic">
                  <strong>تحذير:</strong> سيتم حذف جميع البيانات نهائياً!
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <h4 className="font-semibold text-sm font-arabic">سيتم حذف:</h4>
                <ul className="text-sm text-gray-600 space-y-1 font-arabic">
                  <li>• جميع المستخدمين</li>
                  <li>• جميع المرضى والملفات الطبية</li>
                  <li>• جميع المواعيد</li>
                  <li>• جميع المعاملات المالية</li>
                  <li>• جميع التقارير والجلسات</li>
                  <li>• جميع الإشعارات والسجلات</li>
                </ul>
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    className="w-full font-arabic"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        جاري إعادة التهيئة...
                      </>
                    ) : (
                      <>
                        <Database className="h-4 w-4 mr-2" />
                        إعادة تهيئة قاعدة البيانات
                      </>
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="font-arabic text-red-600">
                      تأكيد إعادة تهيئة قاعدة البيانات
                    </AlertDialogTitle>
                    <AlertDialogDescription className="font-arabic">
                      هل أنت متأكد من إعادة تهيئة قاعدة البيانات بالكامل؟
                      <br />
                      <strong className="text-red-600">
                        سيتم حذف جميع البيانات نهائياً ولا يمكن استرجاعها!
                      </strong>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="font-arabic">إلغاء</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleResetDatabase}
                      className="bg-red-600 hover:bg-red-700 font-arabic"
                    >
                      نعم، أعد تهيئة قاعدة البيانات
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>

        {/* معلومات إضافية */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="font-arabic">معلومات مهمة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 font-arabic">
            <div className="space-y-2">
              <h4 className="font-semibold">متى تستخدم حذف البيانات التجريبية:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• عند الانتهاء من اختبار النظام</li>
                <li>• قبل البدء في استخدام النظام مع بيانات حقيقية</li>
                <li>• عندما تريد البدء بحساب مدير جديد</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">متى تستخدم إعادة تهيئة قاعدة البيانات:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• عند الحاجة لمسح جميع البيانات والبدء من جديد</li>
                <li>• في حالة وجود مشاكل في البيانات</li>
                <li>• عند إعادة تعيين النظام لمستخدم جديد</li>
              </ul>
            </div>

            <Alert className="border-blue-200 bg-blue-50">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>نصيحة:</strong> ننصح بإنشاء نسخة احتياطية من البيانات قبل تنفيذ أي من هذه العمليات.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
