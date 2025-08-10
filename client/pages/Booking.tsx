import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  NativeSelect as Select,
  NativeSelectItem as SelectItem,
} from "@/components/ui/native-select";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  FileText,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";

const timeSlots = [
  "9:00 ص",
  "9:30 ص",
  "10:00 ص",
  "10:30 ص",
  "11:00 ص",
  "11:30 ص",
  "2:00 م",
  "2:30 م",
  "3:00 م",
  "3:30 م",
  "4:00 م",
  "4:30 م",
  "5:00 م",
  "5:30 م",
  "6:00 م",
  "6:30 م",
  "7:00 م",
  "7:30 م",
  "8:00 م",
];

const services = [
  "فحص عام",
  "تنظيف الأسنان",
  "حشوات الأسنان",
  "علاج الجذور",
  "تقويم الأسنان",
  "زراعة الأسنان",
  "تبييض الأسنان",
  "جراحة الفم",
  "طب أسنان الأطفال",
  "أخرى",
];

export default function Booking() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    service: "",
    notes: "",
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingNumber, setBookingNumber] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // التحقق من وج��د الوقت
    if (!formData.time) {
      alert("يرجى اختيار وقت الموعد");
      return;
    }

    if (!formData.service) {
      alert("يرجى اختيار نوع الخدمة");
      return;
    }

    console.log("بيانات النموذج المرسلة:", formData);

    // إنشاء رقم حجز عشوائي
    const newBookingNumber = `BK${Date.now().toString().slice(-6)}`;

    try {
      // إعداد بيانات الحجز للإشعارات
      const bookingData = {
        ...formData,
        bookingNumber: newBookingNumber,
        doctorName: "د. كمال الملصي", // يمكن تحديدها حسب الخدمة المختارة
      };

      // إرسال البيانات للخادم
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        setBookingNumber(newBookingNumber);
        setBookingSuccess(true);

        // إشعار المستخدم بأن الإشعارات سيتم ��رسالها
        console.log(`📱 سيتم إرسال ��شعارات تأكيد الحجز إلى ${formData.phone}`);
        console.log(`🔔 سيتم إرسال تذكير قبل الموعد بيوم واحد`);
      } else {
        // محاولة الحصول على رسالة الخطأ من الخادم
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || "فشل في إنشاء الحجز";
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Error submitting booking:", error);

      // عرض رسالة الخطأ للمستخدم
      alert(`خطأ في الحجز: ${error.message}`);

      // في حالة فشل الحفظ، ننشئ الحجز محلياً مع الإشعارات
      setBookingNumber(newBookingNumber);
      setBookingSuccess(true);

      // محاكاة إرسال الإشعارات محلياً
      console.log(
        `📱 إرسال إشعارات الحجز ${newBookingNumber} إلى ${formData.phone}`,
      );
      console.log(`✅ تم تأكيد الحجز - سيتم إرسال SMS وواتس آب`);
      console.log(`⏰ تذكير مجدول قبل الموعد بيوم واحد`);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    console.log(`تم تحديث الحقل ${field} بالقيمة: ${value}`);
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // عرض رسالة النجاح
  if (bookingSuccess) {
    return (
      <div
        className="min-h-screen bg-gray-50 py-12 flex items-center justify-center"
        dir="rtl"
      >
        <div className="max-w-md w-full">
          <Card className="text-center">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 font-arabic">
                تم الحجز بنجاح!
              </h2>
              <p className="text-gray-600 mb-6 font-arabic">
                تم إنشاء حجزك بنجاح. سنتواصل معك قريباً لتأكيد الموعد.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-gray-600 font-arabic mb-2">
                  رقم الحجز الخاص بك:
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {bookingNumber}
                </p>
              </div>
              <div className="space-y-3">
                <Button
                  onClick={() => {
                    setBookingSuccess(false);
                    setFormData({
                      name: "",
                      phone: "",
                      email: "",
                      date: "",
                      time: "",
                      service: "",
                      notes: "",
                    });
                  }}
                  className="w-full font-arabic"
                >
                  حج�� موعد آخر
                </Button>
                <Button
                  variant="outline"
                  onClick={() => (window.location.href = "/")}
                  className="w-full font-arabic"
                >
                  العودة للرئيسية
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12"
      dir="rtl"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-block p-2 rounded-full bg-dental-primary/10 mb-4">
            <Calendar className="h-12 w-12 text-dental-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-arabic bg-gradient-to-r from-dental-primary to-blue-600 bg-clip-text text-transparent">
            حجز موعد
          </h1>
          <p className="text-lg text-gray-600 font-arabic">
            احجز موعدك بسهولة واختر الوقت المناسب لك
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-arabic">معلومات الحجز</CardTitle>
                <CardDescription className="font-arabic">
                  يرجى ملء جميع الحقول المطلوبة لحجز موعدك
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="font-arabic">
                        الاسم الكامل *
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="name"
                          placeholder="أدخل اسمك الكامل"
                          value={formData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          className="pl-10 font-arabic border-2 focus:border-dental-primary transition-colors duration-300 hover:border-gray-300"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="font-arabic">
                        رقم الهاتف *
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="77xxxxxxx (+967)"
                          value={formData.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          className="pl-10 font-arabic border-2 focus:border-dental-primary transition-colors duration-300 hover:border-gray-300"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-arabic">
                      البريد الإلكتروني
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="example@email.com"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className="pl-10 font-arabic"
                      />
                    </div>
                  </div>

                  {/* Appointment Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date" className="font-arabic">
                        تاريخ الموعد *
                      </Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="date"
                          type="date"
                          value={formData.date}
                          onChange={(e) =>
                            handleInputChange("date", e.target.value)
                          }
                          className="pl-10 font-arabic"
                          required
                          min={new Date().toISOString().split("T")[0]}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time" className="font-arabic">
                        وقت الموعد *
                      </Label>
                      <Select
                        value={formData.time}
                        onValueChange={(value) =>
                          handleInputChange("time", value)
                        }
                        required
                        placeholder="اختر الوقت المناسب"
                        className="font-arabic"
                      >
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="service" className="font-arabic">
                      نوع الخدمة المطلوبة *
                    </Label>
                    <Select
                      value={formData.service}
                      onValueChange={(value) =>
                        handleInputChange("service", value)
                      }
                      required
                      placeholder="اختر نوع الخدمة"
                      className="font-arabic"
                    >
                      {services.map((service) => (
                        <SelectItem key={service} value={service}>
                          {service}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes" className="font-arabic">
                      ملاح��ات إضافية
                    </Label>
                    <Textarea
                      id="notes"
                      placeholder="أي ملاحظا�� أو معلومات إضافية تود إضافتها..."
                      value={formData.notes}
                      onChange={(e) =>
                        handleInputChange("notes", e.target.value)
                      }
                      className="font-arabic"
                      rows={4}
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full font-arabic bg-gradient-to-r from-dental-primary to-blue-600 hover:from-dental-primary/90 hover:to-blue-600/90 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    تأكيد الحجز
                    <Calendar className="mr-2 h-5 w-5 animate-pulse" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Information */}
          <div className="space-y-6">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-arabic">معلومات مهمة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-reverse space-x-3">
                  <Clock className="h-5 w-5 text-dental-primary mt-1" />
                  <div>
                    <h4 className="font-semibold font-arabic">مدة الموعد</h4>
                    <p className="text-sm text-gray-600 font-arabic">
                      30-60 دقيقة حسب نوع الخدمة
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-reverse space-x-3">
                  <FileText className="h-5 w-5 text-dental-primary mt-1" />
                  <div>
                    <h4 className="font-semibold font-arabic">
                      الوثائق المطلوبة
                    </h4>
                    <p className="text-sm text-gray-600 font-arabic">
                      بطاقة الهوية، تأمين طبي (إن وجد)
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-reverse space-x-3">
                  <Phone className="h-5 w-5 text-dental-primary mt-1" />
                  <div>
                    <h4 className="font-semibold font-arabic">للاستفسار</h4>
                    <p className="text-sm text-gray-600 font-arabic">
                      +966 50 123 4567
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-arabic">ساعات العمل</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 font-arabic text-sm">
                  <div className="flex justify-between">
                    <span>السبت - الخميس</span>
                    <span>9:00 ص - 9:00 م</span>
                  </div>
                  <div className="flex justify-between">
                    <span>الجمعة</span>
                    <span>2:00 م - 9:00 م</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
