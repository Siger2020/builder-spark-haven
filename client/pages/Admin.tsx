import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import SystemSettings from "@/components/SystemSettings";
import ExportReports from "@/components/ExportReports";
import ClinicCustomization from "@/components/ClinicCustomization";
import NotificationCenter from "@/components/NotificationCenter";
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
  Download,
  MessageSquare,
  Loader2,
  Palette,
  Trash2,
} from "lucide-react";

interface DashboardStats {
  totalPatients: number;
  totalAppointments: number;
  totalServices: number;
  totalTransactions: number;
  completedAppointments: number;
  scheduledAppointments: number;
  cancelledAppointments: number;
  pendingAppointments: number;
  canceledAppointments: number;
  monthlyRevenue: number;
  outstandingPayments: number;
}

interface RecentAppointment {
  id: number;
  appointment_number: string;
  patient_name: string;
  appointment_time: string;
  service_name: string;
  doctor_name: string;
  status: string;
}

const getAppointmentStatusBadge = (status: string) => {
  switch (status) {
    case "confirmed":
      return <Badge className="bg-green-100 text-green-800">مؤكد</Badge>;
    case "scheduled":
      return <Badge className="bg-blue-100 text-blue-800">مجدول</Badge>;
    case "completed":
      return <Badge className="bg-gray-100 text-gray-800">مكتمل</Badge>;
    case "cancelled":
      return <Badge className="bg-red-100 text-red-800">ملغي</Badge>;
    case "no_show":
      return <Badge className="bg-orange-100 text-orange-800">لم يحضر</Badge>;
    default:
      return <Badge variant="secondary">{status || "غير محدد"}</Badge>;
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

function AdminComponent() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("today");
  const [systemSettingsOpen, setSystemSettingsOpen] = useState(false);
  const [settingsType, setSettingsType] = useState<
    "general" | "users" | "security" | "backup" | "notifications"
  >("general");
  const [exportReportsOpen, setExportReportsOpen] = useState(false);
  const [notificationCenterOpen, setNotificationCenterOpen] = useState(false);
  const [clinicCustomizationOpen, setClinicCustomizationOpen] = useState(false);

  // Real data states
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalPatients: 0,
    totalAppointments: 0,
    totalServices: 0,
    totalTransactions: 0,
    completedAppointments: 0,
    scheduledAppointments: 0,
    cancelledAppointments: 0,
    pendingAppointments: 0,
    canceledAppointments: 0,
    monthlyRevenue: 0,
    outstandingPayments: 0,
  });

  // Mock data for missing variables
  const alerts = [
    {
      id: 1,
      type: "urgent",
      message: "موعد طارئ - أحمد محمد - يحتاج إلى متابعة فورية",
      time: "منذ 5 دقائ��",
    },
    {
      id: 2,
      type: "payment",
      message: "مبلغ مستحق - فاطمة أحمد - 150 ر.ي",
      time: "منذ ساعة",
    },
    {
      id: 3,
      type: "appointment",
      message: "موعد جديد تم حجزه - محمد علي - غداً الساعة 10:00",
      time: "منذ ساعتين",
    },
  ];

  const topServices = [
    { name: "تنظيف الأسنان", count: 45, revenue: 22500, percentage: 85 },
    { name: "حشو الأسنان", count: 32, revenue: 19200, percentage: 65 },
    { name: "تقويم الأسنان", count: 18, revenue: 27000, percentage: 45 },
    { name: "تركيب التيجان", count: 12, revenue: 24000, percentage: 30 },
  ];

  const doctors = [
    {
      id: 1,
      name: "د. كمال الملصي",
      specialty: "طبيب أسنان عام",
      rating: 4.9,
      patients: 156,
      appointments: 89,
    },
    {
      id: 2,
      name: "د. سارة أحمد",
      specialty: "تقويم الأسنان",
      rating: 4.8,
      patients: 98,
      appointments: 52,
    },
  ];
  const [recentAppointments, setRecentAppointments] = useState<
    RecentAppointment[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch database statistics
      const statsResponse = await fetch("/api/database/stats");
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();

        setDashboardStats({
          totalPatients: statsData.data.patients || 0,
          totalAppointments: statsData.data.appointments || 0,
          totalServices: statsData.data.services || 0,
          totalTransactions: statsData.data.financial_transactions || 0,
          completedAppointments: 0, // Will be calculated from appointments
          scheduledAppointments: 0,
          cancelledAppointments: 0,
          pendingAppointments: 0,
          canceledAppointments: 0,
          monthlyRevenue: 125000, // Mock data
          outstandingPayments: 15000, // Mock data
        });
      }

      // Fetch recent appointments
      const appointmentsResponse = await fetch("/api/bookings");
      if (appointmentsResponse.ok) {
        const appointmentsData = await appointmentsResponse.json();
        const appointments = appointmentsData.data || [];

        // Calculate appointment statistics
        const completed = appointments.filter(
          (a: any) => a.status === "completed",
        ).length;
        const scheduled = appointments.filter(
          (a: any) => a.status === "scheduled" || a.status === "confirmed",
        ).length;
        const cancelled = appointments.filter(
          (a: any) => a.status === "cancelled",
        ).length;
        const pending = appointments.filter(
          (a: any) => a.status === "pending",
        ).length;

        setDashboardStats((prev) => ({
          ...prev,
          completedAppointments: completed,
          scheduledAppointments: scheduled,
          cancelledAppointments: cancelled,
          pendingAppointments: pending,
          canceledAppointments: cancelled,
        }));

        // Set recent appointments (latest 5)
        const recentAppointmentsData = appointments
          .slice(0, 5)
          .map((apt: any) => ({
            id: apt.id,
            appointment_number: apt.appointment_number,
            patient_name: apt.patient_name,
            appointment_time: apt.appointment_time,
            service_name: apt.service_name || apt.chief_complaint,
            doctor_name: apt.doctor_name || "د. كمال الملصي",
            status: apt.status,
          }));

        setRecentAppointments(recentAppointmentsData);
      }
    } catch (error) {
      console.error("خ��أ في ��لب بيانات لوحة التحكم:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="mr-3 font-arabic">
              جاري تحميل بيانات لوحة التحكم...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-arabic">
              لوحة الإدارة
            </h1>
            <p className="text-gray-600 font-arabic">
              نظام إداري متكامل لمتابعة جميع عمليات العيادة
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="font-arabic"
              onClick={fetchDashboardData}
            >
              <Download className="h-4 w-4 mr-2" />
              تحديث البيانات
            </Button>
            <Button
              className="font-arabic"
              onClick={() => setNotificationCenterOpen(true)}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              مركز الإشعارات
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-arabic">
                إجمالي المرضى
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardStats.totalPatients}
              </div>
              <p className="text-xs text-muted-foreground font-arabic">
                مرضى مسجلين في النظام
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-arabic">
                إجمالي ال��واعيد
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardStats.totalAppointments}
              </div>
              <p className="text-xs text-muted-foreground font-arabic">
                {dashboardStats.completedAppointments} مكتمل،{" "}
                {dashboardStats.scheduledAppointments} مجدول
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-arabic">
                الخدمات المتاحة
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardStats.totalServices}
              </div>
              <p className="text-xs text-muted-foreground font-arabic">
                خدمات طبية متاحة
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-arabic">
                المعاملات المالية
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardStats.totalTransactions}
              </div>
              <p className="text-xs text-muted-foreground font-arabic">
                معاملة مالي�� م��جلة
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
                    <CardTitle className="font-arabic">
                      ��لمواعيد اليوم
                    </CardTitle>
                    <CardDescription className="font-arabic">
                      قائمة بمواعيد اليوم وحالتها
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {recentAppointments.length === 0 ? (
                      <div className="text-center py-8">
                        <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600 font-arabic">
                          لا توجد مواعيد حديثة
                        </p>
                        <Link to="/appointment-management">
                          <Button className="mt-4 font-arabic">
                            إدارة المواعيد
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="font-arabic">
                              رقم الموعد
                            </TableHead>
                            <TableHead className="font-arabic">
                              المريض
                            </TableHead>
                            <TableHead className="font-arabic">الوقت</TableHead>
                            <TableHead className="font-arabic">
                              الخدمة
                            </TableHead>
                            <TableHead className="font-arabic">
                              الطبيب
                            </TableHead>
                            <TableHead className="font-arabic">
                              الحالة
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {recentAppointments.map((appointment) => (
                            <TableRow key={appointment.id}>
                              <TableCell className="font-mono text-sm">
                                {appointment.appointment_number}
                              </TableCell>
                              <TableCell className="font-arabic">
                                {appointment.patient_name}
                              </TableCell>
                              <TableCell className="font-medium">
                                {appointment.appointment_time}
                              </TableCell>
                              <TableCell className="font-arabic">
                                {appointment.service_name}
                              </TableCell>
                              <TableCell className="font-arabic">
                                {appointment.doctor_name}
                              </TableCell>
                              <TableCell>
                                {getAppointmentStatusBadge(appointment.status)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
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
                      <div
                        key={alert.id}
                        className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        {getAlertIcon(alert.type)}
                        <div className="flex-1">
                          <p className="text-sm font-arabic">{alert.message}</p>
                          <p className="text-xs text-gray-500 font-arabic">
                            {alert.time}
                          </p>
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
                  <CardTitle className="font-arabic">
                    ��كثر الخدمات طلباً
                  </CardTitle>
                  <CardDescription className="font-arabic">
                    إح��ائيات الخدمات الأكثر حجزاً هذا الشهر
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topServices.map((service, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          <div>
                            <div className="font-medium font-arabic">
                              {service.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {service.count} مريض
                            </div>
                          </div>
                        </div>
                        <div className="text-left">
                          <div className="font-medium">
                            {service.revenue.toLocaleString()} ر.ي
                          </div>
                          <Progress
                            value={service.percentage}
                            className="w-16 mt-1"
                          />
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

              {/* System Reset Card */}
              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="font-arabic text-orange-700">
                    إعادة تعيين النظام
                  </CardTitle>
                  <CardDescription className="font-arabic">
                    إدارة البيانات التجريبية وال��ختبارية
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm text-gray-600 font-arabic mb-4">
                    <p>هل انتهيت من اختبار النظام؟</p>
                    <p>يمكنك حذف البيانات التجريبية والبدء مع بيانات حقيقية.</p>
                  </div>

                  <Link to="/system-reset">
                    <Button className="w-full font-arabic" variant="outline">
                      <Trash2 className="h-4 w-4 mr-2" />
                      إدارة إعادة التعيين
                    </Button>
                  </Link>

                  <div className="pt-2 border-t">
                    <p className="text-xs text-gray-500 font-arabic">
                      💡 نصيحة: احذف البيانات التجريبية قبل البدء بالاستخدام الفعلي
                    </p>
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
                          <div className="text-lg font-bold">
                            {dashboardStats.completedAppointments}
                          </div>
                          <div className="text-sm text-gray-500 font-arabic">
                            مكتمل
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-yellow-500" />
                        <div>
                          <div className="text-lg font-bold">
                            {dashboardStats.pendingAppointments}
                          </div>
                          <div className="text-sm text-gray-500 font-arabic">
                            في الانتظار
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                        <div>
                          <div className="text-lg font-bold">
                            {dashboardStats.canceledAppointments}
                          </div>
                          <div className="text-sm text-gray-500 font-arabic">
                            ملغي
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-500" />
                        <div>
                          <div className="text-lg font-bold">
                            {dashboardStats.totalAppointments}
                          </div>
                          <div className="text-sm text-gray-500 font-arabic">
                            الإجمالي
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="text-center py-8">
                  <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 font-arabic">
                    سيتم إضافة تقويم ا��مواعيد التفاعلي قريباً
                  </p>
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
                    {dashboardStats.monthlyRevenue.toLocaleString()} ر.ي
                  </div>
                  <p className="text-sm text-gray-500 font-arabic">هذا الشهر</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="font-arabic">
                    المبالغ المستحقة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {dashboardStats.outstandingPayments.toLocaleString()} ر.ي
                  </div>
                  <p className="text-sm text-gray-500 font-arabic">
                    ��بالغ غير محصلة
                  </p>
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
                  <p className="text-gray-600 font-arabic">
                    سيتم إضافة الرسوم البيانية المالية قريباً
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="staff" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-arabic">الطاقم الطبي</CardTitle>
                <CardDescription className="font-arabic">
                  إدارة الأطباء وإحصائيات ا��أداء
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {doctors.map((doctor) => (
                    <Card key={doctor.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-bold font-arabic">
                              {doctor.name}
                            </h3>
                            <p className="text-sm text-gray-500 font-arabic">
                              {doctor.specialty}
                            </p>
                          </div>
                          <div className="text-left">
                            <div className="text-lg font-bold">
                              {doctor.rating}
                            </div>
                            <div className="text-sm text-yellow-500">★★★★★</div>
                          </div>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-lg font-bold">
                              {doctor.patients}
                            </div>
                            <div className="text-sm text-gray-500 font-arabic">
                              مريض
                            </div>
                          </div>
                          <div>
                            <div className="text-lg font-bold">
                              {doctor.appointments}
                            </div>
                            <div className="text-sm text-gray-500 font-arabic">
                              موعد هذا الشهر
                            </div>
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
                    تخصيص إعدادات ��لعيادة
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    className="w-full font-arabic"
                    variant="outline"
                    onClick={() => {
                      setSettingsType("general");
                      setSystemSettingsOpen(true);
                    }}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    إعدادا�� عامة
                  </Button>
                  <Button
                    className="w-full font-arabic"
                    variant="outline"
                    onClick={() => {
                      setSettingsType("users");
                      setSystemSettingsOpen(true);
                    }}
                  >
                    <UserCheck className="h-4 w-4 mr-2" />
                    إ��ارة المستخدمين
                  </Button>
                  <Button
                    className="w-full font-arabic"
                    variant="outline"
                    onClick={() => {
                      setSettingsType("security");
                      setSystemSettingsOpen(true);
                    }}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    الأمان والخصوصية
                  </Button>
                  <Button
                    className="w-full font-arabic"
                    variant="outline"
                    onClick={() => {
                      setSettingsType("backup");
                      setSystemSettingsOpen(true);
                    }}
                  >
                    <Database className="h-4 w-4 mr-2" />
                    الن��خ الاحتياطي
                  </Button>
                  <Button
                    className="w-full font-arabic"
                    variant="outline"
                    onClick={() => {
                      setSettingsType("notifications");
                      setSystemSettingsOpen(true);
                    }}
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    إعدادات الإشعارات
                  </Button>
                  <Button
                    className="w-full font-arabic"
                    variant="outline"
                    onClick={() => setClinicCustomizationOpen(true)}
                  >
                    <Palette className="h-4 w-4 mr-2" />
                    تخصيص الواجهة
                  </Button>
                  <Link to="/database">
                    <Button className="w-full font-arabic" variant="outline">
                      <Database className="h-4 w-4 mr-2" />
                      إدارة قاعدة البيانات
                    </Button>
                  </Link>
                  <Link to="/system-reset">
                    <Button className="w-full font-arabic" variant="outline">
                      <Database className="h-4 w-4 mr-2" />
                      إعادة تعيين النظام
                    </Button>
                  </Link>
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
                      <span className="font-arabic">ا��نسخ الاحتياطي</span>
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

        {/* System Settings Dialog */}
        <SystemSettings
          isOpen={systemSettingsOpen}
          onClose={() => setSystemSettingsOpen(false)}
          type={settingsType}
        />

        {/* Export Reports Dialog */}
        <ExportReports
          isOpen={exportReportsOpen}
          onClose={() => setExportReportsOpen(false)}
        />

        {/* Notification Center Dialog */}
        <NotificationCenter
          isOpen={notificationCenterOpen}
          onClose={() => setNotificationCenterOpen(false)}
        />

        {/* Clinic Customization Dialog */}
        {clinicCustomizationOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold font-arabic">
                    تخصيص العيادة
                  </h2>
                  <Button
                    variant="outline"
                    onClick={() => setClinicCustomizationOpen(false)}
                    className="font-arabic"
                  >
                    إغلاق
                  </Button>
                </div>
                <ClinicCustomization />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Error Boundary wrapper
class AdminErrorBoundary extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Admin component error:", error, errorInfo);
  }

  render() {
    if ((this.state as any).hasError) {
      return (
        <div className="container mx-auto p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              خطأ في تحميل لوحة الإدارة
            </h1>
            <p className="text-gray-600 mb-4">
              حدث خطأ غير متوقع. يرجى إعادة تحميل الصفحة.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              إعادة تحميل
            </button>
          </div>
        </div>
      );
    }

    return React.createElement(AdminComponent, this.props);
  }
}

export default AdminErrorBoundary;
