import { useState, useEffect } from "react";
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
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
  Database,
  Server,
  Globe,
  Users,
  FileText,
  Settings,
  RefreshCw,
} from "lucide-react";

interface CheckResult {
  name: string;
  status: "success" | "error" | "warning";
  message: string;
  details?: string;
}

interface SystemStats {
  users: number;
  patients: number;
  doctors: number;
  appointments: number;
  services: number;
  transactions: number;
}

export default function SystemCheck() {
  const [isChecking, setIsChecking] = useState(false);
  const [checks, setChecks] = useState<CheckResult[]>([]);
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  useEffect(() => {
    runSystemCheck();
  }, []);

  const runSystemCheck = async () => {
    setIsChecking(true);
    setChecks([]);

    const checkResults: CheckResult[] = [];

    try {
      // فحص اتصال قاعدة البيانات
      checkResults.push(await checkDatabaseConnection());

      // فحص الجداول المطلوبة
      checkResults.push(await checkRequiredTables());

      // فحص البيانات الأساسية
      checkResults.push(await checkEssentialData());

      // فحص API endpoints
      checkResults.push(await checkAPIEndpoints());

      // فحص المستخدمين
      checkResults.push(await checkUsers());

      // فحص الخدمات
      checkResults.push(await checkServices());

      // جلب إحصائيات النظام
      await fetchSystemStats();

    } catch (error) {
      checkResults.push({
        name: "خطأ عام في الفحص",
        status: "error",
        message: "حدث خطأ أثناء فحص النظام",
        details: error.message,
      });
    }

    setChecks(checkResults);
    setLastCheck(new Date());
    setIsChecking(false);
  };

  const checkDatabaseConnection = async (): Promise<CheckResult> => {
    try {
      const response = await fetch("/api/database/stats");
      if (response.ok) {
        return {
          name: "اتصال قاعدة البيانات",
          status: "success",
          message: "قاعدة البيانات متصلة وتعمل بشكل طبيعي",
        };
      } else {
        return {
          name: "اتصال قاعدة البيانات",
          status: "error",
          message: "فشل في الاتصال بقاعدة البيانات",
        };
      }
    } catch (error) {
      return {
        name: "اتصال قاعدة البيانات",
        status: "error",
        message: "خطأ في الاتصال بقاعدة البيانات",
        details: error.message,
      };
    }
  };

  const checkRequiredTables = async (): Promise<CheckResult> => {
    try {
      const response = await fetch("/api/database/tables");
      if (response.ok) {
        const data = await response.json();
        const tables = data.data.map((t: any) => t.name);
        
        const requiredTables = [
          "users", "patients", "doctors", "services", "appointments",
          "medical_reports", "treatment_plans", "treatment_sessions",
          "financial_transactions", "invoices", "notifications",
          "system_settings", "inventory", "activity_logs"
        ];

        const missingTables = requiredTables.filter(table => !tables.includes(table));

        if (missingTables.length === 0) {
          return {
            name: "الجداول المطلوبة",
            status: "success",
            message: `جميع الجداول المطلوبة موجودة (${tables.length} جدول)`,
          };
        } else {
          return {
            name: "الجداول المطلوبة",
            status: "warning",
            message: `بعض الجداول مفقودة: ${missingTables.join(", ")}`,
          };
        }
      } else {
        return {
          name: "الجداول المطلوبة",
          status: "error",
          message: "فشل في فحص الجداول",
        };
      }
    } catch (error) {
      return {
        name: "الجداول المطلوبة",
        status: "error",
        message: "خطأ في فحص الجداول",
        details: error.message,
      };
    }
  };

  const checkEssentialData = async (): Promise<CheckResult> => {
    try {
      const [usersResponse, servicesResponse] = await Promise.all([
        fetch("/api/database/tables/users"),
        fetch("/api/database/tables/services"),
      ]);

      if (usersResponse.ok && servicesResponse.ok) {
        const usersData = await usersResponse.json();
        const servicesData = await servicesResponse.json();

        const adminExists = usersData.data.rows.some((user: any) => user.role === "admin");
        const hasServices = servicesData.data.rows.length > 0;

        if (adminExists && hasServices) {
          return {
            name: "البيانات الأساسية",
            status: "success",
            message: "البيانات الأساسية موجودة (مدير النظام والخدمات)",
          };
        } else {
          const issues = [];
          if (!adminExists) issues.push("لا يوجد مدير نظام");
          if (!hasServices) issues.push("لا توجد خدمات");

          return {
            name: "البيانات الأساسية",
            status: "warning",
            message: `مشاكل في البيانات الأساسية: ${issues.join(", ")}`,
          };
        }
      } else {
        return {
          name: "البيانات الأساسية",
          status: "error",
          message: "فشل في فحص البيانات الأساسية",
        };
      }
    } catch (error) {
      return {
        name: "البيانات الأساسية",
        status: "error",
        message: "خطأ في فحص البيانات الأساسية",
        details: error.message,
      };
    }
  };

  const checkAPIEndpoints = async (): Promise<CheckResult> => {
    try {
      const endpoints = [
        "/api/ping",
        "/api/database/stats",
        "/api/auth/verify?userId=1",
      ];

      const results = await Promise.all(
        endpoints.map(async (endpoint) => {
          try {
            const response = await fetch(endpoint);
            return { endpoint, status: response.status, ok: response.ok };
          } catch (error) {
            return { endpoint, status: 0, ok: false, error: error.message };
          }
        })
      );

      const failedEndpoints = results.filter(r => !r.ok);

      if (failedEndpoints.length === 0) {
        return {
          name: "نقاط API",
          status: "success",
          message: `جميع نقاط API ت��مل بشكل طبيعي (${results.length} نقطة)`,
        };
      } else {
        return {
          name: "نقاط API",
          status: "warning",
          message: `بعض نقاط API لا تعمل: ${failedEndpoints.map(f => f.endpoint).join(", ")}`,
        };
      }
    } catch (error) {
      return {
        name: "نقاط API",
        status: "error",
        message: "خطأ في فحص نقاط API",
        details: error.message,
      };
    }
  };

  const checkUsers = async (): Promise<CheckResult> => {
    try {
      const response = await fetch("/api/database/tables/users");
      if (response.ok) {
        const data = await response.json();
        const users = data.data.rows;
        
        const roles = {
          admin: users.filter((u: any) => u.role === "admin").length,
          doctor: users.filter((u: any) => u.role === "doctor").length,
          patient: users.filter((u: any) => u.role === "patient").length,
          receptionist: users.filter((u: any) => u.role === "receptionist").length,
        };

        if (roles.admin > 0) {
          return {
            name: "المستخدمين",
            status: "success",
            message: `${users.length} مستخدم (${roles.admin} مدير، ${roles.doctor} طبيب، ${roles.patient} مريض)`,
          };
        } else {
          return {
            name: "المستخدمين",
            status: "warning",
            message: "لا يوجد مدير نظام",
          };
        }
      } else {
        return {
          name: "المستخدمين",
          status: "error",
          message: "فشل في فحص المستخدمين",
        };
      }
    } catch (error) {
      return {
        name: "المستخدمين",
        status: "error",
        message: "خطأ في فحص المستخدمين",
        details: error.message,
      };
    }
  };

  const checkServices = async (): Promise<CheckResult> => {
    try {
      const response = await fetch("/api/database/tables/services");
      if (response.ok) {
        const data = await response.json();
        const services = data.data.rows;
        const activeServices = services.filter((s: any) => s.is_active);

        if (services.length > 0) {
          return {
            name: "الخدمات",
            status: "success",
            message: `${services.length} خدمة (${activeServices.length} نشطة)`,
          };
        } else {
          return {
            name: "الخدمات",
            status: "warning",
            message: "لا توجد خدمات محددة",
          };
        }
      } else {
        return {
          name: "الخدمات",
          status: "error",
          message: "فشل في فحص الخدمات",
        };
      }
    } catch (error) {
      return {
        name: "الخدمات",
        status: "error",
        message: "خطأ في فحص الخدمات",
        details: error.message,
      };
    }
  };

  const fetchSystemStats = async () => {
    try {
      const response = await fetch("/api/database/stats");
      if (response.ok) {
        const data = await response.json();
        setStats({
          users: data.data.users || 0,
          patients: data.data.patients || 0,
          doctors: data.data.doctors || 0,
          appointments: data.data.appointments || 0,
          services: data.data.services || 0,
          transactions: data.data.financial_transactions || 0,
        });
      }
    } catch (error) {
      console.error("خطأ في جلب الإحصائيات:", error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800">سليم</Badge>;
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800">تحذير</Badge>;
      case "error":
        return <Badge className="bg-red-100 text-red-800">خطأ</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-arabic">
              فحص النظام
            </h1>
            <p className="text-gray-600 font-arabic">
              فحص شامل لحالة النظام وقاعدة البيانات
            </p>
          </div>
          <Button 
            onClick={runSystemCheck} 
            disabled={isChecking}
            className="font-arabic"
          >
            {isChecking ? (
              <Loader2 className="h-4 w-4 animate-spin ml-2" />
            ) : (
              <RefreshCw className="h-4 w-4 ml-2" />
            )}
            {isChecking ? "جاري الفحص..." : "إعادة الفحص"}
          </Button>
        </div>

        {/* Status Overview */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{stats.users}</div>
                <div className="text-sm text-gray-600 font-arabic">مستخدمين</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{stats.patients}</div>
                <div className="text-sm text-gray-600 font-arabic">مرضى</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{stats.doctors}</div>
                <div className="text-sm text-gray-600 font-arabic">أطباء</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <FileText className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{stats.appointments}</div>
                <div className="text-sm text-gray-600 font-arabic">مواعيد</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Settings className="h-8 w-8 text-teal-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{stats.services}</div>
                <div className="text-sm text-gray-600 font-arabic">خدمات</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Database className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{stats.transactions}</div>
                <div className="text-sm text-gray-600 font-arabic">معاملات</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* System Checks */}
        <Card>
          <CardHeader>
            <CardTitle className="font-arabic">نتائج الفحص</CardTitle>
            <CardDescription className="font-arabic">
              {lastCheck && `آخر فحص: ${lastCheck.toLocaleString("ar-SA")}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isChecking ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <span className="mr-3 font-arabic">جاري فحص النظام...</span>
              </div>
            ) : checks.length > 0 ? (
              <div className="space-y-4">
                {checks.map((check, index) => (
                  <div key={index} className="flex items-start space-x-reverse space-x-3 p-4 rounded-lg border">
                    {getStatusIcon(check.status)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium font-arabic">{check.name}</h4>
                        {getStatusBadge(check.status)}
                      </div>
                      <p className="text-gray-600 mt-1 font-arabic">{check.message}</p>
                      {check.details && (
                        <p className="text-sm text-gray-500 mt-2 font-mono">{check.details}</p>
                      )}
                    </div>
                  </div>
                ))}
                
                {/* Summary */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium font-arabic mb-2">ملخص النتائج:</h4>
                  <div className="flex space-x-reverse space-x-6">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 ml-1" />
                      <span className="text-sm font-arabic">
                        {checks.filter(c => c.status === "success").length} سليم
                      </span>
                    </div>
                    <div className="flex items-center">
                      <AlertTriangle className="h-4 w-4 text-yellow-500 ml-1" />
                      <span className="text-sm font-arabic">
                        {checks.filter(c => c.status === "warning").length} تحذير
                      </span>
                    </div>
                    <div className="flex items-center">
                      <XCircle className="h-4 w-4 text-red-500 ml-1" />
                      <span className="text-sm font-arabic">
                        {checks.filter(c => c.status === "error").length} خطأ
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 font-arabic">
                اضغط "إعادة الفحص" لبدء فحص النظام
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
