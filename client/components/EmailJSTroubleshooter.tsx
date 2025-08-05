import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  AlertTriangle, 
  CheckCircle, 
  ExternalLink, 
  Bug,
  RefreshCw,
  Settings,
  Mail,
  Key,
  FileText,
  Zap
} from "lucide-react";
import { toast } from "sonner";
import { emailJSService } from "../services/emailJSService";
import { ConnectionStatus } from "../lib/emailConfig";

interface EmailJSTroubleshooterProps {
  connectionStatus: ConnectionStatus;
  hasServiceId: boolean;
  hasTemplateId: boolean;
  hasPublicKey: boolean;
  hasSenderEmail: boolean;
  onRetry?: () => void;
}

export default function EmailJSTroubleshooter({ 
  connectionStatus, 
  hasServiceId, 
  hasTemplateId, 
  hasPublicKey, 
  hasSenderEmail,
  onRetry 
}: EmailJSTroubleshooterProps) {
  const [isRunningDiagnostics, setIsRunningDiagnostics] = useState(false);

  const commonIssues = [
    {
      id: 'service-id',
      title: 'Service ID غير صحيح',
      check: hasServiceId,
      description: 'يجب أن يبدأ بـ service_ متبوعاً بأحرف وأرقام',
      solution: 'تأكد من نسخ Service ID بالكامل من لوحة تحكم EmailJS'
    },
    {
      id: 'template-id', 
      title: 'Template ID غير صحيح',
      check: hasTemplateId,
      description: 'يجب أن يبدأ بـ template_ متبوعاً بأحرف وأرقام',
      solution: 'تأكد من إنشاء قالب البريد الإلكتروني في EmailJS ونسخ معرفه'
    },
    {
      id: 'public-key',
      title: 'Public Key غير صحيح',
      check: hasPublicKey,
      description: 'يجب أن يبدأ بـ user_ متبوعاً بأحرف وأرقام',
      solution: 'انسخ Public Key من Account > API Keys في EmailJS'
    },
    {
      id: 'sender-email',
      title: 'بريد المرسل غير صحيح',
      check: hasSenderEmail,
      description: 'يجب أن يكون بريد إلكتروني صحيح',
      solution: 'أدخل البريد الإلكتروني الخاص بعيادتك'
    }
  ];

  const runDiagnostics = async () => {
    setIsRunningDiagnostics(true);
    
    try {
      // فحص حالة المتصفح
      console.log('=== EmailJS Diagnostics ===');
      console.log('User Agent:', navigator.userAgent);
      console.log('EmailJS Service configured:', emailJSService.isConfigured());
      console.log('Connection Status:', connectionStatus);
      
      // فحص localStorage
      const savedSettings = localStorage.getItem('emailjs_settings');
      console.log('LocalStorage settings:', savedSettings ? JSON.parse(savedSettings) : 'None');
      
      // فحص الشبكة
      console.log('Online status:', navigator.onLine);
      
      // محاولة ping لـ EmailJS
      try {
        await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'HEAD',
          mode: 'no-cors'
        });
        console.log('EmailJS API accessible');
      } catch (error) {
        console.log('EmailJS API access issue:', error);
      }
      
      toast.success('تم تشغيل الفحص التشخيصي - راجع console للتفاصيل');
    } catch (error) {
      console.error('Diagnostics error:', error);
      toast.error('خطأ في تشغيل الفحص التشخيصي');
    } finally {
      setIsRunningDiagnostics(false);
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case ConnectionStatus.ERROR:
        return 'border-red-500 bg-red-50';
      case ConnectionStatus.NOT_CONFIGURED:
        return 'border-gray-300 bg-gray-50';
      case ConnectionStatus.CONFIGURED:
        return 'border-yellow-500 bg-yellow-50';
      case ConnectionStatus.CONNECTED:
        return 'border-green-500 bg-green-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  const getStatusMessage = () => {
    switch (connectionStatus) {
      case ConnectionStatus.ERROR:
        return 'فشل في الاتصال - راجع الأخطاء أدناه';
      case ConnectionStatus.NOT_CONFIGURED:
        return 'لم يتم التكوين بعد';
      case ConnectionStatus.CONFIGURED:
        return 'مُكوَّن ولكن لم يتم اختباره';
      case ConnectionStatus.CONNECTED:
        return 'متصل ويعمل بشكل صحيح';
      case ConnectionStatus.TESTING:
        return 'جاري الاختبار...';
      default:
        return 'حالة غير معروفة';
    }
  };

  if (connectionStatus === ConnectionStatus.CONNECTED) {
    return (
      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription className="font-arabic">
          ✅ <strong>النظام يعمل بشكل ممتاز!</strong> جميع الإعدادات صحيحة والاتصال مُفعل.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className={`border-2 ${getStatusColor()}`}>
      <CardHeader>
        <CardTitle className="font-arabic flex items-center gap-2">
          <Bug className="w-5 h-5 text-red-600" />
          مشخص أخطاء EmailJS
        </CardTitle>
        <CardDescription className="font-arabic">
          الحالة الحالية: <Badge variant="outline">{getStatusMessage()}</Badge>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* فحص المتطلبات الأساسية */}
        <div>
          <h4 className="font-bold font-arabic mb-3">فحص المتطلبات الأساسية:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {commonIssues.map((issue) => (
              <div key={issue.id} className={`p-3 border rounded-lg ${
                issue.check ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {issue.check ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  )}
                  <span className="font-bold text-sm font-arabic">{issue.title}</span>
                </div>
                <p className="text-xs text-gray-600 font-arabic mb-1">{issue.description}</p>
                {!issue.check && (
                  <p className="text-xs text-red-600 font-arabic">{issue.solution}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* خطوات الإصلاح المقترحة */}
        <Accordion type="single" collapsible>
          <AccordionItem value="troubleshooting">
            <AccordionTrigger className="font-arabic">
              خطوات الإصلاح المقترحة
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Settings className="w-4 h-4 mt-1 text-blue-600" />
                  <div>
                    <strong className="font-arabic">1. تحقق من إعدادات EmailJS:</strong>
                    <p className="text-sm text-gray-600 font-arabic">
                      تأكد من صحة Service ID, Template ID, و Public Key في موقع EmailJS
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <FileText className="w-4 h-4 mt-1 text-green-600" />
                  <div>
                    <strong className="font-arabic">2. راجع قالب البريد الإلكتروني:</strong>
                    <p className="text-sm text-gray-600 font-arabic">
                      تأكد من أن القالب يحتوي على جميع المتغيرات المطلوبة مثل to_email, subject, إلخ
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 mt-1 text-orange-600" />
                  <div>
                    <strong className="font-arabic">3. تحقق من خدمة البريد الإلكتروني:</strong>
                    <p className="text-sm text-gray-600 font-arabic">
                      تأكد من أن خدمة البريد الإلكتروني (Gmail, Outlook, إلخ) مُفعلة في EmailJS
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Key className="w-4 h-4 mt-1 text-purple-600" />
                  <div>
                    <strong className="font-arabic">4. راجع صلاحيات الوصول:</strong>
                    <p className="text-sm text-gray-600 font-arabic">
                      تأكد من أن حساب البريد الإلكتروني يسمح بإرسال الرسائل عبر تطبيقات خارجية
                    </p>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* أزرار العمل */}
        <div className="flex gap-3">
          {onRetry && (
            <Button 
              onClick={onRetry}
              disabled={connectionStatus === ConnectionStatus.TESTING}
              className="font-arabic"
            >
              <RefreshCw className="w-4 h-4 ml-2" />
              إعادة المحاولة
            </Button>
          )}

          <Button 
            variant="outline"
            onClick={runDiagnostics}
            disabled={isRunningDiagnostics}
            className="font-arabic"
          >
            <Zap className="w-4 h-4 ml-2" />
            {isRunningDiagnostics ? 'جاري الفحص...' : 'فحص تشخيصي'}
          </Button>

          <Button 
            variant="outline"
            onClick={() => window.open('https://www.emailjs.com/docs/', '_blank')}
            className="font-arabic"
          >
            <ExternalLink className="w-4 h-4 ml-2" />
            وثائق EmailJS
          </Button>
        </div>

        {/* تنبيه مهم */}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="font-arabic">
            <strong>نصيحة مهمة:</strong> افتح Developer Tools (F12) واذهب لتبويب Console لرؤية رسائل الخطأ التفصيلية.
            هذا سيساعد في تحديد المشكلة بدقة أكبر.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
