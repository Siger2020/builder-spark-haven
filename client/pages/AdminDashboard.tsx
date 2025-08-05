import { useState, useEffect } from "react";
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
import {
  Users,
  Calendar,
  FileText,
  DollarSign,
  Database,
  Settings,
  UserCheck,
  BarChart3,
  Shield,
  Activity,
  Loader2,
  RefreshCw,
  Download,
  Plus,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Mail,
} from "lucide-react";

interface DashboardStats {
  totalPatients: number;
  totalAppointments: number;
  totalServices: number;
  totalTransactions: number;
  totalUsers: number;
  totalDoctors: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    totalAppointments: 0,
    totalServices: 0,
    totalTransactions: 0,
    totalUsers: 0,
    totalDoctors: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/database/stats');
      
      if (response.ok) {
        const data = await response.json();
        setStats({
          totalPatients: data.data.patients || 0,
          totalAppointments: data.data.appointments || 0,
          totalServices: data.data.services || 0,
          totalTransactions: data.data.financial_transactions || 0,
          totalUsers: data.data.users || 0,
          totalDoctors: data.data.doctors || 0,
        });
      }
    } catch (error) {
      console.error('خطأ في جلب الإحصائيات:', error);
    } finally {
      setLoading(false);
    }
  };

  const managementSections = [
    {
      title: "إدارة المرضى",
      description: "إدارة ملفات المرضى والسجلات الطبية",
      icon: Users,
      path: "/patients",
      color: "bg-blue-500",
      count: stats.totalPatients,
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "إدارة المواعيد",
      description: "جدولة وإدارة المواعيد",
      icon: Calendar,
      path: "/appointment-management",
      color: "bg-green-500", 
      count: stats.totalAppointments,
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      title: "التقارير المالية",
      description: "المعاملات المالية والفواتير",
      icon: DollarSign,
      path: "/transactions",
      color: "bg-yellow-500",
      count: stats.totalTransactions,
      bgColor: "bg-yellow-50", 
      textColor: "text-yellow-600",
    },
    {
      title: "مراحل العلاج",
      description: "متابعة جلسات وخطط العلاج",
      icon: Activity,
      path: "/sessions",
      color: "bg-purple-500",
      count: 0,
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      title: "إدارة الإشعارات",
      description: "إعداد وإدارة نظام الإشعارات بالبريد الإلكتروني",
      icon: Mail,
      path: "/notifications",
      color: "bg-pink-500",
      count: null,
      bgColor: "bg-pink-50",
      textColor: "text-pink-600",
    },
    {
      title: "لوحة الإدارة",
      description: "إحصائيات ومعلومات شاملة",
      icon: BarChart3,
      path: "/admin",
      color: "bg-indigo-500",
      count: null,
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-600",
    },
    {
      title: "إدارة الموظفين",
      description: "الأطباء والموظفين",
      icon: UserCheck,
      path: "/reports",
      color: "bg-teal-500",
      count: stats.totalDoctors,
      bgColor: "bg-teal-50",
      textColor: "text-teal-600",
    },
    {
      title: "التقارير",
      description: "تقارير مفصلة وإحصائيات",
      icon: FileText,
      path: "/reports",
      color: "bg-orange-500",
      count: null,
      bgColor: "bg-orange-50", 
      textColor: "text-orange-600",
    },
    {
      title: "إدارة قاعدة البيانات",
      description: "إدارة البيانات والنسخ الاحتياطي",
      icon: Database,
      path: "/database",
      color: "bg-red-500",
      count: null,
      bgColor: "bg-red-50",
      textColor: "text-red-600",
    },
    {
      title: "الإعدادات",
      description: "إعدادات النظام والأمان",
      icon: Settings,
      path: "/system-check",
      color: "bg-gray-500",
      count: null,
      bgColor: "bg-gray-50",
      textColor: "text-gray-600",
    },
  ];

  const recentActivity = [
    {
      icon: Users,
      title: "مريض جديد",
      description: "تم تسجيل مريض جديد",
      time: "منذ 10 دقائق",
      color: "text-blue-500",
    },
    {
      icon: Calendar,
      title: "موعد جديد",
      description: "تم حجز موعد جديد",
      time: "منذ 30 دقيقة",
      color: "text-green-500",
    },
    {
      icon: DollarSign,
      title: "دفعة جديدة",
      description: "تم استلام دفعة مالية",
      time: "منذ ساعة",
      color: "text-yellow-500",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="mr-3 font-arabic">جاري تحميل لوحة التحكم...</span>
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
              لوحة تحكم المدير
            </h1>
            <p className="text-gray-600 font-arabic">
              إدارة شاملة لجميع أقسام العيادة
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={fetchDashboardStats}
              className="font-arabic"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              تحديث
            </Button>
            <Button className="font-arabic">
              <Download className="h-4 w-4 mr-2" />
              تصدير التقرير
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 font-arabic">
                    إجمالي المرضى
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalPatients}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 font-arabic">
                    المواعيد اليوم
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalAppointments}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 font-arabic">
                    الخدمات المتاحة
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalServices}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Activity className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 font-arabic">
                    المعاملات المالية
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalTransactions}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {managementSections.map((section, index) => {
            const Icon = section.icon;
            return (
              <Link key={index} to={section.path}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 ${section.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                      <Icon className={`h-6 w-6 ${section.textColor}`} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 font-arabic">
                      {section.title}
                    </h3>
                    <p className="text-gray-600 text-sm font-arabic mb-4">
                      {section.description}
                    </p>
                    {section.count !== null && (
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-gray-900">
                          {section.count}
                        </span>
                        <Badge variant="secondary" className="font-arabic">
                          عنصر
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-arabic">النشاط الأخير</CardTitle>
              <CardDescription className="font-arabic">
                آخر الأنشطة في النظام
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div key={index} className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center`}>
                        <Icon className={`h-5 w-5 ${activity.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium font-arabic">{activity.title}</p>
                        <p className="text-sm text-gray-600 font-arabic">
                          {activity.description}
                        </p>
                      </div>
                      <span className="text-sm text-gray-500">{activity.time}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-arabic">روابط سريعة</CardTitle>
              <CardDescription className="font-arabic">
                اختصارات للمهام الشائعة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Link to="/booking">
                  <Button className="w-full font-arabic" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    موعد جديد
                  </Button>
                </Link>
                <Link to="/patients">
                  <Button className="w-full font-arabic" variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    مريض جديد
                  </Button>
                </Link>
                <Link to="/transactions">
                  <Button className="w-full font-arabic" variant="outline">
                    <DollarSign className="h-4 w-4 mr-2" />
                    معاملة مالية
                  </Button>
                </Link>
                <Link to="/database">
                  <Button className="w-full font-arabic" variant="outline">
                    <Database className="h-4 w-4 mr-2" />
                    نسخة احتياطية
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
