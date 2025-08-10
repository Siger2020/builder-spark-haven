import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription } from '../components/ui/alert';
import { CheckCircle, XCircle, AlertCircle, Settings } from 'lucide-react';

export default function SystemDiagnostics() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const runTests = async () => {
    setIsRunning(true);
    setResults([]);

    const testResults = [];

    // Test 1: API Connection
    try {
      const response = await fetch('/api/ping');
      testResults.push({
        name: 'اختبار اتصال API',
        status: response.ok ? 'success' : 'error',
        message: response.ok ? 'الاتصال يعمل ✅' : `خطأ HTTP ${response.status}`
      });
    } catch (error) {
      testResults.push({
        name: 'اختبار اتصال API',
        status: 'error',
        message: 'فشل في الاتصال'
      });
    }

    // Test 2: System Status
    try {
      const response = await fetch('/api/auth/system-status');
      const data = await response.json();
      testResults.push({
        name: 'فحص النظام',
        status: 'success',
        message: `يوجد ${data.systemStatus?.totalUsers || 0} مستخدم في النظام`,
        data: data.systemStatus
      });
    } catch (error) {
      testResults.push({
        name: 'فحص النظام',
        status: 'error',
        message: 'فشل في فحص النظام'
      });
    }

    // Test 3: Login Test
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@clinic.com',
          password: 'admin123'
        })
      });
      const data = await response.json();
      testResults.push({
        name: 'اختبار تسجيل الدخول',
        status: data.success ? 'success' : 'error',
        message: data.success ? `نجح تسجيل الدخول: ${data.user?.name}` : data.error
      });
    } catch (error) {
      testResults.push({
        name: 'اختبار تسجيل الدخول',
        status: 'error',
        message: 'فشل في اختبار تسجيل الدخول'
      });
    }

    setResults(testResults);
    setIsRunning(false);
  };

  const getIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl" dir="rtl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-6 h-6" />
            تشخيص النظام
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={runTests} 
            disabled={isRunning}
            className="w-full"
          >
            {isRunning ? 'جاري الفحص...' : 'تشغيل الفحص الشامل'}
          </Button>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>بيانات الدخول الصحيحة:</strong><br/>
              البريد الإلكتروني: <code>admin@clinic.com</code><br/>
              كلمة المرور: <code>admin123</code>
            </AlertDescription>
          </Alert>

          {results.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium text-lg">نتائج الفحص:</h3>
              {results.map((result, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border ${
                    result.status === 'success' ? 'bg-green-50 border-green-200' :
                    result.status === 'error' ? 'bg-red-50 border-red-200' :
                    'bg-yellow-50 border-yellow-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {getIcon(result.status)}
                    <div>
                      <h4 className="font-medium">{result.name}</h4>
                      <p className="text-sm text-gray-600">{result.message}</p>
                      {result.data && (
                        <div className="mt-2 text-xs bg-white p-2 rounded border">
                          <pre>{JSON.stringify(result.data, null, 2)}</pre>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">معلومات النشر:</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <div>البيئة: Netlify Production</div>
              <div>الموقع: https://dental-clinic-kamal-malsi.netlify.app</div>
              <div>قاعدة البيانات: في الذاكرة (يتم إنشاؤها مع كل طلب)</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
