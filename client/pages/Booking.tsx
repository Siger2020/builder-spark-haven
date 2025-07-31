import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, User, Phone, Mail, FileText } from "lucide-react";
import { useState } from "react";

const timeSlots = [
  "9:00 ص", "9:30 ص", "10:00 ص", "10:30 ص", "11:00 ص", "11:30 ص",
  "2:00 م", "2:30 م", "3:00 م", "3:30 م", "4:00 م", "4:30 م",
  "5:00 م", "5:30 م", "6:00 م", "6:30 م", "7:00 م", "7:30 م", "8:00 م"
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
  "أخرى"
];

export default function Booking() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    service: "",
    notes: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Booking submitted:", formData);
    // Here you would typically send the data to your backend
    alert("تم إرسال طلب الحجز بنجاح! سنتواصل معك قريباً لتأكيد الموعد.");
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-arabic">
            حجز موعد
          </h1>
          <p className="text-lg text-gray-600 font-arabic">
            احجز موعدك بسهولة واختر الوقت المناسب لك
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card>
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
                      <Label htmlFor="name" className="font-arabic">الاسم الكامل *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="name"
                          placeholder="أدخل اسمك الكامل"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          className="pl-10 font-arabic"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="font-arabic">رقم الهاتف *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="05xxxxxxxx"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          className="pl-10 font-arabic"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-arabic">البريد الإلكتروني</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="example@email.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="pl-10 font-arabic"
                      />
                    </div>
                  </div>

                  {/* Appointment Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date" className="font-arabic">تاريخ الموعد *</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="date"
                          type="date"
                          value={formData.date}
                          onChange={(e) => handleInputChange("date", e.target.value)}
                          className="pl-10 font-arabic"
                          required
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time" className="font-arabic">وقت الموعد *</Label>
                      <Select onValueChange={(value) => handleInputChange("time", value)} required>
                        <SelectTrigger className="font-arabic">
                          <SelectValue placeholder="اختر الوقت المناسب" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time} className="font-arabic">
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="service" className="font-arabic">نوع الخدمة المطلوبة *</Label>
                    <Select onValueChange={(value) => handleInputChange("service", value)} required>
                      <SelectTrigger className="font-arabic">
                        <SelectValue placeholder="اختر نوع الخدمة" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service} value={service} className="font-arabic">
                            {service}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes" className="font-arabic">ملاحظات إضافية</Label>
                    <Textarea
                      id="notes"
                      placeholder="أي ملاحظات أو معلومات إضافية تود إضافتها..."
                      value={formData.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      className="font-arabic"
                      rows={4}
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full font-arabic">
                    تأكيد الحجز
                    <Calendar className="mr-2 h-5 w-5" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-arabic">معلومات مهمة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-reverse space-x-3">
                  <Clock className="h-5 w-5 text-dental-primary mt-1" />
                  <div>
                    <h4 className="font-semibold font-arabic">مدة الموعد</h4>
                    <p className="text-sm text-gray-600 font-arabic">30-60 دقيقة حسب نوع الخدمة</p>
                  </div>
                </div>
                <div className="flex items-start space-x-reverse space-x-3">
                  <FileText className="h-5 w-5 text-dental-primary mt-1" />
                  <div>
                    <h4 className="font-semibold font-arabic">الوثائق المطلوبة</h4>
                    <p className="text-sm text-gray-600 font-arabic">بطاقة الهوية، تأمين طبي (إن وجد)</p>
                  </div>
                </div>
                <div className="flex items-start space-x-reverse space-x-3">
                  <Phone className="h-5 w-5 text-dental-primary mt-1" />
                  <div>
                    <h4 className="font-semibold font-arabic">للاستفسار</h4>
                    <p className="text-sm text-gray-600 font-arabic">+966 50 123 4567</p>
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
