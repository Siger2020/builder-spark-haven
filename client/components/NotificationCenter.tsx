import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect as Select, NativeSelectItem as SelectItem } from "@/components/ui/native-select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Bell,
  MessageSquare,
  Phone,
  Mail,
  Send,
  Settings,
  Users,
  Calendar,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Clock,
  Smartphone,
  MessageCircle
} from "lucide-react";

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock notification templates
const notificationTemplates = [
  {
    id: 1,
    name: "تذكير بالموعد",
    type: "appointment_reminder",
    channels: ["sms", "whatsapp"],
    content: "مرحباً {patient_name}، نذكرك بموعدك في عيادة الأسنان غداً الساع�� {appointment_time}. للاستفسار: {clinic_phone}",
    isActive: true
  },
  {
    id: 2,
    name: "تأكيد الحجز",
    type: "appointment_confirmation",
    channels: ["sms", "email"],
    content: "تم تأكيد حجز موعدك في {clinic_name} يوم {appointment_date} الساعة {appointment_time}. شكراً لك.",
    isActive: true
  },
  {
    id: 3,
    name: "طلب دفع",
    type: "payment_reminder",
    channels: ["sms", "whatsapp"],
    content: "لديك مبلغ مستحق {amount} ر.ي. يرجى زيارة العيادة أو التواصل معنا على {clinic_phone}",
    isActive: true
  },
  {
    id: 4,
    name: "إلغاء الموعد",
    type: "appointment_cancellation",
    channels: ["sms", "email", "whatsapp"],
    content: "تم إلغاء موعدك المجدول ليوم {appointment_date}. للحجز مرة أخرى اتصل بنا على {clinic_phone}",
    isActive: false
  }
];

// Mock sent notifications
const sentNotifications = [
  {
    id: 1,
    patientName: "أحمد محمد",
    phone: "+967 777 123 456",
    type: "appointment_reminder",
    channel: "whatsapp",
    status: "delivered",
    sentAt: "2024-01-15 10:30",
    content: "تذكير بالموعد غداً"
  },
  {
    id: 2,
    patientName: "فاطمة علي",
    phone: "+967 771 654 321",
    type: "payment_reminder",
    channel: "sms",
    status: "failed",
    sentAt: "2024-01-15 09:15",
    content: "طلب دفع مستحق"
  },
  {
    id: 3,
    patientName: "محمد سالم",
    phone: "+967 772 345 678",
    type: "appointment_confirmation",
    channel: "sms",
    status: "delivered",
    sentAt: "2024-01-14 16:45",
    content: "تأكيد حجز الموعد"
  }
];

const getChannelIcon = (channel: string) => {
  switch (channel) {
    case 'sms': return <Phone className="h-4 w-4" />;
    case 'whatsapp': return <MessageCircle className="h-4 w-4" />;
    case 'email': return <Mail className="h-4 w-4" />;
    default: return <Bell className="h-4 w-4" />;
  }
};

const getChannelBadge = (channel: string) => {
  const configs = {
    sms: { color: "bg-blue-100 text-blue-800", name: "رسالة نصية" },
    whatsapp: { color: "bg-green-100 text-green-800", name: "واتس آب" },
    email: { color: "bg-purple-100 text-purple-800", name: "إيميل" }
  };
  const config = configs[channel as keyof typeof configs] || { color: "bg-gray-100 text-gray-800", name: channel };
  return <Badge className={config.color}>{config.name}</Badge>;
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'delivered':
      return <Badge className="bg-green-100 text-green-800">تم التسليم</Badge>;
    case 'failed':
      return <Badge className="bg-red-100 text-red-800">فشل</Badge>;
    case 'pending':
      return <Badge className="bg-yellow-100 text-yellow-800">في الانتظار</Badge>;
    default:
      return <Badge variant="secondary">غير معروف</Badge>;
  }
};

export function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const [selectedTab, setSelectedTab] = useState("send");
  const [isNewTemplateOpen, setIsNewTemplateOpen] = useState(false);
  const [isSendNotificationOpen, setIsSendNotificationOpen] = useState(false);

  const SendNotification = () => {
    const [selectedPatients, setSelectedPatients] = useState<string[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState("");
    const [selectedChannel, setSelectedChannel] = useState("");
    const [customMessage, setCustomMessage] = useState("");

    const patients = [
      { id: "1", name: "أحمد محمد", phone: "+967 777 123 456" },
      { id: "2", name: "فاطمة علي", phone: "+967 771 654 321" },
      { id: "3", name: "محمد سالم", phone: "+967 772 345 678" }
    ];

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-arabic">إرسال إشعار جديد</CardTitle>
            <CardDescription className="font-arabic">
              اختر المرضى والقناة لإرسال الإشعار
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="font-arabic">اختر المرضى</Label>
              <Select>
                <SelectTrigger className="font-arabic">
                  <SelectValue placeholder="اختر المرضى المستهدفين" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="font-arabic">جميع المرضى</SelectItem>
                  <SelectItem value="today" className="font-arabic">مر��ى اليوم</SelectItem>
                  <SelectItem value="overdue" className="font-arabic">الم��أخرين في الدفع</SelectItem>
                  <SelectItem value="custom" className="font-arabic">اختيار محدد</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="font-arabic">قناة الإرسال</Label>
              <Select value={selectedChannel} onValueChange={setSelectedChannel}>
                <SelectTrigger className="font-arabic">
                  <SelectValue placeholder="اختر قناة الإرسال" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sms" className="font-arabic">رسالة نصية</SelectItem>
                  <SelectItem value="whatsapp" className="font-arabic">واتس آب</SelectItem>
                  <SelectItem value="email" className="font-arabic">بريد إلكتروني</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="font-arabic">قالب الرسالة</Label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger className="font-arabic">
                  <SelectValue placeholder="اختر قالب أو اكتب رسالة مخصصة" />
                </SelectTrigger>
                <SelectContent>
                  {notificationTemplates.map(template => (
                    <SelectItem key={template.id} value={template.id.toString()} className="font-arabic">
                      {template.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom" className="font-arabic">رسالة مخصصة</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="font-arabic">محتوى الرسالة</Label>
              <Textarea 
                placeholder="اكتب رسالتك هنا..."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="font-arabic"
                rows={4}
              />
              <p className="text-xs text-gray-500 font-arabic">
                يمكنك استخدام متغيرات مثل: {"{patient_name}"}, {"{appointment_date}"}, {"{clinic_phone}"}
              </p>
            </div>

            <div className="flex gap-4">
              <Button className="font-arabic">
                <Send className="h-4 w-4 mr-2" />
                إرسال ال��ن
              </Button>
              <Button variant="outline" className="font-arabic">
                جدولة الإرسال
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const NotificationTemplates = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold font-arabic">قوالب الإشعارات</h3>
          <Button onClick={() => setIsNewTemplateOpen(true)} className="font-arabic">
            إضافة قالب جديد
          </Button>
        </div>

        <div className="space-y-4">
          {notificationTemplates.map(template => (
            <Card key={template.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold font-arabic">{template.name}</h4>
                    <div className="flex gap-2 mt-1">
                      {template.channels.map(channel => (
                        <div key={channel}>{getChannelBadge(channel)}</div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={template.isActive} />
                    <Button size="sm" variant="outline">تعديل</Button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 font-arabic bg-gray-50 p-3 rounded">
                  {template.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const NotificationHistory = () => {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-arabic">��جل الإشعارات</CardTitle>
            <CardDescription className="font-arabic">
              جميع ال��شعارات المرسلة مؤخراً
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-arabic">المريض</TableHead>
                  <TableHead className="font-arabic">النوع</TableHead>
                  <TableHead className="font-arabic">القناة</TableHead>
                  <TableHead className="font-arabic">الحالة</TableHead>
                  <TableHead className="font-arabic">وقت الإرسال</TableHead>
                  <TableHead className="font-arabic">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sentNotifications.map(notification => (
                  <TableRow key={notification.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium font-arabic">{notification.patientName}</div>
                        <div className="text-sm text-gray-500">{notification.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-arabic">
                      {notificationTemplates.find(t => t.type === notification.type)?.name || notification.type}
                    </TableCell>
                    <TableCell>{getChannelBadge(notification.channel)}</TableCell>
                    <TableCell>{getStatusBadge(notification.status)}</TableCell>
                    <TableCell>{notification.sentAt}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" className="font-arabic">
                        إعادة الإرسال
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  };

  const NotificationSettings = () => {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-arabic">إعدادات الرسائل النصية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="font-arabic">مزود الخدمة</Label>
              <Select defaultValue="stc">
                <SelectTrigger className="font-arabic">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stc" className="font-arabic">STC</SelectItem>
                  <SelectItem value="mobily" className="font-arabic">موبايلي</SelectItem>
                  <SelectItem value="zain" className="font-arabic">زين</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="font-arabic">مفتاح API</Label>
              <Input type="password" placeholder="أدخل مفتاح API" />
            </div>
            <div className="space-y-2">
              <Label className="font-arabic">اسم المرسل</Label>
              <Input defaultValue="DentalClinic" />
            </div>
            <Button className="font-arabic">اختبار الاتصال</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-arabic">إعدادات الواتس آب</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="font-arabic">رقم الواتس آب التجاري</Label>
              <Input placeholder="+966 50 123 4567" />
            </div>
            <div className="space-y-2">
              <Label className="font-arabic">رمز التحقق</Label>
              <Input type="password" placeholder="رمز التحقق من الواتس آب" />
            </div>
            <div className="space-y-2">
              <Label className="font-arabic">مفتاح API للواتس آب</Label>
              <Input type="password" placeholder="مفتاح WhatsApp Business API" />
            </div>
            <Button className="font-arabic">تفعيل الواتس آب</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-arabic">إعدادات البريد الإلكتروني</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="font-arabic">خادم SMTP</Label>
              <Input defaultValue="smtp.gmail.com" />
            </div>
            <div className="space-y-2">
              <Label className="font-arabic">المنفذ</Label>
              <Input defaultValue="587" />
            </div>
            <div className="space-y-2">
              <Label className="font-arabic">البريد الإلكتروني</Label>
              <Input type="email" placeholder="clinic@example.com" />
            </div>
            <div className="space-y-2">
              <Label className="font-arabic">كلمة المرور</Label>
              <Input type="password" placeholder="كلمة مرور البريد" />
            </div>
            <Button className="font-arabic">اختبار البريد</Button>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[85vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="font-arabic">مركز الإشعارات</DialogTitle>
          <DialogDescription className="font-arabic">
            إدارة وإرسال الإشعارات عبر الرسائل النصية والواتس آب والبريد الإلكتروني
          </DialogDescription>
        </DialogHeader>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="font-arabic">
            <TabsTrigger value="send">إرسال إشعار</TabsTrigger>
            <TabsTrigger value="templates">القوالب</TabsTrigger>
            <TabsTrigger value="history">السجل</TabsTrigger>
            <TabsTrigger value="settings">الإعدادات</TabsTrigger>
          </TabsList>

          <TabsContent value="send">
            <SendNotification />
          </TabsContent>

          <TabsContent value="templates">
            <NotificationTemplates />
          </TabsContent>

          <TabsContent value="history">
            <NotificationHistory />
          </TabsContent>

          <TabsContent value="settings">
            <NotificationSettings />
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="font-arabic">
            إغلاق
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default NotificationCenter;
