import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Star, MapPin, Phone, Mail, Award, Users, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

// بيانات تجريبية للأطباء
const doctors = [
  {
    id: 1,
    name: "د. كمال الملصي",
    specialty: "جراحة الفم والأسنان",
    experience: "15+ سنة",
    education: "دكتوراه في طب الأسنان - جامعة القاهرة",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face",
    rating: 4.9,
    patients: 2500,
    specializations: ["زراعة الأسنان", "جراحة الفم", "التقويم الم��قدم"],
    availableDays: ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء"],
    workingHours: "9:00 ص - 9:00 م",
    phone: "967777775545",
    email: "dr.kamal@dkalmoli.com",
    bio: "طبيب أسنان متخصص في جراحة الفم والأسنان مع خبرة تزيد عن 15 عاماً. حاصل على دكتوراه في طب الأسنان من جامعة القاهرة ومتخصص في زراعة الأسنان والجراحات المتقدمة."
  },
  {
    id: 2,
    name: "د. سارة أحمد علي",
    specialty: "طب أسنان الأطفال",
    experience: "8+ سنوات",
    education: "ماجستير في طب أسنان الأطفال - جامعة عين شمس",
    image: "https://images.unsplash.com/photo-1594824930734-b924d3e0ee4a?w=300&h=300&fit=crop&crop=face",
    rating: 4.8,
    patients: 1200,
    specializations: ["طب أسنان الأطفال", "التقويم الوقائي", "طب الأسنان التجميلي"],
    availableDays: ["السبت", "الأحد", "الثلاثاء", "الأربعاء", "الخميس"],
    workingHours: "10:00 ص - 6:00 م",
    phone: "967771234567",
    email: "dr.sara@dkalmoli.com",
    bio: "طبيبة أسنان متخصصة في علاج الأطفال مع خبرة 8 سنوات. تركز على توفير بيئة مريحة للأطفال وتطبيق أحدث تقنيات العلاج الآمن."
  },
  {
    id: 3,
    name: "د. أحمد محمد",
    specialty: "تقويم الأسنان",
    experience: "12+ سنة",
    education: "دكتوراه في تقويم الأسنان - الجامعة الأمريكية",
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop&crop=face",
    rating: 4.7,
    patients: 1800,
    specializations: ["التقويم الشفاف", "التقويم التقليدي", "تقويم الكبار"],
    availableDays: ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"],
    workingHours: "8:00 ص - 5:00 م",
    phone: "967772345678",
    email: "dr.ahmed@dkalmoli.com",
    bio: "خبير في تقويم الأسنان مع تخصص في التقويم الشفاف والتقنيات الحديثة. يهتم بتوفير حلول تقويمية مخصصة لكل مريض."
  }
];

export default function Doctors() {
  return (
    <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* العنوان والوصف */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-arabic">
            فريقنا الطبي المتميز
          </h1>
          <p className="text-xl text-gray-600 font-arabic max-w-3xl mx-auto">
            نتشرف بتقديم أطباء أسنان متخصصين ومعتمدين بخبرات واسعة في جميع مجالات طب الأسنان
          </p>
        </div>

        {/* قائمة الأطباء */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {doctors.map((doctor) => (
            <Card key={doctor.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {/* صورة الطبيب */}
              <div className="relative h-64 bg-gradient-to-br from-dental-primary to-dental-primary/80">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 right-4 bg-white px-3 py-1 rounded-full flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium mr-1">{doctor.rating}</span>
                </div>
              </div>

              <CardHeader>
                <CardTitle className="font-arabic">{doctor.name}</CardTitle>
                <CardDescription className="font-arabic">
                  {doctor.specialty}
                </CardDescription>
                <div className="flex items-center text-sm text-gray-500 font-arabic">
                  <Award className="h-4 w-4 ml-1" />
                  {doctor.experience}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* التخصصات */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2 font-arabic">التخصصات:</h4>
                  <div className="flex flex-wrap gap-2">
                    {doctor.specializations.map((spec, index) => (
                      <Badge key={index} variant="secondary" className="font-arabic">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* الإحصائيات */}
                <div className="grid grid-cols-2 gap-4 py-3 border-t border-b border-gray-100">
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <Users className="h-4 w-4 text-dental-primary ml-1" />
                      <span className="text-lg font-bold text-gray-900">{doctor.patients.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-gray-500 font-arabic">مريض</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <BookOpen className="h-4 w-4 text-dental-primary ml-1" />
                      <span className="text-lg font-bold text-gray-900">{doctor.experience}</span>
                    </div>
                    <p className="text-xs text-gray-500 font-arabic">خبرة</p>
                  </div>
                </div>

                {/* أوقات العمل */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2 font-arabic">أوقات العمل:</h4>
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <Clock className="h-4 w-4 ml-1" />
                    <span className="font-arabic">{doctor.workingHours}</span>
                  </div>
                  <p className="text-xs text-gray-500 font-arabic">
                    {doctor.availableDays.join(" - ")}
                  </p>
                </div>

                {/* معلومات الاتصال */}
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 ml-1 text-dental-primary" />
                    <span className="font-arabic">{doctor.phone}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 ml-1 text-dental-primary" />
                    <span>{doctor.email}</span>
                  </div>
                </div>

                {/* زر الحجز */}
                <div className="pt-4">
                  <Link to="/booking" className="w-full">
                    <Button className="w-full font-arabic">
                      <Calendar className="h-4 w-4 ml-2" />
                      حجز موعد مع {doctor.name.split(' ')[1]}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* معلومات إضافية */}
        <div className="mt-16 text-center">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="font-arabic">لماذا تختار أطباءنا؟</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-dental-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Award className="h-8 w-8 text-dental-primary" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 font-arabic">خبرة واسعة</h3>
                  <p className="text-gray-600 font-arabic">
                    جميع أطباءنا يتمتعون بخبرات واسعة وشهادات معتمدة دولياً
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-dental-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Star className="h-8 w-8 text-dental-primary" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 font-arabic">جودة عالية</h3>
                  <p className="text-gray-600 font-arabic">
                    نحرص على تقديم أعلى مستويات الجودة في العلاج والخدمة
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-dental-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-dental-primary" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 font-arabic">رعاية شخصية</h3>
                  <p className="text-gray-600 font-arabic">
                    نوفر رعاية شخصية مخصصة لكل مريض حسب حالته واحتياجاته
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
