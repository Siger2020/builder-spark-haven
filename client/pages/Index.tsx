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
    image: "https://cdn.builder.io/o/assets%2F4227a3a1f6cd425b96f32afb21ed3b0b%2F1b3a064be2df4fceaab047c5445f5579?alt=media&token=62965839-1bc1-457a-b834-e0dd1c178bf4&apiKey=4227a3a1f6cd425b96f32afb21ed3b0b"
  },
  {
    title: "حشوات الأسنان",
    description: "حشوات تجميلية بأحدث المواد الطبية المعتمدة",
    icon: Shield,
    price: "من 300 ريال",
    image: "https://cdn.builder.io/o/assets%2F4227a3a1f6cd425b96f32afb21ed3b0b%2Febb9d4d3fc0d430ea2056739377e5737?alt=media&token=ec850565-c54e-41b0-8d8f-2865bb1d1cc3&apiKey=4227a3a1f6cd425b96f32afb21ed3b0b"
  },
  {
    title: "تقويم الأسنان",
    description: "تقويم شامل بأحدث التقنيات الطبية المتقدمة",
    icon: Star,
    price: "من 3000 ريال",
    image: "https://cdn.builder.io/o/assets%2F4227a3a1f6cd425b96f32afb21ed3b0b%2F3aa805bd670a4a869618878555c5aece?alt=media&token=41adbb8c-daac-4e89-acf4-441d75def9af&apiKey=4227a3a1f6cd425b96f32afb21ed3b0b"
  },
  {
    title: "زراعة الأسنان",
    description: "زراعة متطورة مع ضمان طويل المدى",
    icon: Heart,
    price: "من 2500 ريال",
    image: "https://cdn.builder.io/api/v1/image/assets%2F4227a3a1f6cd425b96f32afb21ed3b0b%2F3785672e0dd448de9271e7871c4ac204"
  },
  {
    title: "تبييض الأسنان",
    description: "تبييض آمن وفعال لابتسامة مشرقة",
    icon: Star,
    price: "من 800 ريال",
    image: "https://cdn.builder.io/o/assets%2F4227a3a1f6cd425b96f32afb21ed3b0b%2Fa0d27b1b54994c99afa37896bf474b12?alt=media&token=0aad9bfe-c865-4eee-a16d-072936f66615&apiKey=4227a3a1f6cd425b96f32afb21ed3b0b"
  },
  {
    title: "علاج الجذور",
    description: "علاج متخصص للجذور بأحدث التقنيات",
    icon: Award,
    price: "من 600 ريال",
    image: "https://cdn.builder.io/o/assets%2F4227a3a1f6cd425b96f32afb21ed3b0b%2F675695eaeaf042d58f3251523ab08d2e?alt=media&token=ee144587-a0a0-4a86-922a-2ad6c36e7fc3&apiKey=4227a3a1f6cd425b96f32afb21ed3b0b"
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
              عيادة الدكتور كمال الملصي
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
                      src={service.image}
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

      {/* Advanced Technologies Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-arabic">
              التقنيات المتقدمة
            </h2>
            <p className="text-lg text-gray-600 font-arabic">
              نستخدم أحدث التقنيات في طب الأسنان لضمان أفضل النتائج
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <Settings className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 font-arabic">
                  الواقع الافتراضي
                </h3>
                <p className="text-gray-600 font-arabic mb-4">
                  تجربة علاجية مريحة باستخدام تقنيات الواقع الافتراضي لتقليل القلق والتوتر
                </p>
                <div className="text-sm text-blue-600 font-arabic">
                  متوفر في جميع العلاجات
                </div>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="bg-purple-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <Star className="h-10 w-10 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 font-arabic">
                  محاكاة الابتسامة
                </h3>
                <p className="text-gray-600 font-arabic mb-4">
                  رؤية النتائج المتوقعة قبل بدء العلاج باستخدام تقنيات الذكاء الاصطناعي
                </p>
                <div className="text-sm text-purple-600 font-arabic">
                  دقة 95% في التوقعات
                </div>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <Heart className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 font-arabic">
                  التصميم الرقمي ثلاثي الأبعاد
                </h3>
                <p className="text-gray-600 font-arabic mb-4">
                  تصميم ابتسامتك المثالية باستخدام أحدث برامج التصميم ثلاثي الأبعاد
                </p>
                <div className="text-sm text-green-600 font-arabic">
                  تصميم مخصص لكل مريض
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Before & After Gallery */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-arabic">
              قبل وبعد العلاج
            </h2>
            <p className="text-lg text-gray-600 font-arabic">
              اكتشف التحولات المذهلة التي حققناها لمرضانا
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Before/After Case 1 */}
            <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="grid grid-cols-2 gap-1">
                <div className="relative bg-gray-100">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F72c80f114dc149019051b6852a9e3b7a"
                    alt="قبل تقويم الأسنان"
                    className="w-full h-32 object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDIwMCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iNjgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2QjczODAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCI+2YLYqNmEINin2YTYudmE2KfYrDwvdGV4dD4KPC9zdmc+';
                    }}
                  />
                  <div className="absolute bottom-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-arabic font-bold">
                    قبل
                  </div>
                </div>
                <div className="relative bg-gray-100">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F4227a3a1f6cd425b96f32afb21ed3b0b%2F3aa805bd670a4a869618878555c5aece"
                    alt="بعد تقويم الأسنان"
                    className="w-full h-32 object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDIwMCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTI4IiBmaWxsPSIjRUNGREY1Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iNjgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMxMDczMzciIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCI+2KjYudivINin2YTYudmE2KfYrDwvdGV4dD4KPC9zdmc+';
                    }}
                  />
                  <div className="absolute bottom-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-arabic font-bold">
                    بعد
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-gray-900 mb-2 font-arabic">تقويم الأسنان</h3>
                <p className="text-sm text-gray-600 font-arabic">تقويم شامل لمدة 18 شهر مع نتائج مذهلة</p>
              </CardContent>
            </Card>

            {/* Before/After Case 2 */}
            <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="grid grid-cols-2 gap-1">
                <div className="relative bg-gray-100">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F4227a3a1f6cd425b96f32afb21ed3b0b%2F1b3a064be2df4fceaab047c5445f5579"
                    alt="قبل تبييض الأسنان"
                    className="w-full h-32 object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDIwMCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iNjgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2QjczODAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCI+2YLYqNmEINin2YTYudmE2KfYrDwvdGV4dD4KPC9zdmc+';
                    }}
                  />
                  <div className="absolute bottom-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-arabic font-bold">
                    قبل
                  </div>
                </div>
                <div className="relative bg-gray-100">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F4227a3a1f6cd425b96f32afb21ed3b0b%2Fa0d27b1b54994c99afa37896bf474b12"
                    alt="بعد تبييض الأسنان"
                    className="w-full h-32 object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDIwMCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTI4IiBmaWxsPSIjRUNGREY1Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iNjgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMxMDczMzciIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCI+2KjYudivINin2YTYudmE2KfYrDwvdGV4dD4KPC9zdmc+';
                    }}
                  />
                  <div className="absolute bottom-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-arabic font-bold">
                    بعد
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-gray-900 mb-2 font-arabic">تبييض الأسنان</h3>
                <p className="text-sm text-gray-600 font-arabic">تبييض احترافي مع تحسن 8 درجات</p>
              </CardContent>
            </Card>

            {/* Before/After Case 3 */}
            <Card className="overflow-hidden">
              <div className="grid grid-cols-2">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=200&h=200&fit=crop"
                    alt="قبل العلاج"
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-arabic">
                    قبل
                  </div>
                </div>
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1609840114035-3c981960e832?w=200&h=200&fit=crop"
                    alt="بعد العلاج"
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute bottom-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-arabic">
                    بعد
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-gray-900 mb-2 font-arabic">زراعة الأسنان</h3>
                <p className="text-sm text-gray-600 font-arabic">زراعة متكاملة مع نتائج طبيعية 100%</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Patient Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-arabic">
              شهادات مرضانا
            </h2>
            <p className="text-lg text-gray-600 font-arabic">
              ما يقوله مرضانا عن تجربتهم معنا
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="flex justify-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 italic font-arabic mb-4">
                    "تجربة رائعة مع فريق متميز. العلاج كان مريحاً والنتائج فاقت توقعاتي. أنصح الجميع بعيادة الدكتور كمال الملصي."
                  </p>
                </div>
                <div className="flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1494790108755-2616b612b412?w=60&h=60&fit=crop&crop=face"
                    alt="أمل محمد"
                    className="w-12 h-12 rounded-full ml-3"
                  />
                  <div>
                    <div className="font-bold text-gray-900 font-arabic">أمل محمد</div>
                    <div className="text-sm text-gray-600 font-arabic">تقويم الأسنان</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 2 */}
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="flex justify-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 italic font-arabic mb-4">
                    "الدكتور كمال محترف جداً وفريق العمل ودود. زراعة الأسنان تمت بنجاح وأشعر بثقة أكبر في ابتسامتي."
                  </p>
                </div>
                <div className="flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face"
                    alt="محمد أحمد"
                    className="w-12 h-12 rounded-full ml-3"
                  />
                  <div>
                    <div className="font-bold text-gray-900 font-arabic">محمد أحمد</div>
                    <div className="text-sm text-gray-600 font-arabic">زراعة الأسنان</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 3 */}
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="flex justify-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 italic font-arabic mb-4">
                    "خدمة متميزة ونتائج مذهلة. تبييض الأسنان كان آمناً وفع��لاً. أشكر الدكتور وكامل الفريق على الاهتمام الرائع."
                  </p>
                </div>
                <div className="flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face"
                    alt="فاطمة علي"
                    className="w-12 h-12 rounded-full ml-3"
                  />
                  <div>
                    <div className="font-bold text-gray-900 font-arabic">فاطمة علي</div>
                    <div className="text-sm text-gray-600 font-arabic">تبييض الأسنان</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
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
                    <p>00967777775545</p>
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
