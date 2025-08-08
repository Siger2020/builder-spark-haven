import React, { useState } from 'react';
import { emailJSService, EmailResult } from '../services/emailJSService';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

interface SafeEmailJSProps {
  onSend?: (result: EmailResult) => void;
  onError?: (error: string) => void;
  testEmail?: string;
  children?: React.ReactNode;
  className?: string;
}

const SafeEmailJS: React.FC<SafeEmailJSProps> = ({
  onSend,
  onError,
  testEmail = '',
  children,
  className = ''
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<EmailResult | null>(null);

  const handleSendTest = async () => {
    if (!testEmail) {
      const error = 'يرجى إدخال عنوان بريد إلكتروني للاختبار';
      onError?.(error);
      setResult({ success: false, error });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      // Wrap EmailJS call in error boundary
      const testResult = await safeEmailJSCall(() => 
        emailJSService.sendTestEmail(testEmail, 'مستخدم الاختبار')
      );

      setResult(testResult);
      
      if (testResult.success) {
        onSend?.(testResult);
      } else {
        onError?.(testResult.error || 'خطأ غير معروف');
      }
    } catch (error) {
      const errorMessage = 'خطأ في اتصال EmailJS';
      console.error('SafeEmailJS error:', error);
      setResult({ success: false, error: errorMessage });
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`safe-emailjs ${className}`}>
      {children}
      
      {result && (
        <Alert className={`mt-4 ${result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
          {result.success ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription className="font-arabic">
            {result.success 
              ? `✅ تم الإرسال بنجاح! معرف الرسالة: ${result.messageId || 'غير متوفر'}`
              : `❌ فشل الإرسال: ${result.error}`
            }
          </AlertDescription>
        </Alert>
      )}

      <div className="mt-4 flex gap-2">
        <Button
          onClick={handleSendTest}
          disabled={isLoading || !testEmail}
          className="font-arabic"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              جاري الإرسال...
            </>
          ) : (
            'إرسال رسالة اختبار'
          )}
        </Button>
      </div>
    </div>
  );
};

// Safe wrapper function for EmailJS calls
async function safeEmailJSCall<T>(emailJSFunction: () => Promise<T>): Promise<T> {
  try {
    // Check if EmailJS is available
    if (typeof window === 'undefined') {
      throw new Error('EmailJS not available in server environment');
    }

    // Check if the emailjs library is loaded
    const emailjs = (window as any).emailjs;
    if (!emailjs) {
      throw new Error('EmailJS library not loaded');
    }

    return await emailJSFunction();
  } catch (error) {
    console.error('SafeEmailJS call failed:', error);
    
    // Return safe error object
    return {
      success: false,
      error: error instanceof Error ? error.message : 'خطأ في اتصال EmailJS'
    } as T;
  }
}

export default SafeEmailJS;
export { safeEmailJSCall };
