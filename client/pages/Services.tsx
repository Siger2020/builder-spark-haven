import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Star, CheckCircle, Shield, Heart, Award, Sparkles, Zap } from "lucide-react";
import { Link } from "react-router-dom";

// بيانات الخدمات المفصلة
const services = [
  {
    id: 1,
    title: "تنظيف الأسنان",
    description: "تنظيف شامل ومهني لأسنانك مع أحدث التقنيات",
    longDescription: "خدمة تنظيف شاملة تتضمن إزالة الجير والبلاك، وتلميع الأسنان، وفحص صحة اللثة. نستخدم أحدث التقنيات الآمنة لضمان تنظيف فعال وآمن.",
    icon: Sparkles,
    image: "https://cdn.builder.io/o/assets%2F4227a3a1f6cd425b96f32afb21ed3b0b%2F1b3a064be2df4fceaab047c5445f5579?alt=media&token=62965839-1bc1-457a-b834-e0dd1c178bf4&apiKey=4227a3a1f6cd425b96f32afb21ed3b0b",
    duration: "45 دقيقة",
    category: "عام",
    features: ["إزالة الجير والبلاك", "تلميع الأسنان", "فحص اللثة", "نصائح للعناية"]
  },
  {
    id: 2,
    title: "حشوات الأسنان",
    description: "حشوات تجميلية بأحدث المواد الطبية المعتمدة",
    longDescription: "حشوات تجميلية عالية الجودة تتطابق مع لون أسنانك الطبيعي. نستخدم مواد حديثة ومتينة تدوم لسنوات طويلة مع الحفاظ على المظهر الطبيعي.",
    icon: Shield,
    image: "https://cdn.builder.io/o/assets%2F4227a3a1f6cd425b96f32afb21ed3b0b%2Febb9d4d3fc0d430ea2056739377e5737?alt=media&token=ec850565-c54e-41b0-8d8f-2865bb1d1cc3&apiKey=4227a3a1f6cd425b96f32afb21ed3b0b",
    duration: "60 دقيقة",
    category: "ترميمي",
    features: ["مواد تجميلية عالية الجودة", "تطابق لون الأسنان", "متانة عالية", "خالية من الزئبق"]
  },
  {
    id: 3,
    title: "تقويم الأسنان",
    description: "تقويم شامل بأحدث التقنيات الطبية المتقدمة",
    longDescription: "خدمات تقويم شاملة تشمل التقويم التقليدي والشفاف. نوفر خطة علاج مخصصة لكل مريض مع متابعة دورية لضمان أفضل النتائج.",
    icon: Star,
    image: "https://cdn.builder.io/o/assets%2F4227a3a1f6cd425b96f32afb21ed3b0b%2F3aa805bd670a4a869618878555c5aece?alt=media&token=41adbb8c-daac-4e89-acf4-441d75def9af&apiKey=4227a3a1f6cd425b96f32afb21ed3b0b",
    duration: "90 دقيقة",
    category: "تقويم",
    features: ["تقويم تقليدي ومعدني", "تقويم شفاف", "تقويم داخلي", "متابعة شهرية"]
  },
  {
    id: 4,
    title: "زراعة الأسنان",
    description: "زراعة متطورة مع ضمان طويل المدى",
    longDescription: "زراعة أسنان بتقنيات متقدمة وزرعات عالية الجودة. نوفر حلول زراعة شاملة من السن الواحد إلى الفك الكامل مع ضمانات مطولة.",
    icon: Heart,
    image: "https://cdn.builder.io/api/v1/image/assets%2F4227a3a1f6cd425b96f32afb21ed3b0b%2F3785672e0dd448de9271e7871c4ac204",
    duration: "120 دقيقة",
    category: "جراحي",
    features: ["زرعات تيتانيوم أصلية", "تقنيات متقدمة", "ضمان 10 سنوات", "تخدير موضعي آمن"]
  },
  {
    id: 5,
    title: "تبييض الأسنان",
    description: "تبييض آمن وفعال لابتسامة مشرقة",
    longDescription: "تبييض احترافي بتقنيات آمنة وفعالة. نوفر تبييض في العيادة أو منزلي حسب تفضيل المريض مع نتائج فورية ومضمونة.",
    icon: Zap,
    image: "https://cdn.builder.io/o/assets%2F4227a3a1f6cd425b96f32afb21ed3b0b%2Fa0d27b1b54994c99afa37896bf474b12?alt=media&token=0aad9bfe-c865-4eee-a16d-072936f66615&apiKey=4227a3a1f6cd425b96f32afb21ed3b0b",
    duration: "60 دقيقة",
    category: "تجميلي",
    features: ["تبييض في العيادة", "تبييض منزلي", "نتائج فورية", "آمن على المينا"]
  },
  {
    id: 6,
    title: "علاج الجذور",
    description: "علاج متخصص للجذور بأحدث التقنيات",
    longDescription: "علاج جذور متخصص باستخدام تقنيات حديثة ومجاهر طبية. نحافظ على السن الطبيعي ونتجنب الخلع كلما أمكن ذلك.",
    icon: Award,
    image: "https://cdn.builder.io/o/assets%2F4227a3a1f6cd425b96f32afb21ed3b0b%2F675695eaeaf042d58f3251523ab08d2e?alt=media&token=ee144587-a0a0-4a86-922a-2ad6c36e7fc3&apiKey=4227a3a1f6cd425b96f32afb21ed3b0b",
    duration: "90 دقيقة",
    category: "علاج الجذور",
    features: ["تقنيات حديثة", "مجاهر طبية", "تخدير فعال", "حفاظ على السن"]
  }
];

const categories = [
  { name: "الكل", value: "all" },
  { name: "عام", value: "عام" },
  { name: "ترميمي", value: "ترميمي" },
  { name: "تقويم", value: "تقويم" },
  { name: "جراحي", value: "جراحي" },
  { name: "تجميلي", value: "تجميلي" },
  { name: "علاج الجذور", value: "علاج الجذور" }
];

export default function Services() {
  return (
    <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* العنوان والوصف */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-arabic">
            خدماتنا المتميزة
          </h1>
          <p className="text-xl text-gray-600 font-arabic max-w-3xl mx-auto">
            نقدم مجموعة ��املة من خدمات طب الأسنان بأعلى معايير الجودة والأمان باستخدام أحدث التقنيات الطبية
          </p>
        </div>

        {/* الخدمات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                {/* صورة الخدمة */}
                <div className="relative h-48 bg-gradient-to-br from-dental-primary to-dental-primary/80">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full">
                    <Badge variant="secondary" className="font-arabic">
                      {service.category}
                    </Badge>
                  </div>
                </div>

                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="h-8 w-8 text-dental-primary" />
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 ml-1" />
                      <span className="font-arabic">{service.duration}</span>
                    </div>
                  </div>
                  <CardTitle className="font-arabic">{service.title}</CardTitle>
                  <CardDescription className="font-arabic">
                    {service.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col">
                  <div className="flex-1">
                    <p className="text-gray-700 mb-4 font-arabic text-sm">
                      {service.longDescription}
                    </p>
                    
                    {/* المميزات */}
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-900 mb-2 font-arabic">ما يشمله:</h4>
                      <ul className="space-y-1">
                        {service.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-600">
                            <CheckCircle className="h-3 w-3 text-green-500 ml-2 flex-shrink-0" />
                            <span className="font-arabic">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* زر الحجز */}
                  <div className="mt-auto">
                    <Link to="/booking" className="w-full">
                      <Button className="w-full font-arabic">
                        <Calendar className="h-4 w-4 ml-2" />
                        احجز الآن
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* معلومات إضافية */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="font-arabic">لماذا نختلف؟</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Shield className="h-6 w-6 text-dental-primary mt-1 ml-3" />
                  <div>
                    <h3 className="font-medium text-gray-900 font-arabic">أعلى معايير الأمان</h3>
                    <p className="text-gray-600 text-sm font-arabic">
                      نطبق أعلى معايير التعقيم والأمان المعتمدة دولياً
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Star className="h-6 w-6 text-dental-primary mt-1 ml-3" />
                  <div>
                    <h3 className="font-medium text-gray-900 font-arabic">تقنيات متقدمة</h3>
                    <p className="text-gray-600 text-sm font-arabic">
                      نستخدم أحدث التقنيات والمعدات الطبية المتطورة
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Heart className="h-6 w-6 text-dental-primary mt-1 ml-3" />
                  <div>
                    <h3 className="font-medium text-gray-900 font-arabic">رعاية شخصية</h3>
                    <p className="text-gray-600 text-sm font-arabic">
                      خطة علاج مخصصة لكل مريض حسب حالته الفردية
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-arabic">ضماناتنا</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 ml-3" />
                  <div>
                    <h3 className="font-medium text-gray-900 font-arabic">ضمان الجودة</h3>
                    <p className="text-gray-600 text-sm font-arabic">
                      ضمان شامل على جميع أعمال التقويم والزراعة
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 ml-3" />
                  <div>
                    <h3 className="font-medium text-gray-900 font-arabic">متابعة مجانية</h3>
                    <p className="text-gray-600 text-sm font-arabic">
                      متابعة مجانية لمدة 6 أشهر بعد إتمام العلاج
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 ml-3" />
                  <div>
                    <h3 className="font-medium text-gray-900 font-arabic">إعادة العلاج</h3>
                    <p className="text-gray-600 text-sm font-arabic">
                      إعادة العلاج مجاناً في حالة عدم الرضا عن النتائج
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* دعوة للعمل */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-dental-primary to-dental-primary/90 text-white">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-4 font-arabic">
                جاهز لبدء رحلة العناية بأسنانك؟
              </h2>
              <p className="text-xl mb-6 font-arabic opacity-90">
                احجز استشارة مجانية الآن واحصل على خطة علاج مخصصة
              </p>
              <Link to="/booking">
                <Button size="lg" className="bg-white text-dental-primary hover:bg-gray-100 font-arabic">
                  <Calendar className="h-5 w-5 ml-2" />
                  احجز استشارة مجانية
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
