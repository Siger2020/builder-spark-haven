import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar,
  Users,
  Shield,
  Clock,
  Star,
  Phone,
  MapPin,
  Mail,
  Smile,
  Heart,
  Award,
  CheckCircle,
  Settings,
} from "lucide-react";

const services = [
  {
    title: "تنظيف الأسنان",
    description: "تنظيف شامل ومهني لأسنانك مع أحدث التقنيات",
    icon: Smile,
    price: "من 200 ريال",
  },
  {
    title: "حشوات الأسنان",
    description: "حشوات تجميلية بأحدث المواد الطبية المعتمدة",
    icon: Shield,
    price: "من 300 ريال",
  },
  {
    title: "تقويم الأسنان",
    description: "تقويم شامل بأحدث التقنيات الطبية المتقدمة",
    icon: Star,
    price: "من 3000 ريال",
  },
  {
    title: "زراعة الأسنان",
    description: "زراعة متطورة مع ضمان طويل المدى",
    icon: Heart,
    price: "من 2500 ريال",
  },
  {
    title: "تبييض الأسنان",
    description: "تبييض آمن وفعال لابتسامة مشرقة",
    icon: Star,
    price: "من 800 ريال",
  },
  {
    title: "علاج الجذور",
    description: "علاج متخصص للجذور بأحدث التقنيات",
    icon: Award,
    price: "من 600 ريال",
  },
];

const features = [
  {
    title: "حجز سهل عبر الإنترنت",
    description: "احجز موعدك بسهولة من خلال منصتنا الرقمية",
    icon: Calendar,
  },
  {
    title: "فريق طبي متخصص",
    description: "أطباء أسنان معتمدون بخبرة طويلة في المجال",
    icon: Users,
  },
  {
    title: "تقنيات متقدمة",
    description: "نستخدم أحدث التقنيات الطبية المعتمدة عالمياً",
    icon: Shield,
  },
  {
    title: "خدمة 24/7",
    description: "خدمة عملاء متاحة على مدار الساعة لخدمتكم",
    icon: Clock,
  },
];

const stats = [
  { number: "5000+", label: "مريض راضٍ" },
  { number: "15+", label: "سنة خبرة" },
  { number: "98%", label: "نسبة نجاح" },
  { number: "24/7", label: "خدمة العملاء" },
];

export default function Index() {
  return (
    <div className="min-h-screen" dir="rtl">
      {/* Hero Section */}
      <section className="bg-gradient-to-l from-dental-primary to-dental-primary/90 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-arabic">
              عيادة الدكتور كمال
            </h1>
            <p className="text-xl md:text-2xl mb-8 font-arabic opacity-90">
              رعاية شاملة ومتطورة لصحة أسنانك وابتسامتك
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/booking">
                <Button
                  size="lg"
                  className="bg-white text-dental-primary hover:bg-gray-100 font-arabic text-lg px-8 py-3"
                >
                  احجز موعداً الآن
                  <Calendar className="mr-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-dental-primary font-arabic text-lg px-8 py-3"
              >
                تواصل معنا
                <Phone className="mr-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-dental-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-arabic">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-arabic">
              خدماتنا المتميزة
            </h2>
            <p className="text-lg text-gray-600 font-arabic">
              نقدم مجموعة شاملة من خدمات طب الأسنان بأعلى معايير الجودة
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <img
                      loading="lazy"
                      srcSet="https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F72c80f114dc149019051b6852a9e3b7a?width=100 100w, https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F72c80f114dc149019051b6852a9e3b7a?width=200 200w, https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F72c80f114dc149019051b6852a9e3b7a?width=400 400w, https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F72c80f114dc149019051b6852a9e3b7a?width=800 800w, https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F72c80f114dc149019051b6852a9e3b7a?width=1200 1200w, https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F72c80f114dc149019051b6852a9e3b7a?width=1600 1600w, https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F72c80f114dc149019051b6852a9e3b7a?width=2000 2000w, https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F72c80f114dc149019051b6852a9e3b7a"
                      className="w-full h-32 object-cover object-center rounded-t-lg mb-4"
                      alt={`خدمة ${service.title}`}
                    />
                    <div className="flex items-center justify-between">
                      <Icon className="h-10 w-10 text-dental-primary" />
                      <span className="text-dental-primary font-bold">
                        <p>
                          <br />
                        </p>
                      </span>
                    </div>
                    <CardTitle className="font-arabic">
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="font-arabic text-gray-600">
                      {service.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-arabic">
              لماذا تختارنا؟
            </h2>
            <p className="text-lg text-gray-600 font-arabic">
              نتميز بالخدمة المهنية والتقنيات المتقدمة لضمان أفضل رعاية طبية
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-dental-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-dental-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 font-arabic">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 font-arabic">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-dental-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-arabic">
            جاهز لبدء رحلة العناية بأسنانك؟
          </h2>
          <p className="text-xl mb-8 font-arabic opacity-90">
            احجز موعدك اليوم واحصل على استشارة مجانية
          </p>
          <Link to="/booking">
            <Button
              size="lg"
              className="bg-white text-dental-primary hover:bg-gray-100 font-arabic text-lg px-8 py-3"
            >
              احجز موعداً مجانياً
              <Calendar className="mr-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 font-arabic">
                تواصل معنا
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-reverse space-x-3">
                  <Phone className="h-5 w-5 text-dental-primary" />
                  <span className="font-arabic">
                    <p>00967 777775545</p>
                  </span>
                </div>
                <div className="flex items-center space-x-reverse space-x-3">
                  <Mail className="h-5 w-5 text-dental-primary" />
                  <span className="font-arabic">
                    <p>info@dkalmoli.com</p>
                  </span>
                </div>
                <div className="flex items-center space-x-reverse space-x-3">
                  <MapPin className="h-5 w-5 text-dental-primary" />
                  <span className="font-arabic">
                    شارع المقالح -حي الاصبحي امام سيتي ماكس
                  </span>
                </div>
              </div>
              <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4 font-arabic">
                  ساعات العمل
                </h3>
                <div className="space-y-2 font-arabic">
                  <div className="flex justify-between">
                    <span>السبت - الخميس</span>
                    <span>9:00 ص - 9:00 م</span>
                  </div>
                  <div className="flex justify-between">
                    <span>الجمعة</span>
                    <span>2:00 م - 9:00 م</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4 font-arabic">
                إدارة النظام
              </h3>
              <p className="text-gray-600 mb-6 font-arabic">
                دخو�� سريع لإدارة الحجوزات وملفات المرضى
              </p>
              <div className="space-y-4">
                <Link to="/admin" className="block">
                  <Button className="w-full font-arabic" variant="outline">
                    لوحة الإدارة
                    <Settings className="mr-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/patients" className="block">
                  <Button className="w-full font-arabic" variant="outline">
                    ملفات المرضى
                    <Users className="mr-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/transactions" className="block">
                  <Button className="w-full font-arabic" variant="outline">
                    المعاملات المالية
                    <CheckCircle className="mr-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
