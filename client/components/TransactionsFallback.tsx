import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface TransactionsFallbackProps {
  error?: Error;
  reset: () => void;
}

export function TransactionsFallback({ error, reset }: TransactionsFallbackProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="h-12 w-12 text-amber-500" />
            </div>
            <CardTitle className="font-arabic text-xl">
              خطأ في صفحة المعاملات المالية
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600 font-arabic">
              نعتذر، حدث خطأ أثناء تحميل صفحة المعاملات المالية. يمكنك المحاولة مرة أخرى أو الانتقال إلى صفحة أخرى.
            </p>
            <div className="space-y-2">
              <Button 
                onClick={reset} 
                className="w-full font-arabic"
                variant="default"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                المحاولة مرة أخرى
              </Button>
              <Button 
                onClick={() => window.location.href = '/admin'} 
                className="w-full font-arabic"
                variant="outline"
              >
                العودة إلى لوحة التحكم
              </Button>
            </div>
            {error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-gray-500">
                  تفاصيل الخطأ التقنية
                </summary>
                <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto text-left">
                  {error.toString()}
                </pre>
              </details>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default TransactionsFallback;
