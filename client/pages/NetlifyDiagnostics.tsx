import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { CheckCircle, XCircle, AlertCircle, Wifi, Database, User, Settings } from 'lucide-react';

interface DiagnosticResult {
  name: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: string;
}

interface SystemStatus {
  totalUsers: number;
  hasUsers: boolean;
  defaultAdminCreated: boolean;
  adminAccount: any;
  loginCredentials: any;
}

export default function NetlifyDiagnostics() {
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [testCredentials, setTestCredentials] = useState({
    email: 'admin@clinic.com',
    password: 'admin123'
  });

  const runDiagnostics = async () => {
    setIsRunning(true);
    setDiagnostics([]);

    const results: DiagnosticResult[] = [];

    try {
      // 1. Test API Connectivity
      results.push({
        name: 'اختبار الاتصال بالخادم',
        status: 'success',
        message: 'بدء الفحص...'
      });

      const pingResponse = await fetch('/api/ping');
      if (pingResponse.ok) {
        results[0] = {
          name: 'اختبار الاتصال بالخادم',
          status: 'success',
          message: 'الاتصال بالخادم يعمل بنجاح ✅'
        };
      } else {
        results[0] = {
          name: 'اختبار الاتصال بالخادم',
          status: 'error',
          message: 'فشل في الاتصال بالخادم',
          details: `HTTP ${pingResponse.status}`
        };
      }
    } catch (error) {
      results[0] = {
        name: 'اختب��ر الاتصال بالخادم',
        status: 'error',
        message: 'خطأ في الاتصال بالخادم',
        details: error instanceof Error ? error.message : 'خطأ غير معروف'
      };
    }

    setDiagnostics([...results]);

    try {
      // 2. Test System Status
      results.push({
        name: 'فحص حالة النظام',
        status: 'success',
        message: 'جاري الفحص...'
      });

      const statusResponse = await fetch('/api/auth/system-status');
      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        setSystemStatus(statusData.systemStatus);
        
        results[1] = {
          name: 'فحص حالة النظام',
          status: statusData.systemStatus.hasUsers ? 'success' : 'warning',
          message: statusData.systemStatus.hasUsers 
            ? `النظام يحتوي على ${statusData.systemStatus.totalUsers} مستخدم`
            : 'لا يوجد مستخدمون في النظام'
        };
      } else {
        results[1] = {
          name: 'فحص حالة النظام',
          status: 'error',
          message: 'فشل في فحص حالة النظام',
          details: `HTTP ${statusResponse.status}`
        };
      }
    } catch (error) {
      results[1] = {
        name: 'فحص حالة النظام',
        status: 'error',
        message: 'خطأ في فحص حالة النظام',
        details: error instanceof Error ? error.message : 'خطأ غير معروف'
      };
    }

    setDiagnostics([...results]);

    try {
      // 3. Test Login
      results.push({
        name: 'اختبار تسجيل الدخول',
        status: 'success',
        message: 'جاري الاختبار...'
      });

      const loginResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testCredentials),
      });

      const loginData = await loginResponse.json();
      
      if (loginResponse.ok && loginData.success) {
        results[2] = {
          name: 'اختبار تسجيل الدخول',
          status: 'success',
          message: `تم تسجيل الدخول بنجاح كـ ${loginData.user.name}`,
          details: `البريد الإلكتروني: ${loginData.user.email}`
        };
      } else {
        results[2] = {
          name: 'اختبار تسجيل الدخول',
          status: 'error',
          message: 'فشل في تسجيل الدخول',
          details: loginData.error || `HTTP ${loginResponse.status}`
        };
      }
    } catch (error) {
      results[2] = {
        name: 'اختبار تسجيل الدخول',
        status: 'error',
        message: 'خطأ في اختبار تسجيل الدخول',
        details: error instanceof Error ? error.message : 'خطأ غير معروف'
      };
    }

    setDiagnostics([...results]);
    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 border-green-200';
      case 'error': return 'bg-red-100 border-red-200';
      case 'warning': return 'bg-yellow-100 border-yellow-200';
      default: return 'bg-gray-100 border-gray-200';
    }
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6" dir="rtl">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          تشخيص Netlify للعيادة
        </h1>
        <p className="text-gray-600 mb-6">
          فحص شامل لحالة النظام ومشاكل تسجيل الدخول
        </p>
      </div>

      {/* Current Deployment Info */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="w-5 h-5" />
            معلومات النشر
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <strong>البيئة:</strong> Netlify Production
            </div>
            <div>
              <strong>الرابط:</strong> 
              <a href="https://dental-clinic-kamal-malsi.netlify.app" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-blue-600 hover:text-blue-800 mr-2">
                dental-clinic-kamal-malsi.netlify.app
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      {systemStatus && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              حالة النظام
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <strong>عدد المستخدمين:</strong> {systemStatus.totalUsers}
              </div>
              <div>
                <strong>حساب المدير:</strong>
                {systemStatus.adminAccount ? (
                  <Badge variant="default" className="mr-2">
                    {systemStatus.adminAccount.email}
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="mr-2">غير موجود</Badge>
                )}
              </div>
            </div>

            {systemStatus.loginCredentials && (
              <Alert className="mt-4">
                <User className="h-4 w-4" />
                <AlertDescription>
                  <strong>بيانات الدخول الافتراضية:</strong>
                  <br />
                  البريد الإلكتروني: <code>{systemStatus.loginCredentials.email}</code>
                  <br />
                  كلمة المرور: <code>{systemStatus.loginCredentials.password}</code>
                  <br />
                  <small className="text-gray-600">{systemStatus.loginCredentials.note}</small>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Diagnostics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            نتائج التشخيص
          </CardTitle>
          <CardDescription>
            فحص شامل لجميع مكونات النظام
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            onClick={runDiagnostics} 
            disabled={isRunning}
            className="w-full"
          >
            {isRunning ? 'جاري الفحص...' : 'إعادة تشغيل التشخيص'}
          </Button>

          {diagnostics.map((diagnostic, index) => (
            <div 
              key={index}
              className={`p-4 rounded-lg border ${getStatusColor(diagnostic.status)}`}
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(diagnostic.status)}
                <div className="flex-1">
                  <h4 className="font-medium">{diagnostic.name}</h4>
                  <p className="text-sm text-gray-600">{diagnostic.message}</p>
                  {diagnostic.details && (
                    <p className="text-xs text-gray-500 mt-1">{diagnostic.details}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle>مساعدة في حل المشاكل</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>مشكلة شائعة في Netlify:</strong>
              <br />
              في بيئة Netlify، يتم إنشاء قاعدة بيانات جديدة في الذاكرة مع كل طلب.
              يتم إنشاء حساب مدير افتراضي تلقائياً مع كل استدعاء.
            </AlertDescription>
          </Alert>

          <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-medium mb-2">بيانات الدخول الصحيحة:</h4>
            <div className="font-mono text-sm bg-gray-100 p-2 rounded">
              البريد الإلكتروني: admin@clinic.com<br />
              كلمة المرور: admin123
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-medium mb-2">خطوات استكشاف الأخطاء:</h4>
            <ol className="list-decimal list-inside text-sm space-y-1">
              <li>تأكد من استخدام البيانات الصحيحة أعلاه</li>
              <li>امسح cache المتصفح وأعد المحاولة</li>
              <li>تأكد من عدم وجود مانع إعلانات يحجب الطلبات</li>
              <li>تحقق من اتصال الإنترنت</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
