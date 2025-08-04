import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function TestBooking() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const testBookingSubmission = async () => {
    setLoading(true);
    setResult(null);

    const testData = {
      name: "سارة أحمد الزهراني",
      phone: "0501234567",
      email: "sara.alzahrani@test.com",
      date: "2024-12-29",
      time: "11:00 ص",
      service: "فحص عام",
      notes: "موعد اختبار",
      bookingNumber: `BK${Date.now().toString().slice(-6)}`,
      doctorName: "د. كمال الملصي",
    };

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testData),
      });

      const result = await response.json();
      setResult({ success: response.ok, data: result, testData });

      if (response.ok) {
        console.log("✅ تم إنشاء الموعد بنجاح:", result);
      } else {
        console.error("❌ فشل إنشاء الموعد:", result);
      }
    } catch (error) {
      console.error("خطأ في الاختبار:", error);
      setResult({ success: false, error: error.message, testData });
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/bookings");
      const data = await response.json();
      setResult({ success: true, appointments: data.data, action: "fetch" });
    } catch (error) {
      setResult({ success: false, error: error.message, action: "fetch" });
    } finally {
      setLoading(false);
    }
  };

  const cleanupData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/appointments/cleanup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setResult({ success: true, cleanup: data, action: "cleanup" });
    } catch (error) {
      setResult({ success: false, error: error.message, action: "cleanup" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 font-arabic">
          اختبار تطابق أسماء المواعيد
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Button
            onClick={testBookingSubmission}
            disabled={loading}
            className="font-arabic"
          >
            اختبار إنشاء موعد جديد
          </Button>
          <Button
            onClick={fetchAppointments}
            disabled={loading}
            variant="outline"
            className="font-arabic"
          >
            جلب جميع المواعيد
          </Button>
          <Button
            onClick={cleanupData}
            disabled={loading}
            variant="outline"
            className="font-arabic text-orange-600"
          >
            تنظيف البيانات
          </Button>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 font-arabic">جاري المعالجة...</p>
          </div>
        )}

        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="font-arabic">
                نتيجة {result.action === "fetch" ? "جلب المواعيد" : result.action === "cleanup" ? "تنظيف البيانات" : "اختبار الحجز"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                  result.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}>
                  {result.success ? "نجح" : "فشل"}
                </span>
              </div>

              {result.testData && (
                <div className="mb-4">
                  <h4 className="font-bold font-arabic mb-2">البيانات المرسلة:</h4>
                  <pre className="bg-gray-100 p-2 rounded text-sm">
                    {JSON.stringify(result.testData, null, 2)}
                  </pre>
                </div>
              )}

              {result.appointments && (
                <div className="mb-4">
                  <h4 className="font-bold font-arabic mb-2">
                    المواعيد الحالية ({result.appointments.length}):
                  </h4>
                  <div className="space-y-2">
                    {result.appointments.map((apt: any, index: number) => (
                      <div key={index} className="bg-gray-100 p-3 rounded">
                        <div className="font-arabic">
                          <strong>رقم الموعد:</strong> {apt.appointment_number}
                        </div>
                        <div className="font-arabic">
                          <strong>اسم المريض:</strong> {apt.patient_name}
                        </div>
                        <div className="font-arabic">
                          <strong>الهاتف:</strong> {apt.phone}
                        </div>
                        <div className="font-arabic">
                          <strong>الخدمة:</strong> {apt.service_name || apt.chief_complaint}
                        </div>
                        <div className="font-arabic">
                          <strong>الحالة:</strong> {apt.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.cleanup && (
                <div className="mb-4">
                  <h4 className="font-bold font-arabic mb-2">نتائج التنظيف:</h4>
                  <pre className="bg-gray-100 p-2 rounded text-sm">
                    {JSON.stringify(result.cleanup, null, 2)}
                  </pre>
                </div>
              )}

              {result.data && !result.appointments && (
                <div className="mb-4">
                  <h4 className="font-bold font-arabic mb-2">الاستجابة:</h4>
                  <pre className="bg-gray-100 p-2 rounded text-sm">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              )}

              {result.error && (
                <div className="text-red-600 font-arabic">
                  <strong>خطأ:</strong> {result.error}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
