import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  CheckCircle, 
  ExternalLink, 
  Copy,
  Settings,
  Mail,
  Key,
  FileText,
  HelpCircle
} from "lucide-react";
import { toast } from "sonner";

interface EmailJSSetupHelperProps {
  hasServiceId: boolean;
  hasTemplateId: boolean;
  hasPublicKey: boolean;
  hasSenderEmail: boolean;
  onOpenGuide?: () => void;
}

export default function EmailJSSetupHelper({ 
  hasServiceId, 
  hasTemplateId, 
  hasPublicKey, 
  hasSenderEmail,
  onOpenGuide 
}: EmailJSSetupHelperProps) {
  const [showQuickTemplate, setShowQuickTemplate] = useState(false);

  const setupSteps = [
    {
      id: 'service',
      title: 'Service ID',
      completed: hasServiceId,
      description: 'معرف خدمة البريد الإلكتروني من EmailJS',
      icon: <Settings className="w-4 h-4" />,
      example: 'service_abc123xyz'
    },
    {
      id: 'template', 
      title: 'Template ID',
      completed: hasTemplateId,
      description: 'معرف قالب البريد الإلكتروني',
      icon: <FileText className="w-4 h-4" />,
      example: 'template_xyz789abc'
    },
    {
      id: 'key',
      title: 'Public Key',
      completed: hasPublicKey,
      description: 'المفتاح العام للمصادقة',
      icon: <Key className="w-4 h-4" />,
      example: 'user_1234567890abcdef'
    },
    {
      id: 'email',
      title: 'بريد المرسل',
      completed: hasSenderEmail,
      description: 'البريد الإلكتروني للعيادة',
      icon: <Mail className="w-4 h-4" />,
      example: 'clinic@example.com'
    }
  ];

  const completedSteps = setupSteps.filter(step => step.completed).length;
  const totalSteps = setupSteps.length;
  const isComplete = completedSteps === totalSteps;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('تم النسخ للحافظة');
  };

  const quickTemplate = `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{subject}}</title>
    <style>
        body { font-family: Arial, sans-serif; direction: rtl; text-align: right; }
        .container { max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px; }
        .header { background: #1e40af; color: white; padding: 20px; text-align: center; }
        .content { background: white; padding: 20px; }
        .footer { background: #1f2937; color: white; padding: 15px; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>{{icon}} {{notification_type}}</h1>
            <p>{{message}}</p>
        </div>
        <div class="content">
            <h2>عزيزي/عزيزتي {{to_name}}</h2>
            <p><strong>رقم الموعد:</strong> {{appointment_id}}</p>
            <p><strong>التاريخ:</strong> {{appointment_date}}</p>
            <p><strong>الوقت:</strong> {{appointment_time}}</p>
            <p><strong>الطبيب:</strong> {{doctor_name}}</p>
            <p><strong>العيادة:</strong> {{clinic_name}}</p>
            <p><strong>الهاتف:</strong> {{clinic_phone}}</p>
            <p><strong>العنوان:</strong> {{clinic_address}}</p>
            <p><strong>التعليمات:</strong> {{instructions}}</p>
            {{#notes}}<p><strong>ملاحظات:</strong> {{notes}}</p>{{/notes}}
        </div>
        <div class="footer">
            <p><strong>{{clinic_name}}</strong></p>
            <p>{{from_name}} - {{current_time}}</p>
        </div>
    </div>
</body>
</html>`;

  return (
    <div className="space-y-4">
      {/* حالة التقدم */}
      <Card className={`border-2 ${isComplete ? 'border-green-500' : 'border-orange-500'}`}>
        <CardHeader>
          <CardTitle className="font-arabic flex items-center gap-2">
            {isComplete ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            )}
            حالة إعداد EmailJS
          </CardTitle>
          <CardDescription className="font-arabic">
            {isComplete 
              ? 'تم الإعداد بنجاح! يمكنك الآن اختبار النظام'
              : `${completedSteps} من ${totalSteps} خطوات مكتملة`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {setupSteps.map((step) => (
              <div key={step.id} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  step.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  {step.completed ? <CheckCircle className="w-4 h-4" /> : step.icon}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-sm font-arabic">{step.title}</div>
                  <div className="text-xs text-gray-500 font-arabic">{step.description}</div>
                  <code className="text-xs text-blue-600 bg-blue-50 px-1 rounded">{step.example}</code>
                </div>
                <Badge variant={step.completed ? "default" : "secondary"}>
                  {step.completed ? 'مكتمل' : 'مطلوب'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* أزرار المساعدة */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button 
          variant="outline" 
          onClick={() => window.open('https://www.emailjs.com', '_blank')}
          className="font-arabic"
        >
          <ExternalLink className="w-4 h-4 ml-2" />
          زيارة EmailJS
        </Button>

        <Button 
          variant="outline" 
          onClick={() => setShowQuickTemplate(!showQuickTemplate)}
          className="font-arabic"
        >
          <FileText className="w-4 h-4 ml-2" />
          قالب سريع
        </Button>

        {onOpenGuide && (
          <Button 
            variant="outline" 
            onClick={onOpenGuide}
            className="font-arabic"
          >
            <HelpCircle className="w-4 h-4 ml-2" />
            دليل الإعداد
          </Button>
        )}
      </div>

      {/* القالب السريع */}
      {showQuickTemplate && (
        <Card>
          <CardHeader>
            <CardTitle className="font-arabic text-sm">قالب HTML سريع للبريد الإلكتروني</CardTitle>
            <CardDescription className="font-arabic text-xs">
              انسخ هذا القالب واستخدم�� في EmailJS لإنشاء قالب البريد الإلكتروني
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <pre className="text-xs bg-gray-50 p-3 rounded border overflow-x-auto max-h-40">
                <code>{quickTemplate}</code>
              </pre>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(quickTemplate)}
                className="absolute top-2 left-2"
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* تنبيهات مهمة */}
      {!isComplete && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="font-arabic">
            <strong>خطوات مطلوبة:</strong> يجب إكمال جميع الحقول أعلاه قبل استخدام نظام الإشعارات الحقيقية.
            راجع دليل الإعداد للحصول على تعليمات مفصلة.
          </AlertDescription>
        </Alert>
      )}

      {isComplete && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription className="font-arabic">
            ✅ <strong>جاهز للاستخدام!</strong> تم إعداد جميع البيانات المطلوبة. 
            يمكنك الآن اختبار النظام من تبويب "الاختبار".
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
