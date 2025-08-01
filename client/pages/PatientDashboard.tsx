import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, FileText, User, Heart, Activity, Download, Eye } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// بيانات تجريبية للجلسات
const mockSessions = [
  {
    id: 1,
    date: "2024-01-15",
    time: "10:00 ص",
    doctor: "د. سارة أحمد",
    treatment: "تنظيف الأسنان",
    status: "مكتملة",
    notes: "تم تنظيف الأسنان بشكل مثالي. ينصح بالمتابعة كل 6 شهور."
  },
  {
    id: 2,
    date: "2024-01-20",
    time: "2:00 م",
    doctor: "د. أحمد محمد",
    treatment: "حشو الأسنان",
    status: "مكتملة",
    notes: "تم حشو ضرس بالمواد التجميلية الحديثة. تجنب الأطعمة الصلبة لمدة 24 ساعة."
  },
  {
    id: 3,
    date: "2024-02-05",
    time: "11:30 ص",
    doctor: "د. سارة أحمد",
    treatment: "فحص دوري",
    status: "قادمة",
    notes: ""
  }
];

// بيانات تجريبية للتقارير
const mockReports = [
  {
    id: 1,
    title: "تقرير الفحص الشامل",
    date: "2024-01-15",
    doctor: "د. سارة أحمد",
    summary: "صحة الأسنان عامة جيدة مع ضرورة المتابعة الدورية"
  },
  {
    id: 2,
    title: "تقرير العلاج التجميلي",
    date: "2024-01-20",
    doctor: "د. أحمد محمد",
    summary: "تم إجراء الحشوات التجميلية بنجاح"
  }
];

export default function PatientDashboard() {
  const [activeTab, setActiveTab] = useState("sessions");
  const { user } = useAuth();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "مكتملة":
        return "bg-green-100 text-green-800";
      case "قادمة":
        return "bg-blue-100 text-blue-800";
      case "ملغية":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ترحيب بالمريض */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 font-arabic">
            مرحباً، {user?.name || "عزيزي المريض"}
          </h1>
          <p className="text-lg text-gray-600 font-arabic">
            تابع جلساتك وتقاريرك الطبية من خلال لوحة التحكم الخاصة بك
          </p>
        </div>

        {/* الإحصائيات السريعة */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600 font-arabic">إجمالي الجلسات</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Activity className="h-6 w-6 text-green-600" />
                </div>
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600 font-arabic">جلسات مكتملة</p>
                  <p className="text-2xl font-bold text-gray-900">10</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600 font-arabic">جلسات قادمة</p>
                  <p className="text-2xl font-bold text-gray-900">2</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Heart className="h-6 w-6 text-orange-600" />
                </div>
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600 font-arabic">حالة الصحة</p>
                  <p className="text-lg font-bold text-green-600 font-arabic">ممتازة</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* علامات التبويب */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-reverse space-x-8">
              <button
                onClick={() => setActiveTab("sessions")}
                className={`py-2 px-1 border-b-2 font-medium text-sm font-arabic ${
                  activeTab === "sessions"
                    ? "border-dental-primary text-dental-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                جلسات العلاج
              </button>
              <button
                onClick={() => setActiveTab("reports")}
                className={`py-2 px-1 border-b-2 font-medium text-sm font-arabic ${
                  activeTab === "reports"
                    ? "border-dental-primary text-dental-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                التقارير الطبية
              </button>
            </nav>
          </div>
        </div>

        {/* محتوى علامات التبويب */}
        {activeTab === "sessions" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 font-arabic">جلسات العلاج</h2>
              <Button className="font-arabic">
                <Calendar className="ml-2 h-4 w-4" />
                حجز موعد جديد
              </Button>
            </div>

            <div className="grid gap-6">
              {mockSessions.map((session) => (
                <Card key={session.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="font-arabic">{session.treatment}</CardTitle>
                        <CardDescription className="font-arabic">
                          مع {session.doctor}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(session.status)}>
                        {session.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-reverse space-x-4 mb-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 ml-1" />
                        <span className="text-sm text-gray-600 font-arabic">{session.date}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-400 ml-1" />
                        <span className="text-sm text-gray-600 font-arabic">{session.time}</span>
                      </div>
                    </div>
                    {session.notes && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-700 font-arabic">
                          <strong>ملاحظات الطبيب:</strong> {session.notes}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "reports" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 font-arabic">التقارير الطبية</h2>
            </div>

            <div className="grid gap-6">
              {mockReports.map((report) => (
                <Card key={report.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="font-arabic">{report.title}</CardTitle>
                        <CardDescription className="font-arabic">
                          إعداد: {report.doctor} | {report.date}
                        </CardDescription>
                      </div>
                      <div className="flex space-x-reverse space-x-2">
                        <Button variant="outline" size="sm" className="font-arabic">
                          <Eye className="h-4 w-4 ml-1" />
                          عرض
                        </Button>
                        <Button variant="outline" size="sm" className="font-arabic">
                          <Download className="h-4 w-4 ml-1" />
                          تحميل
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 font-arabic">{report.summary}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
