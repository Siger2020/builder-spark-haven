import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
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
  Eye,
  EyeOff,
} from "lucide-react";

interface EmailSettings {
  enabled: boolean;
  service: string;
  host?: string;
  port: number;
  secure: boolean;
  username: string;
  from_name: string;
  hasPassword: boolean;
}

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
  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    enabled: false,
    service: 'gmail',
    host: '',
    port: 587,
    secure: false,
    username: '',
    from_name: 'عيادة الدكتور كمال الملصي',
    hasPassword: false,
  });
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [notificationLogs, setNotificationLogs] = useState<NotificationLog[]>([]);
  const [notificationStats, setNotificationStats] = useState<NotificationStats | null>(null);

  // تحميل إعدادات البريد الإلكتروني
  const loadEmailSettings = async () => {
    try {
      const response = await fetch('/api/notifications/email-settings');
      const data = await response.json();
      
      if (data.success) {
        setEmailSettings(data.data);
      }
    } catch (error) {
      console.error('Error loading email settings:', error);
      toast.error('خطأ في تحميل إعدادات البريد الإلكتروني');
    }
  };

  // تحميل سجل الإشعارات
  const loadNotificationLogs = async () => {
    try {
      const response = await fetch('/api/notifications/logs?limit=50');
      const data = await response.json();
      
      if (data.success) {
        setNotificationLogs(data.data);
      }
    } catch (error) {
      console.error('Error loading notification logs:', error);
      toast.error('خطأ في تحميل سجل الإشعارات');
    }
  };

  // تحميل إحصائيات الإشعارات
  const loadNotificationStats = async () => {
    try {
      const response = await fetch('/api/notifications/stats');
      const data = await response.json();
      
      if (data.success) {
        setNotificationStats(data.data);
      }
    } catch (error) {
      console.error('Error loading notification stats:', error);
      toast.error('خطأ في تحميل إحصائيات الإشعارات');
    }
  };

  // حفظ إعدادات البريد الإلكتروني
  const saveEmailSettings = async () => {
    setIsLoading(true);
    
    try {
      const settingsToSave = {
        ...emailSettings,
        password: password || undefined
      };

      const response = await fetch('/api/notifications/email-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settingsToSave),
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success(data.message);
        setPassword(''); // مسح كلمة المرور بعد الحفظ
        loadEmailSettings(); // إعادة تحميل الإعدادات
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      console.error('Error saving email settings:', error);
      toast.error('خطأ في حفظ إعدادات البريد الإلكتروني');
    } finally {
      setIsLoading(false);
    }
  };

  // اختبار إعدادات البريد الإلكتروني
  const testEmailSettings = async () => {
    setIsTesting(true);
    
    try {
      const response = await fetch('/api/notifications/test-email-settings', {
        method: 'POST',
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      console.error('Error testing email settings:', error);
      toast.error('خطأ في اختبار إعدادات البريد الإلكتروني');
    } finally {
      setIsTesting(false);
    }
  };

  // إرسال بريد اختبار
  const sendTestEmail = async () => {
    if (!testEmail) {
      toast.error('يرجى إدخال بريد إلكتروني للاختبار');
      return;
    }

    setIsTesting(true);

    try {
      const response = await fetch('/api/notifications/send-test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: testEmail }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        setTestEmail('');
        loadNotificationLogs(); // إعادة تحميل السجل
        loadNotificationStats(); // إعادة ت��ميل الإحصائيات
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      console.error('Error sending test email:', error);
      toast.error('خطأ في إرسال بريد الاختبار');
    } finally {
      setIsTesting(false);
    }
  };

  // اختبار إشعار حجز حقيقي
  const sendTestBookingNotification = async () => {
    if (!testEmail) {
      toast.error('يرجى إدخال بريد إلكتروني للاختبار');
      return;
    }

    setIsTesting(true);

    try {
      const response = await fetch('/api/notifications/test-booking-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: testEmail }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`${data.message} - رقم الموعد: ${data.appointmentId}`);
        setTestEmail('');
        loadNotificationLogs(); // إعادة تحميل السجل
        loadNotificationStats(); // إعادة تحميل الإحصائيات
      } else {
        toast.error(data.error);
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
    loadEmailSettings();
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
        return '��';
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl" dir="rtl">
      <div className="flex items-center gap-4 mb-8">
        <Mail className="h-8 w-8 text-dental-primary" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-arabic">إدارة الإشعارات</h1>
          <p className="text-gray-600 font-arabic">إعداد وإدارة نظام الإشعارات بالبريد الإلكتروني</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="settings" className="font-arabic">
            <Settings className="w-4 h-4 ml-2" />
            الإعدادات
          </TabsTrigger>
          <TabsTrigger value="test" className="font-arabic">
            <TestTube className="w-4 h-4 ml-2" />
            الاختبار
          </TabsTrigger>
          <TabsTrigger value="logs" className="font-arabic">
            <History className="w-4 h-4 ml-2" />
            السجل
          </TabsTrigger>
          <TabsTrigger value="stats" className="font-arabic">
            <BarChart3 className="w-4 h-4 ml-2" />
            الإحصائيات
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-arabic">إعدادات البريد الإلكتروني</CardTitle>
              <CardDescription className="font-arabic">
                تكوين خدمة البريد الإلكتروني لإرسال الإشعارات
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Switch
                  id="email-enabled"
                  checked={emailSettings.enabled}
                  onCheckedChange={(checked) =>
                    setEmailSettings(prev => ({ ...prev, enabled: checked }))
                  }
                />
                <Label htmlFor="email-enabled" className="font-arabic">
                  تفعيل نظام الإشعارات بالبريد الإلكتروني
                </Label>
              </div>

              {emailSettings.enabled && (
                <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="service" className="font-arabic">نوع الخدمة</Label>
                      <Select
                        value={emailSettings.service}
                        onValueChange={(value) =>
                          setEmailSettings(prev => ({ 
                            ...prev, 
                            service: value,
                            host: value === 'smtp' ? prev.host : '',
                            port: value === 'gmail' ? 587 : value === 'outlook' ? 587 : prev.port
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gmail">Gmail</SelectItem>
                          <SelectItem value="outlook">Outlook/Hotmail</SelectItem>
                          <SelectItem value="yahoo">Yahoo</SelectItem>
                          <SelectItem value="smtp">SMTP مخصص</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="from_name" className="font-arabic">اسم المرسل</Label>
                      <Input
                        id="from_name"
                        value={emailSettings.from_name}
                        onChange={(e) =>
                          setEmailSettings(prev => ({ ...prev, from_name: e.target.value }))
                        }
                        placeholder="عيادة الدكتور كمال الملصي"
                        className="font-arabic"
                      />
                    </div>
                  </div>

                  {emailSettings.service === 'smtp' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="host" className="font-arabic">خادم SMTP</Label>
                        <Input
                          id="host"
                          value={emailSettings.host || ''}
                          onChange={(e) =>
                            setEmailSettings(prev => ({ ...prev, host: e.target.value }))
                          }
                          placeholder="smtp.example.com"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="port" className="font-arabic">منفذ SMTP</Label>
                        <Input
                          id="port"
                          type="number"
                          value={emailSettings.port}
                          onChange={(e) =>
                            setEmailSettings(prev => ({ ...prev, port: parseInt(e.target.value) || 587 }))
                          }
                          placeholder="587"
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="username" className="font-arabic">البريد الإلكتروني</Label>
                      <Input
                        id="username"
                        type="email"
                        value={emailSettings.username}
                        onChange={(e) =>
                          setEmailSettings(prev => ({ ...prev, username: e.target.value }))
                        }
                        placeholder="your-email@gmail.com"
                        dir="ltr"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="font-arabic">
                        كلمة المرور
                        {emailSettings.hasPassword && (
                          <span className="text-green-600 text-sm mr-2">✓ محفوظة</span>
                        )}
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder={emailSettings.hasPassword ? "• • • • • • • •" : "كلمة المرور"}
                          dir="ltr"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute left-2 top-1/2 transform -translate-y-1/2"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {emailSettings.service === 'smtp' && (
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Switch
                        id="secure"
                        checked={emailSettings.secure}
                        onCheckedChange={(checked) =>
                          setEmailSettings(prev => ({ ...prev, secure: checked }))
                        }
                      />
                      <Label htmlFor="secure" className="font-arabic">
                        اتصال آمن (SSL/TLS)
                      </Label>
                    </div>
                  )}

                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription className="font-arabic">
                      تأكد من استخدام كلمة مرور التطبيق (App Password) بدلاً من كلمة المرور العادية للحسابات مع التحقق بخطوتين.
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              <Separator />

              <div className="flex gap-4">
                <Button onClick={saveEmailSettings} disabled={isLoading} className="font-arabic">
                  {isLoading ? "جاري الحفظ..." : "حفظ الإعدادات"}
                </Button>
                
                {emailSettings.enabled && (
                  <Button variant="outline" onClick={testEmailSettings} disabled={isTesting} className="font-arabic">
                    {isTesting ? "جاري الاختبار..." : "اختبار الاتصال"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="test" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-arabic">اختبار النظام</CardTitle>
              <CardDescription className="font-arabic">
                إرسال بريد اختبار للتأكد من صحة الإعدادات
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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

              <Button 
                onClick={sendTestEmail} 
                disabled={isTesting || !testEmail || !emailSettings.enabled}
                className="font-arabic"
              >
                <Send className="w-4 h-4 ml-2" />
                {isTesting ? "جاري الإرسال..." : "إرسال بريد اختبار"}
              </Button>

              {!emailSettings.enabled && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="font-arabic">
                    يجب تفعيل نظام الإشعارات أولاً من تبويب الإعدادات
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-arabic">سجل الإشعارات</CardTitle>
              <CardDescription className="font-arabic">
                سجل جميع الإشعارات المرسلة وحالة التسليم
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notificationLogs.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 font-arabic">
                    لا توجد إشعارات مرسلة بعد
                  </div>
                ) : (
                  <div className="space-y-2">
                    {notificationLogs.map((log) => (
                      <div key={log.id} className="border rounded-lg p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{getNotificationTypeIcon(log.notification_type)}</span>
                            <span className="font-bold font-arabic">{log.recipient_name}</span>
                            <Badge variant="outline" className="font-arabic">
                              {log.notification_type === 'confirmation' && 'تأكيد موعد'}
                              {log.notification_type === 'reminder' && 'تذكير موعد'}
                              {log.notification_type === 'cancellation' && 'إلغاء موعد'}
                              {log.notification_type === 'test' && 'بريد اختبار'}
                            </Badge>
                          </div>
                          {getStatusBadge(log.delivery_status)}
                        </div>
                        
                        <div className="text-sm text-gray-600 space-y-1">
                          <div><strong>البريد الإلكتروني:</strong> {log.recipient_email}</div>
                          <div><strong>الموضوع:</strong> {log.subject}</div>
                          {log.appointment_id && (
                            <div><strong>رقم الموعد:</strong> {log.appointment_id}</div>
                          )}
                          <div><strong>وقت الإرسال:</strong> {
                            log.sent_at ? new Date(log.sent_at).toLocaleString('ar-EG') : 'لم يتم الإرسال'
                          }</div>
                          {log.error_message && (
                            <div className="text-red-600"><strong>خطأ:</strong> {log.error_message}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                    <p className="text-sm font-medium text-gray-600 font-arabic">في الانتظار</p>
                    <p className="text-2xl font-bold text-yellow-600">{notificationStats?.pending || 0}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {notificationStats?.byType && notificationStats.byType.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-arabic">إحصائيات حسب نوع الإشعار</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notificationStats.byType.map((stat) => (
                    <div key={stat.notification_type} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getNotificationTypeIcon(stat.notification_type)}</span>
                          <span className="font-bold font-arabic">
                            {stat.notification_type === 'confirmation' && 'تأكيد المواعيد'}
                            {stat.notification_type === 'reminder' && 'تذكير المواعيد'}
                            {stat.notification_type === 'cancellation' && 'إلغاء المواعيد'}
                            {stat.notification_type === 'test' && 'رسائل الاختبار'}
                          </span>
                        </div>
                        <span className="text-lg font-bold">{stat.total}</span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <div className="text-green-600 font-bold">{stat.successful}</div>
                          <div className="text-gray-600 font-arabic">نجح</div>
                        </div>
                        <div className="text-center">
                          <div className="text-red-600 font-bold">{stat.failed}</div>
                          <div className="text-gray-600 font-arabic">فشل</div>
                        </div>
                        <div className="text-center">
                          <div className="text-yellow-600 font-bold">{stat.pending}</div>
                          <div className="text-gray-600 font-arabic">انتظار</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
