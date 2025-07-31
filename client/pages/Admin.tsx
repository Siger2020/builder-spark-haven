import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Settings,
  BarChart3,
  PieChart,
  Target,
  Zap,
  UserCheck,
  CreditCard,
  Bell,
  Shield,
  Database,
  Download
} from "lucide-react";

// Mock data for dashboard
const dashboardStats = {
  totalPatients: 247,
  activePatients: 189,
  newPatientsThisMonth: 23,
  totalAppointments: 156,
  completedAppointments: 134,
  canceledAppointments: 8,
  pendingAppointments: 14,
  monthlyRevenue: 87500,
  outstandingPayments: 12300,
  treatmentSuccess: 94,
  patientSatisfaction: 98
};

const recentAppointments = [
  {
    id: "APP-001",
    patientName: "أحمد محمد السعد",
    time: "09:00",
    service: "تنظيف الأسنان",
    doctor: "د. سارة أحمد",
    status: "confirmed"
  },
  {
    id: "APP-002", 
    patientName: "فاطمة أحمد العلي",
    time: "10:30",
    service: "تقويم الأسنان",
    doctor: "د. محمد علي",
    status: "pending"
  },
  {
    id: "APP-003",
    patientName: "محمد علي القحطاني",
    time: "14:00",
    service: "زراعة الأسنان",
    doctor: "د. نورا سالم",
    status: "confirmed"
  },
  {
    id: "APP-004",
    patientName: "نورا سالم الحربي",
    time: "16:30",
    service: "تبييض الأسنان",
    doctor: "د. أحمد محمد",
    status: "canceled"
  }
];

const alerts = [
  {
    id: 1,
    type: "urgent",
    message: "مريض يحتاج متابعة فورية - محمد علي القحطاني",
    time: "منذ 5 دقائق"
  },
  {
    id: 2,
    type: "payment",
    message: "دفعة متأخرة - فاطمة أحمد العلي (1500 ريال)",
    time: "منذ ساعة"
  },
  {
    id: 3,
    type: "appointment",
    message: "تم إلغاء موعد - سارة خالد المطيري",
    time: "منذ ساعتين"
  },
  {
    id: 4,
    type: "system",
    message: "تم تحديث النظام بنجاح",
    time: "منذ 3 ساعات"
  }
];

const topServices = [
  { name: "تنظيف الأسنان", count: 45, revenue: 9000, percentage: 35 },
  { name: "حشوات الأسنان", count: 32, revenue: 9600, percentage: 25 },
  { name: "تقويم الأسنان", count: 18, revenue: 54000, percentage: 15 },
  { name: "زراعة الأسنان", count: 12, revenue: 30000, percentage: 10 },
  { name: "تبييض الأسنان", count: 21, revenue: 16800, percentage: 15 }
];

const doctors = [
  {
    id: 1,
    name: "د. سارة أحمد",
    specialty: "طب الأسنان العام",
    patients: 67,
    appointments: 34,
    rating: 4.9
  },
  {
    id: 2,
    name: "د. محمد علي",
    specialty: "تقويم الأسنان",
    patients: 43,
    appointments: 28,
    rating: 4.8
  },
  {
    id: 3,
    name: "د. نورا سالم",
    specialty: "جراحة الفم",
    patients: 38,
    appointments: 22,
    rating: 4.9
  },
  {
    id: 4,
    name: "د. أحمد محمد",
    specialty: "تجميل الأسنان",
    patients: 29,
    appointments: 18,
    rating: 4.7
  }
];

const getAppointmentStatusBadge = (status: string) => {
  switch (status) {
    case "confirmed":
      return <Badge className="bg-green-100 text-green-800">مؤكد</Badge>;
    case "pending":
      return <Badge className="bg-yellow-100 text-yellow-800">في الانتظار</Badge>;
    case "canceled":
      return <Badge className="bg-red-100 text-red-800">ملغي</Badge>;
    default:
      return <Badge variant="secondary">غير محدد</Badge>;
  }
};

const getAlertIcon = (type: string) => {
  switch (type) {
    case "urgent":
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    case "payment":
      return <CreditCard className="h-4 w-4 text-yellow-500" />;
    case "appointment":
      return <Calendar className="h-4 w-4 text-blue-500" />;
    case "system":
      return <Settings className="h-4 w-4 text-green-500" />;
    default:
      return <Bell className="h-4 w-4 text-gray-500" />;
  }
};

export default function Admin() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("today");

  return (
    <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-arabic">لوحة الإدارة</h1>
            <p className="text-gray-600 font-arabic">نظام إداري متكامل لمتابعة جميع عمليات العيادة</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="font-arabic">
              <Download className="h-4 w-4 mr-2" />
              تصدير التقرير
            </Button>
            <Button className="font-arabic">
              <Settings className="h-4 w-4 mr-2" />
              إعدادات النظام
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-arabic">إجمالي المرضى</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.totalPatients}</div>
              <p className="text-xs text-muted-foreground font-arabic">
                <TrendingUp className="h-4 w-4 inline mr-1" />
                +{dashboardStats.newPatientsThisMonth} هذا الشهر
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-arabic">المواعيد اليوم</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.totalAppointments}</div>
              <p className="text-xs text-muted-foreground font-arabic">
                {dashboardStats.completedAppointments} مكتمل، {dashboardStats.pendingAppointments} في الانتظار
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-arabic">الإيرادات الشهرية</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.monthlyRevenue.toLocaleString()} ريال</div>
              <p className="text-xs text-muted-foreground font-arabic">
                <TrendingUp className="h-4 w-4 inline mr-1 text-green-500" />
                +15% من الشهر الماضي
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-arabic">معدل النجاح</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{dashboardStats.treatmentSuccess}%</div>
              <p className="text-xs text-muted-foreground font-arabic">
                نسبة نجاح العلاجات
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="font-arabic">
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="appointments">المواعيد</TabsTrigger>
            <TabsTrigger value="finances">المالية</TabsTrigger>
            <TabsTrigger value="staff">الطاقم الطبي</TabsTrigger>
            <TabsTrigger value="settings">الإعدادات</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Appointments */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-arabic">المواعيد اليوم</CardTitle>
                    <CardDescription className="font-arabic">
                      قائمة بمواعيد اليوم وحالتها
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="font-arabic">الوقت</TableHead>
                          <TableHead className="font-arabic">المريض</TableHead>
                          <TableHead className="font-arabic">الخدمة</TableHead>
                          <TableHead className="font-arabic">الطبيب</TableHead>
                          <TableHead className="font-arabic">الحالة</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentAppointments.map((appointment) => (
                          <TableRow key={appointment.id}>
                            <TableCell className="font-medium">{appointment.time}</TableCell>
                            <TableCell className="font-arabic">{appointment.patientName}</TableCell>
                            <TableCell className="font-arabic">{appointment.service}</TableCell>
                            <TableCell className="font-arabic">{appointment.doctor}</TableCell>
                            <TableCell>{getAppointmentStatusBadge(appointment.status)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>

              {/* Alerts and Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-arabic">التنبيهات</CardTitle>
                  <CardDescription className="font-arabic">
                    آخر التحديثات والتنبيهات المهمة
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {alerts.map((alert) => (
                      <div key={alert.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        {getAlertIcon(alert.type)}
                        <div className="flex-1">
                          <p className="text-sm font-arabic">{alert.message}</p>
                          <p className="text-xs text-gray-500 font-arabic">{alert.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Service Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-arabic">أكثر الخدمات طلباً</CardTitle>
                  <CardDescription className="font-arabic">
                    إحصائيات الخدمات الأكثر حجزاً هذا الشهر
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topServices.map((service, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          <div>
                            <div className="font-medium font-arabic">{service.name}</div>
                            <div className="text-sm text-gray-500">{service.count} مريض</div>
                          </div>
                        </div>
                        <div className="text-left">
                          <div className="font-medium">{service.revenue.toLocaleString()} ريال</div>
                          <Progress value={service.percentage} className="w-16 mt-1" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-arabic">الأداء اليومي</CardTitle>
                  <CardDescription className="font-arabic">
                    مؤشرات الأداء الرئيسية لليوم
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-arabic">المواعيد المكتملة</span>
                      <div className="flex items-center gap-2">
                        <Progress value={86} className="w-20" />
                        <span className="text-sm">86%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-arabic">رضا المرضى</span>
                      <div className="flex items-center gap-2">
                        <Progress value={98} className="w-20" />
                        <span className="text-sm">98%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-arabic">الالتزام بالمواعيد</span>
                      <div className="flex items-center gap-2">
                        <Progress value={92} className="w-20" />
                        <span className="text-sm">92%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-arabic">معدل التحصيل</span>
                      <div className="flex items-center gap-2">
                        <Progress value={87} className="w-20" />
                        <span className="text-sm">87%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-arabic">إدارة المواعيد</CardTitle>
                <CardDescription className="font-arabic">
                  نظرة شاملة على جميع المواعيد وإحصائياتها
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <div>
                          <div className="text-lg font-bold">{dashboardStats.completedAppointments}</div>
                          <div className="text-sm text-gray-500 font-arabic">مكتمل</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-yellow-500" />
                        <div>
                          <div className="text-lg font-bold">{dashboardStats.pendingAppointments}</div>
                          <div className="text-sm text-gray-500 font-arabic">في الانتظار</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                        <div>
                          <div className="text-lg font-bold">{dashboardStats.canceledAppointments}</div>
                          <div className="text-sm text-gray-500 font-arabic">ملغي</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-500" />
                        <div>
                          <div className="text-lg font-bold">{dashboardStats.totalAppointments}</div>
                          <div className="text-sm text-gray-500 font-arabic">الإجمالي</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="text-center py-8">
                  <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 font-arabic">سيتم إضافة تقويم المواعيد التفاعلي قريباً</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="finances" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-arabic">الإيرادات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {dashboardStats.monthlyRevenue.toLocaleString()} ريال
                  </div>
                  <p className="text-sm text-gray-500 font-arabic">هذا الشهر</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="font-arabic">المبالغ المستحقة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {dashboardStats.outstandingPayments.toLocaleString()} ريال
                  </div>
                  <p className="text-sm text-gray-500 font-arabic">مبالغ غير محصلة</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="font-arabic">معدل التحصيل</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">87%</div>
                  <Progress value={87} className="mt-2" />
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="font-arabic">التحليل المالي</CardTitle>
                <CardDescription className="font-arabic">
                  رسوم بيانية للإيرادات والمصروفات
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 font-arabic">سيتم إضافة الرسوم البيانية المالية قريباً</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="staff" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-arabic">الطاقم الطبي</CardTitle>
                <CardDescription className="font-arabic">
                  إدارة الأطباء وإحصائيات الأداء
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {doctors.map((doctor) => (
                    <Card key={doctor.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-bold font-arabic">{doctor.name}</h3>
                            <p className="text-sm text-gray-500 font-arabic">{doctor.specialty}</p>
                          </div>
                          <div className="text-left">
                            <div className="text-lg font-bold">{doctor.rating}</div>
                            <div className="text-sm text-yellow-500">★★★★★</div>
                          </div>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-lg font-bold">{doctor.patients}</div>
                            <div className="text-sm text-gray-500 font-arabic">مريض</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold">{doctor.appointments}</div>
                            <div className="text-sm text-gray-500 font-arabic">موعد هذا الشهر</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-arabic">إعدادات النظام</CardTitle>
                  <CardDescription className="font-arabic">
                    تخصيص إعدادات العيادة
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full font-arabic" variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    إعدادات عامة
                  </Button>
                  <Button className="w-full font-arabic" variant="outline">
                    <UserCheck className="h-4 w-4 mr-2" />
                    إدارة المستخدمين
                  </Button>
                  <Button className="w-full font-arabic" variant="outline">
                    <Shield className="h-4 w-4 mr-2" />
                    الأمان والخصوصية
                  </Button>
                  <Button className="w-full font-arabic" variant="outline">
                    <Database className="h-4 w-4 mr-2" />
                    النسخ الاحتياطي
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-arabic">إحصائيات النظام</CardTitle>
                  <CardDescription className="font-arabic">
                    معلومات حول حالة النظام
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-arabic">أداء النظام</span>
                      <div className="flex items-center gap-2">
                        <Progress value={95} className="w-20" />
                        <span className="text-sm">95%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-arabic">مساحة التخزين</span>
                      <div className="flex items-center gap-2">
                        <Progress value={67} className="w-20" />
                        <span className="text-sm">67%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-arabic">النسخ الاحتياطي</span>
                      <Badge className="bg-green-100 text-green-800">نشط</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-arabic">آخر تحديث</span>
                      <span className="text-sm">اليوم</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
