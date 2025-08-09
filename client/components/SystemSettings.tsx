import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { NativeSelect as Select, NativeSelectItem as SelectItem } from "@/components/ui/native-select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Settings,
  UserCheck,
  Shield,
  Database,
  Download,
  MessageSquare,
  Phone,
  Mail,
  Bell,
  Users,
  Key,
  Trash2,
  Edit,
  Plus,
  Check,
  X
} from "lucide-react";

interface SystemSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'general' | 'users' | 'security' | 'backup' | 'notifications';
}

// Mock data for users
const users = [
  {
    id: 1,
    name: "د. سارة أحمد",
    email: "sara@clinic.com",
    role: "admin",
    status: "active",
    lastLogin: "2024-01-15"
  },
  {
    id: 2,
    name: "د. محمد علي",
    email: "mohammed@clinic.com",
    role: "doctor",
    status: "active",
    lastLogin: "2024-01-14"
  },
  {
    id: 3,
    name: "فاطمة الأحمد",
    email: "fatima@clinic.com",
    role: "receptionist",
    status: "inactive",
    lastLogin: "2024-01-10"
  }
];

const SecuritySettings = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-arabic">إعدادات كلمة المرور</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="font-arabic">طول كلمة المرور الأدنى</Label>
            <Input type="number" defaultValue="8" className="w-20" />
          </div>
          <div className="flex items-center justify-between">
            <Label className="font-arabic">يجب تضمين أرقام</Label>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label className="font-arabic">يجب تضمين رموز خ��صة</Label>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label className="font-arabic">انتهاء صلاحية كلمة المرور (��يام)</Label>
            <Input type="number" defaultValue="90" className="w-20" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-arabic">إعدادات تسجيل الدخول</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="font-arabic">عدد المحاولات المسموحة</Label>
            <Input type="number" defaultValue="3" className="w-20" />
          </div>
          <div className="flex items-center justify-between">
            <Label className="font-arabic">مدة الحظر (دقائق)</Label>
            <Input type="number" defaultValue="15" className="w-20" />
          </div>
          <div className="flex items-center justify-between">
            <Label className="font-arabic">تفعيل المصادقة ال��نائية</Label>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-arabic">تسجيل العمليات</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="font-arabic">تسجيل تسجيل الدخول</Label>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label className="font-arabic">تسجيل العمليات المالية</Label>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label className="font-arabic">تسجيل تعديل البيا��ات</Label>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const UserManagement = () => {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [usersList, setUsersList] = useState(users);
  const [isLoading, setIsLoading] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: '',
    password: ''
  });
  const [editingUser, setEditingUser] = useState<any>(null);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);

  // Load users from database
  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/database/tables/users');
      const data = await response.json();

      if (data.success && data.data) {
        // Transform database users to match our interface
        const transformedUsers = data.data.map((user: any) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.is_active ? 'active' : 'inactive',
          lastLogin: user.updated_at ? new Date(user.updated_at).toISOString().split('T')[0] : 'لم يسجل دخول'
        }));
        setUsersList(transformedUsers);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load users when component mounts
  React.useEffect(() => {
    loadUsers();
  }, []);

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.role || !newUser.password) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newUser.name,
          email: newUser.email,
          password: newUser.password,
          role: newUser.role,
        }),
      });

      if (response.ok) {
        const result = await response.json();

        // Refresh the users list from database
        await loadUsers();

        setNewUser({ name: '', email: '', role: '', password: '' });
        setIsAddUserOpen(false);
        alert('تم إضافة المستخدم بنجاح');
      } else {
        const error = await response.json();
        alert(`خطأ في إضافة المستخدم: ${error.error || 'حدث خطأ غير متوقع'}`);
      }
    } catch (error) {
      console.error('Error adding user:', error);
      alert('حدث خطأ أثناء إضافة المستخدم. يرجى المحاولة مرة أخرى.');
    }
  };

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setNewUser({
      name: user.name,
      email: user.email,
      role: user.role,
      password: ''
    });
    setIsEditUserOpen(true);
  };

  const handleUpdateUser = () => {
    if (!newUser.name || !newUser.email || !newUser.role) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setUsersList(usersList.map(user =>
      user.id === editingUser.id
        ? { ...user, name: newUser.name, email: newUser.email, role: newUser.role }
        : user
    ));

    setNewUser({ name: '', email: '', role: '', password: '' });
    setEditingUser(null);
    setIsEditUserOpen(false);
    alert('تم تحديث بيانات المستخدم بنجاح');
  };

  const handleDeleteUser = (userId: number) => {
    if (confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
      setUsersList(usersList.filter(user => user.id !== userId));
      alert('تم حذف المستخدم بنجاح');
    }
  };

  const getRoleBadge = (role: string) => {
    const roleColors = {
      admin: "bg-red-100 text-red-800",
      doctor: "bg-blue-100 text-blue-800",
      receptionist: "bg-green-100 text-green-800"
    };
    const roleNames = {
      admin: "مدير",
      doctor: "طبيب",
      receptionist: "استقبال"
    };
    return (
      <Badge className={roleColors[role as keyof typeof roleColors]}>
        {roleNames[role as keyof typeof roleNames]}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    return status === "active" ? (
      <Badge className="bg-green-100 text-green-800">نشط</Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800">غير ��شط</Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold font-arabic">إ��ارة المستخدمين</h3>
        <Button onClick={() => setIsAddUserOpen(true)} className="font-arabic">
          <Plus className="h-4 w-4 mr-2" />
          إضافة مستخدم
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-arabic">الاسم</TableHead>
            <TableHead className="font-arabic">البريد الإلكتروني</TableHead>
            <TableHead className="font-arabic">الدور</TableHead>
            <TableHead className="font-arabic">الحالة</TableHead>
            <TableHead className="font-arabic">آخر دخول</TableHead>
            <TableHead className="font-arabic">الإجرا��ا��</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {usersList.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-arabic">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{getRoleBadge(user.role)}</TableCell>
              <TableCell>{getStatusBadge(user.status)}</TableCell>
              <TableCell>{typeof user.lastLogin === 'string' && user.lastLogin !== 'لم يسجل دخول' ? new Date(user.lastLogin).toLocaleDateString('ar-SA') : user.lastLogin}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEditUser(user)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDeleteUser(user.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Add User Dialog */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent className="sm:max-w-[500px]" dir="rtl">
          <DialogHeader>
            <DialogTitle className="font-arabic">إ��افة مستخدم جديد</DialogTitle>
            <DialogDescription className="font-arabic">
              أدخل بيانات المستخدم ا��ج��يد
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="font-arabic">الاسم الكامل</Label>
              <Input
                placeholder="أدخل الاسم ال��امل"
                className="font-arabic"
                value={newUser.name}
                onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label className="font-arabic">ا��بريد الإلكتروني</Label>
              <Input
                type="email"
                placeholder="email@example.com"
                value={newUser.email}
                onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label className="font-arabic">الدور</Label>
              <Select
                value={newUser.role}
                onValueChange={(value) => setNewUser(prev => ({ ...prev, role: value }))}
                placeholder="اختر الدور"
                className="font-arabic"
              >
                <SelectItem value="admin">مدير</SelectItem>
                <SelectItem value="doctor">طبيب</SelectItem>
                <SelectItem value="receptionist">��ستقبال</SelectItem>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="font-arabic">كلمة المرور</Label>
              <Input
                type="password"
                placeholder="كلمة المرور"
                value={newUser.password}
                onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUserOpen(false)} className="font-arabic">
              إلغاء
            </Button>
            <Button onClick={handleAddUser} className="font-arabic">إضافة المستخدم</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent className="sm:max-w-[500px]" dir="rtl">
          <DialogHeader>
            <DialogTitle className="font-arabic">تعديل بيانات المستخدم</DialogTitle>
            <DialogDescription className="font-arabic">
              تحديث بيانات المستخدم
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="font-arabic">الاسم الكامل</Label>
              <Input
                placeholder="أدخل الاسم الكامل"
                className="font-arabic"
                value={newUser.name}
                onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label className="font-arabic">البريد الإلكتروني</Label>
              <Input
                type="email"
                placeholder="email@example.com"
                value={newUser.email}
                onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label className="font-arabic">الدور</Label>
              <Select
                value={newUser.role}
                onValueChange={(value) => setNewUser(prev => ({ ...prev, role: value }))}
                className="font-arabic"
              >
                <SelectItem value="admin">مدير</SelectItem>
                <SelectItem value="doctor">طبيب</SelectItem>
                <SelectItem value="receptionist">استقبال</SelectItem>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditUserOpen(false)} className="font-arabic">
              إلغاء
            </Button>
            <Button onClick={handleUpdateUser} className="font-arabic">حفظ التغييرات</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const BackupSettings = () => {
  const handleCreateBackup = async () => {
    try {
      const response = await fetch('/api/database/backup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert('تم إنشاء النسخة الاحتياطية بنجاح!');
      } else {
        alert('حدث خطأ أ��ناء إنشاء النسخة الاحتياطية');
      }
    } catch (error) {
      console.error('Backup error:', error);
      alert('حدث خطأ أثناء إنشاء النسخة الاحتياطية');
    }
  };

  const handleDownloadBackup = async () => {
    try {
      const response = await fetch('/api/database/backups');
      const data = await response.json();

      if (data.success && data.data.length > 0) {
        const latestBackup = data.data[0];
        alert(`آخر نسخة احتياطية: ${latestBackup.backup_name} - ${new Date(latestBackup.created_at).toLocaleDateString('ar-SA')}`);
      } else {
        alert('لا توجد نسخ احتياطية متاحة');
      }
    } catch (error) {
      console.error('Download backup error:', error);
      alert('حدث خطأ أثناء تحميل النسخة الاحتياطية');
    }
  };

  const handleRestoreBackup = () => {
    if (confirm('تحذير: استعادة البيانات ستحل محل جميع البيانات الحالية. هل أنت ��تأكد؟')) {
      alert('سيتم إضافة وظيفة الاستعادة قريباً');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-arabic">النسخ الاحتياطي التلقائ��</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="font-arabic">تفعيل النسخ التلقائي</Label>
            <Switch defaultChecked />
          </div>
          <div className="space-y-2">
            <Label className="font-arabic">تكرار النسخ</Label>
            <Select value="daily" className="font-arabic">
              <SelectItem value="daily">يومياً</SelectItem>
              <SelectItem value="weekly">أسبوعياً</SelectItem>
              <SelectItem value="monthly">شهرياً</SelectItem>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="font-arabic">وقت النسخ</Label>
            <Input type="time" defaultValue="02:00" />
          </div>
          <div className="flex items-center justify-between">
            <Label className="font-arabic">الاحتفاظ بالنسخ (أيام)</Label>
            <Input type="number" defaultValue="30" className="w-20" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-arabic">النسخ اليدوي</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 font-arabic">
            يمكنك إنشاء نسخة احتياطية فورية من جميع البيانات
          </p>
          <div className="flex gap-4">
            <Button onClick={handleCreateBackup} className="font-arabic">
              <Database className="h-4 w-4 mr-2" />
              إنشاء نسخة احتياطية الآن
            </Button>
            <Button onClick={handleDownloadBackup} variant="outline" className="font-arabic">
              <Download className="h-4 w-4 mr-2" />
              تحميل آخر نسخة
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-arabic">استعادة البيانات</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-red-600 font-arabic">
            تحذير: استعادة البيانات ستحل محل جميع البيانات الحالية
          </p>
          <Button onClick={handleRestoreBackup} variant="destructive" className="font-arabic">
            استعادة من نسخة احتياطية
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

const GeneralSettings = () => {
  const [settings, setSettings] = useState({
    clinicName: 'عيادة الأسنان المتقدمة',
    address: 'شارع الملك فهد، الرياض، المملكة العربية السعودية',
    phone: '+966 11 234 5678',
    email: 'info@dentalclinic.com',
    workingHours: '8:00 - 18:00',
    timezone: 'Asia/Riyadh',
    currency: 'SAR',
    language: 'ar'
  });

  const handleSaveSettings = () => {
    // Here you would normally save to API
    alert('تم حفظ الإعدادات بنجاح!');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-arabic">معلومات العيادة</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="font-arabic">اسم الع��ادة</Label>
            <Input defaultValue="عيادة الأسنان المتقدمة" className="font-arabic" />
          </div>
          <div className="space-y-2">
            <Label className="font-arabic">العنوان</Label>
            <Textarea defaultValue="شارع الملك فهد، الرياض، المملكة العربية السعودية" className="font-arabic" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-arabic">رقم الهاتف</Label>
              <Input defaultValue="+967 777 123 456" />
            </div>
            <div className="space-y-2">
              <Label className="font-arabic">البريد الإلكتروني</Label>
              <Input defaultValue="info@dentalclinic.sa" />
            </div>
          </div>
          <div className="mt-6">
            <Button onClick={handleSaveSettings} className="font-arabic">
              حفظ الإعدادات
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-arabic">ساعات العمل</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-arabic">من ��لسبت إل�� الخميس</Label>
              <div className="flex gap-2">
                <Input type="time" defaultValue="09:00" />
                <span className="self-center font-arabic">إلى</span>
                <Input type="time" defaultValue="21:00" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="font-arabic">يوم الجمعة</Label>
              <div className="flex gap-2">
                <Input type="time" defaultValue="14:00" />
                <span className="self-center font-arabic">إلى</span>
                <Input type="time" defaultValue="21:00" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-arabic">إعدادات النظام</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="font-arabic">المنطقة الزمنية</Label>
            <Select value="riyadh" className="font-arabic">
              <SelectItem value="riyadh">الرياض (GMT+3)</SelectItem>
              <SelectItem value="jeddah">جدة (GMT+3)</SelectItem>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="font-arabic">العمل��</Label>
            <Select value="sar" className="font-arabic">
              <SelectItem value="yer">ريال يمني (YER)</SelectItem>
              <SelectItem value="sar">ريال سعودي (SAR)</SelectItem>
              <SelectItem value="usd">دولار أمريكي (USD)</SelectItem>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label className="font-arabic">تفعيل الإشعارات</Label>
            <Switch defaultChecked />
          </div>
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
          <CardTitle className="font-arabic">إعدادات الإشعارات</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-arabic">إشعارات البريد الإلكتروني</Label>
              <p className="text-sm text-gray-500 font-arabic">تلقي إشعارات عبر البريد الإلكتروني</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-arabic">إشعارات ال��سائل النصية</Label>
              <p className="text-sm text-gray-500 font-arabic">تلقي إشعارات عبر الرسائل النصية</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-arabic">إشعارات الوا��س آب</Label>
              <p className="text-sm text-gray-500 font-arabic">تلقي إشعارات عبر الوا��س آب</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-arabic">أنواع الإشعارات</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="font-arabic">مواعيد ��ديدة</Label>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label className="font-arabic">إلغاء الموا��يد</Label>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label className="font-arabic">تذكير بالمواعيد</Label>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label className="font-arabic">مدفوع��ت جديدة</Label>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label className="font-arabic">مدفوعات ��تأخرة</Label>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label className="font-arabic">حالات طارئة</Label>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-arabic">إعدادات الواتس آب</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="font-arabic">رقم الواتس آب للعيادة</Label>
            <Input placeholder="+966 50 123 4567" />
          </div>
          <div className="space-y-2">
            <Label className="font-arabic">مفتاح API للواتس آب</Label>
            <Input type="password" placeholder="أدخل مفتاح API" />
          </div>
          <Button className="font-arabic">
            <Check className="h-4 w-4 mr-2" />
            اختبار الاتصال
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export function SystemSettings({ isOpen, onClose, type }: SystemSettingsProps) {
  const getTitle = () => {
    switch (type) {
      case 'general': return 'الإعدادات العامة';
      case 'users': return 'إدارة المستخدم��ن';
      case 'security': return 'الأمان والخصوصية';
      case 'backup': return 'النسخ الاحتياطي';
      case 'notifications': return 'إعدادات الإشعارات';
      default: return 'إعدادات النظام';
    }
  };

  const renderContent = () => {
    switch (type) {
      case 'general': return <GeneralSettings />;
      case 'users': return <UserManagement />;
      case 'security': return <SecuritySettings />;
      case 'backup': return <BackupSettings />;
      case 'notifications': return <NotificationSettings />;
      default: return <GeneralSettings />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="font-arabic">{getTitle()}</DialogTitle>
          <DialogDescription className="font-arabic">
            تخصيص وإدارة إعدادات النظام
          </DialogDescription>
        </DialogHeader>
        {renderContent()}
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="font-arabic">
            إلغاء
          </Button>
          <Button className="font-arabic">حفظ التغييرات</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Export for use in Admin page
export default SystemSettings;
