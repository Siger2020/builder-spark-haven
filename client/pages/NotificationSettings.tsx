import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";
import {
  Mail,
  Settings,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  BarChart3,
  History,
  TestTube,
  Shield,
  ExternalLink,
  Wifi,
  WifiOff,
  Activity,
  Info,
  HelpCircle,
  Copy,
  RefreshCw,
} from "lucide-react";
import { emailJSService } from "../services/emailJSService";
import {
  EmailJSSettings,
  defaultEmailJSSettings,
  SETUP_GUIDE,
  EMAIL_TEMPLATES,
  ConnectionStatus,
  getConnectionStatusText,
  getConnectionStatusColor
} from "../lib/emailConfig";
import EmailJSSetupHelper from "../components/EmailJSSetupHelper";
import EmailJSTroubleshooter from "../components/EmailJSTroubleshooter";

interface NotificationLog {
  id: number;
  notification_type: string;
  recipient_email: string;
  recipient_name: string;
  appointment_id?: string;
  subject: string;
  sent_at?: string;
  delivery_status: string;
  error_message?: string;
  created_at: string;
}

interface NotificationStats {
  total: number;
  successful: number;
  failed: number;
  pending: number;
  byType: Array<{
    notification_type: string;
    total: number;
    successful: number;
    failed: number;
    pending: number;
  }>;
}

export default function NotificationSettings() {
  const [activeTab, setActiveTab] = useState("settings");
  const [emailJSSettings, setEmailJSSettings] = useState<EmailJSSettings>(defaultEmailJSSettings);
  const [testEmail, setTestEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(ConnectionStatus.NOT_CONFIGURED);
  const [notificationLogs, setNotificationLogs] = useState<NotificationLog[]>([]);
  const [notificationStats, setNotificationStats] = useState<NotificationStats | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [lastActionTime, setLastActionTime] = useState(0);

  // تحميل إعدادات EmailJS
  const loadEmailJSSettings = async () => {
    try {
      // محاولة تحميل الإعدادات من localStorage
      const savedSettings = localStorage.getItem('emailjs_settings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setEmailJSSettings(settings);
        
        // تكوين الخدمة
        emailJSService.configure(settings);
        setConnectionStatus(emailJSService.getConnectionStatus());
      }
    } catch (error) {
      console.error('Error loading EmailJS settings:', error);
      toast.error('خطأ في تحميل إعدادات EmailJS');
    }
  };

  // تحميل سجل الإشعارات (محفوظ للتوافق)
  const loadNotificationLogs = async () => {
    try {
      const response = await fetch('/api/notifications/logs?limit=50');
      const data = await response.json();
      
      if (data.success) {
        setNotificationLogs(data.data);
      }
    } catch (error) {
      console.error('Error loading notification logs:', error);
      // ��ا نظهر خطأ هنا لأن الإشعارات القديمة قد لا تكون متوفرة
    }
  };

  // تحميل إحصائيات الإشعارات (محفوظ للتوافق)
  const loadNotificationStats = async () => {
    try {
      const response = await fetch('/api/notifications/stats');
      const data = await response.json();
      
      if (data.success) {
        setNotificationStats(data.data);
      }
    } catch (error) {
      console.error('Error loading notification stats:', error);
      // لا نظهر خطأ هنا لأن الإحصائيات القديمة قد لا تكون متوفرة
    }
  };

  // حفظ إعدادات EmailJS
  const saveEmailJSSettings = async () => {
    setIsLoading(true);
    
    try {
      // التحقق من صحة الإعدادات
      const configResult = emailJSService.configure(emailJSSettings);
      
      if (!configResult.success) {
        toast.error(`خطأ في الإعدادات: ${configResult.errors?.join(', ')}`);
        return;
      }

      // حفظ الإعدادات في localStorage
      localStorage.setItem('emailjs_settings', JSON.stringify(emailJSSettings));
      
      setConnectionStatus(emailJSService.getConnectionStatus());
      toast.success('تم حفظ إعدادات EmailJS بنجاح');
      
      // اختبار الاتصال تلقائياً إذا كان النظام مفعل
      if (emailJSSettings.enabled) {
        await testEmailJSConnection();
      }
    } catch (error) {
      console.error('Error saving EmailJS settings:', error);
      toast.error('خطأ في حفظ إعدادات EmailJS');
    } finally {
      setIsLoading(false);
    }
  };

  // اختبار اتصال EmailJS
  const testEmailJSConnection = async () => {
    if (!checkRateLimit()) return;

    if (isTesting) {
      toast.error('يوجد طلب آخر قيد التنفيذ');
      return;
    }

    setIsTesting(true);
    setConnectionStatus(ConnectionStatus.TESTING);

    try {
      console.log('Testing EmailJS connection...');
      const result = await emailJSService.testConnection();

      if (result.success) {
        setConnectionStatus(ConnectionStatus.CONNECTED);
        toast.success('✅ تم الاتصال بنجاح! النظام جاهز للاستخدام');
      } else {
        setConnectionStatus(ConnectionStatus.ERROR);
        toast.error(`❌ فشل الاتصال: ${result.error}`);
      }
    } catch (error) {
      setConnectionStatus(ConnectionStatus.ERROR);
      console.error('Error testing EmailJS connection:', error);
      toast.error('خطأ في اختبار اتصال EmailJS');
    } finally {
      setIsTesting(false);
    }
  };

  // منع الطلبات المتكررة
  const checkRateLimit = (): boolean => {
    const now = Date.now();
    const timeSinceLastAction = now - lastActionTime;

    if (timeSinceLastAction < 3000) { // 3 ثواني بين الطلبات
      toast.error('يرجى الانتظار قبل إرسال طلب جديد');
      return false;
    }

    setLastActionTime(now);
    return true;
  };

  // إرسال بريد اختبار عبر EmailJS
  const sendTestEmail = async () => {
    if (!checkRateLimit()) return;

    if (!testEmail) {
      toast.error('يرجى إدخال بريد إلكتروني للاختبار');
      return;
    }

    if (!emailJSService.isConfigured()) {
      toast.error('يرجى تكوين إعدادات EmailJS أولاً');
      return;
    }

    if (isTesting) {
      toast.error('يوجد طلب آخر قيد التنفيذ');
      return;
    }

    setIsTesting(true);

    try {
      const result = await emailJSService.sendTestEmail(testEmail);

      if (result.success) {
        toast.success('✅ تم إرسال بريد الاختبار بنجاح!');
        setTestEmail('');
      } else {
        toast.error(`❌ ��شل إرسال بريد الاختبار: ${result.error}`);
      }
    } catch (error) {
      console.error('Error sending test email:', error);
      toast.error('خطأ في إرسال بريد الاختبار');
    } finally {
      setIsTesting(false);
    }
  };

  // اختبار إشعار حجز حقيقي عبر EmailJS
  const sendTestBookingNotification = async () => {
    if (!checkRateLimit()) return;

    if (!testEmail) {
      toast.error('يرجى إدخال بريد إلكتروني للاختبار');
      return;
    }

    if (!emailJSService.isConfigured()) {
      toast.error('يرجى تكوين إعدادات EmailJS أولاً');
      return;
    }

    if (isTesting) {
      toast.error('يوجد طلب آخر قيد التنفيذ');
      return;
    }

    setIsTesting(true);

    try {
      console.log('Starting test booking notification to:', testEmail);
      const result = await emailJSService.sendTestBookingNotification(testEmail);

      if (result.success) {
        toast.success(`✅ تم إرسال إشعار تأكيد الحجز بنجاح! رقم الموعد: ${result.appointmentId}`);
        setTestEmail('');
      } else {
        toast.error(`❌ فشل إرسال إشعار الحجز: ${result.error}`);
      }
    } catch (error) {
      console.error('Error sending test booking notification:', error);
      toast.error('خطأ في إرسال إشعار الحجز التجريبي');
    } finally {
      setIsTesting(false);
    }
  };

  // تحميل البيانات عند بدء الصفحة
  useEffect(() => {
    loadEmailJSSettings();
    loadNotificationLogs();
    loadNotificationStats();
  }, []);

  // دالة لتحديد لون badge حسب حالة التسليم
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
      case 'delivered':
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="w-3 h-3 ml-1" />تم الإرسال</Badge>;
      case 'failed':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 ml-1" />فشل</Badge>;
      case 'pending':
        return <Badge variant="secondary"><Clock className="w-3 h-3 ml-1" />في الانتظار</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // دالة لتحديد أيقونة نوع الإشعار
  const getNotificationTypeIcon = (type: string) => {
    switch (type) {
      case 'confirmation':
        return '✅';
      case 'reminder':
        return '⏰';
      case 'cancellation':
        return '❌';
      case 'test':
        return '🧪';
      default:
        return '📧';
    }
  };

  // نسخ النص للحافظة
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('تم النسخ للحافظة');
  };

  // مؤشر حالة الاتصال
  const ConnectionStatusIndicator = () => {
    const statusText = getConnectionStatusText(connectionStatus);
    const statusColor = getConnectionStatusColor(connectionStatus);
    
    const getStatusIcon = () => {
      switch (connectionStatus) {
        case ConnectionStatus.NOT_CONFIGURED:
          return <WifiOff className="w-4 h-4" />;
        case ConnectionStatus.CONFIGURED:
          return <Activity className="w-4 h-4" />;
        case ConnectionStatus.TESTING:
          return <RefreshCw className="w-4 h-4 animate-spin" />;
        case ConnectionStatus.CONNECTED:
          return <Wifi className="w-4 h-4" />;
        case ConnectionStatus.ERROR:
          return <XCircle className="w-4 h-4" />;
        default:
          return <WifiOff className="w-4 h-4" />;
      }
    };

    return (
      <div className="flex items-center gap-2">
        <div className={`flex items-center gap-1 ${statusColor}`}>
          {getStatusIcon()}
          <span className="text-sm font-medium">{statusText}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl" dir="rtl">
      <div className="flex items-center gap-4 mb-8">
        <Mail className="h-8 w-8 text-dental-primary" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-arabic">إدارة الإشعارات الحقيقية</h1>
          <p className="text-gray-600 font-arabic">نظام إشعارات متطور باستخدام EmailJS</p>
        </div>
        <div className="mr-auto">
          <ConnectionStatusIndicator />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="settings" className="font-arabic">
            <Settings className="w-4 h-4 ml-2" />
            إعدادات EmailJS
          </TabsTrigger>
          <TabsTrigger value="test" className="font-arabic">
            <TestTube className="w-4 h-4 ml-2" />
            الاختبار
          </TabsTrigger>
          <TabsTrigger value="guide" className="font-arabic">
            <HelpCircle className="w-4 h-4 ml-2" />
            دليل الإعداد
          </TabsTrigger>
          <TabsTrigger value="stats" className="font-arabic">
            <BarChart3 className="w-4 h-4 ml-2" />
            الإحصائيات
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-arabic flex items-center gap-2">
                <Shield className="w-5 h-5" />
                إعدادات EmailJS للإشعارات الحقيقية
              </CardTitle>
              <CardDescription className="font-arabic">
                كوّن EmailJS لإرسال إشعارات حقيقية عبر البريد الإلكتروني بدون خادم خلفي
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Switch
                  id="emailjs-enabled"
                  checked={emailJSSettings.enabled}
                  onCheckedChange={(checked) =>
                    setEmailJSSettings(prev => ({ ...prev, enabled: checked }))
                  }
                />
                <Label htmlFor="emailjs-enabled" className="font-arabic">
                  تفعيل نظام الإشعارات الحقي��ية (EmailJS)
                </Label>
              </div>

              {emailJSSettings.enabled && (
                <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription className="font-arabic">
                      📧 <strong>الإشعارات الحقيقية:</strong> سيتم إرسال رسائل بريد إلكتروني حقيقية للمرضى عبر خدمة EmailJS.
                      تأكد من إكمال إعداد EmailJS أولاً (راجع تبويب "دليل الإعداد").
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="service-id" className="font-arabic">Service ID</Label>
                      <Input
                        id="service-id"
                        value={emailJSSettings.serviceId}
                        onChange={(e) =>
                          setEmailJSSettings(prev => ({ ...prev, serviceId: e.target.value }))
                        }
                        placeholder="service_xxxxxxx"
                        dir="ltr"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="template-id" className="font-arabic">Template ID</Label>
                      <Input
                        id="template-id"
                        value={emailJSSettings.templateId}
                        onChange={(e) =>
                          setEmailJSSettings(prev => ({ ...prev, templateId: e.target.value }))
                        }
                        placeholder="template_xxxxxxx"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="public-key" className="font-arabic">Public Key</Label>
                    <Input
                      id="public-key"
                      value={emailJSSettings.publicKey}
                      onChange={(e) =>
                        setEmailJSSettings(prev => ({ ...prev, publicKey: e.target.value }))
                      }
                      placeholder="your_public_key_here"
                      dir="ltr"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sender-name" className="font-arabic">اسم المرسل</Label>
                      <Input
                        id="sender-name"
                        value={emailJSSettings.senderName}
                        onChange={(e) =>
                          setEmailJSSettings(prev => ({ ...prev, senderName: e.target.value }))
                        }
                        placeholder="عيادة الدكتور كمال الملصي"
                        className="font-arabic"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sender-email" className="font-arabic">بريد المرسل</Label>
                      <Input
                        id="sender-email"
                        type="email"
                        value={emailJSSettings.senderEmail}
                        onChange={(e) =>
                          setEmailJSSettings(prev => ({ ...prev, senderEmail: e.target.value }))
                        }
                        placeholder="info@clinic.com"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription className="font-arabic">
                      <strong>أمان البيانات:</strong> جميع ��لإعدادات تُحفظ محلياً في متصفحك ولا تُرسل لأي خادم خارجي.
                      EmailJS آمن ولا يكشف بيانات حساسة.
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              <Separator />

              <div className="flex gap-4">
                <Button onClick={saveEmailJSSettings} disabled={isLoading} className="font-arabic">
                  {isLoading ? "جاري الحفظ..." : "حفظ الإعدادات"}
                </Button>
                
                {emailJSSettings.enabled && (
                  <Button variant="outline" onClick={testEmailJSConnection} disabled={isTesting} className="font-arabic">
                    {isTesting ? "جاري الاختبار..." : "اختبار الاتصال"}
                  </Button>
                )}

                <Button 
                  variant="ghost" 
                  onClick={() => setActiveTab("guide")} 
                  className="font-arabic"
                >
                  <HelpCircle className="w-4 h-4 ml-2" />
                  دليل الإعداد
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="test" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-arabic">اختبار النظام الحقيقي</CardTitle>
              <CardDescription className="font-arabic">
                إرسال رسائل بريد إلكتروني حقيقية للتأكد من صحة الإعدادات
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="test-email" className="font-arabic">البريد الإلكتروني للاختبار</Label>
                <Input
                  id="test-email"
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="test@example.com"
                  dir="ltr"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-dashed">
                  <CardContent className="p-4">
                    <h4 className="font-bold mb-2 font-arabic">�� اختبار بسيط</h4>
                    <p className="text-sm text-gray-600 mb-3 font-arabic">
                      يرسل بريد إلكتروني بسيط للتأكد من صحة إعدادات EmailJS
                    </p>
                    <Button
                      onClick={sendTestEmail}
                      disabled={isTesting || !testEmail || !emailJSSettings.enabled}
                      className="w-full font-arabic"
                      variant="outline"
                    >
                      <TestTube className="w-4 h-4 ml-2" />
                      {isTesting ? "جاري الإرسال..." : "اختبار بسيط"}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-dashed border-dental-primary">
                  <CardContent className="p-4">
                    <h4 className="font-bold mb-2 font-arabic text-dental-primary">📧 محاكاة حجز حقيقي</h4>
                    <p className="text-sm text-gray-600 mb-3 font-arabic">
                      يرسل إشعار تأكيد حجز كامل مع جميع التفاصيل (الأفضل للاختبار)
                    </p>
                    <Button
                      onClick={sendTestBookingNotification}
                      disabled={isTesting || !testEmail || !emailJSSettings.enabled}
                      className="w-full font-arabic"
                    >
                      <Send className="w-4 h-4 ml-2" />
                      {isTesting ? "جاري الإرسال..." : "اختبار تأكيد حجز"}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {!emailJSSettings.enabled && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="font-arabic">
                    يجب تفعيل نظام الإشعارات وإعداد EmailJS أولاً من تبويب الإعدادات
                  </AlertDescription>
                </Alert>
              )}

              {emailJSSettings.enabled && connectionStatus === ConnectionStatus.CONNECTED && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription className="font-arabic">
                    ✅ النظام متصل ومستعد للإرسال! جرب "اختبار تأكيد حجز" للحصول على أفضل تجربة.
                  </AlertDescription>
                </Alert>
              )}

              {emailJSSettings.enabled && connectionStatus === ConnectionStatus.ERROR && (
                <EmailJSTroubleshooter
                  connectionStatus={connectionStatus}
                  hasServiceId={!!emailJSSettings.serviceId}
                  hasTemplateId={!!emailJSSettings.templateId}
                  hasPublicKey={!!emailJSSettings.publicKey}
                  hasSenderEmail={!!emailJSSettings.senderEmail}
                  onRetry={testEmailJSConnection}
                />
              )}

              {emailJSSettings.enabled && connectionStatus === ConnectionStatus.CONFIGURED && (
                <Alert>
                  <Activity className="w-4 h-4" />
                  <AlertDescription className="font-arabic">
                    ⚠️ <strong>النظام مُعَدّ ولكن لم يتم اختباره بعد.</strong>
                    للتأكد من عمل النظام، اضغط "اختبار الاتصال" أو جرب إرسال رسالة اختبار.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guide" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-arabic">دليل إعداد EmailJS</CardTitle>
              <CardDescription className="font-arabic">
                اتبع هذه الخطوات لإعداد نظام الإشعارات الحقيقية
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {SETUP_GUIDE.steps.map((step, index) => (
                  <AccordionItem key={index} value={`step-${index}`}>
                    <AccordionTrigger className="font-arabic text-right">
                      {step.title}
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <p className="font-arabic">{step.description}</p>
                      <ul className="list-disc list-inside space-y-2 font-arabic">
                        {step.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="text-sm text-gray-600">{detail}</li>
                        ))}
                      </ul>
                      {index === 0 && (
                        <Button 
                          variant="outline" 
                          onClick={() => window.open('https://www.emailjs.com', '_blank')}
                          className="font-arabic"
                        >
                          <ExternalLink className="w-4 h-4 ml-2" />
                          زيارة موقع EmailJS
                        </Button>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              <Separator className="my-6" />

              <div className="space-y-4">
                <h3 className="text-lg font-bold font-arabic">قوالب البريد الإلكتروني المطلوبة</h3>
                <p className="text-sm text-gray-600 font-arabic">
                  يمكنك استخدام قالب واحد لجميع أنواع الإشعارات أو إنشاء قوالب منفصلة
                </p>
                
                {Object.entries(EMAIL_TEMPLATES).map(([key, template]) => (
                  <Card key={key} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <h4 className="font-bold font-arabic mb-2">{template.name}</h4>
                      <p className="text-sm text-gray-600 font-arabic mb-3">{template.description}</p>
                      <div className="space-y-2">
                        <Label className="font-arabic text-sm">المتغيرات المطلوب��:</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {template.variables.map((variable) => (
                            <div key={variable} className="flex items-center gap-1">
                              <code className="text-xs bg-gray-100 px-1 rounded">{`{{${variable}}}`}</code>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyToClipboard(`{{${variable}}}`)}
                                className="h-6 w-6 p-0"
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <h3 className="text-lg font-bold font-arabic">استكشاف الأخطاء وإصلاحها</h3>
                
                {SETUP_GUIDE.troubleshooting.map((item, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <h4 className="font-bold font-arabic mb-2 text-red-600">{item.issue}</h4>
                      <ul className="list-disc list-inside space-y-1 font-arabic">
                        {item.solutions.map((solution, solutionIndex) => (
                          <li key={solutionIndex} className="text-sm text-gray-600">{solution}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 font-arabic">إجمالي الإشعارات</p>
                    <p className="text-2xl font-bold text-dental-primary">{notificationStats?.total || 0}</p>
                  </div>
                  <Mail className="h-8 w-8 text-dental-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 font-arabic">تم الإرسال بنجاح</p>
                    <p className="text-2xl font-bold text-green-600">{notificationStats?.successful || 0}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 font-arabic">فشل في الإرسال</p>
                    <p className="text-2xl font-bold text-red-600">{notificationStats?.failed || 0}</p>
                  </div>
                  <XCircle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 font-arabic">نظام EmailJS</p>
                    <p className="text-sm font-bold text-blue-600">إشعارات حقيقية</p>
                  </div>
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="font-arabic">
              <strong>ملاحظة:</strong> الإحصائيات المعروضة هنا للإشعارات السابقة فقط. 
              الإشعارات الجديدة عبر EmailJS سيتم إرسالها مباشرة بدون تسجيل محلي.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  );
}
