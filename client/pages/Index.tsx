import { useState } from "react";
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
  ChevronDown,
  ChevronUp,
  Baby,
  Wrench,
  Sparkles,
} from "lucide-react";

const services = [
  {
    title: "تنظيف الأسنان",
    description: "تنظيف شامل ومهني لأسنانك مع أحدث التقنيات",
    icon: Smile,
    price: "من 10,000 ر.ي",
    image: "https://cdn.builder.io/o/assets%2F4227a3a1f6cd425b96f32afb21ed3b0b%2F1b3a064be2df4fceaab047c5445f5579?alt=media&token=62965839-1bc1-457a-b834-e0dd1c178bf4&apiKey=4227a3a1f6cd425b96f32afb21ed3b0b"
  },
  {
    title: "حشوات الأسنان",
    description: "حشوات تجميلية بأحدث المواد الطبية المعتمدة",
    icon: Shield,
    price: "من 300 ري��ل",
    image: "https://cdn.builder.io/o/assets%2F4227a3a1f6cd425b96f32afb21ed3b0b%2Febb9d4d3fc0d430ea2056739377e5737?alt=media&token=ec850565-c54e-41b0-8d8f-2865bb1d1cc3&apiKey=4227a3a1f6cd425b96f32afb21ed3b0b"
  },
  {
    title: "تقويم الأسنان",
    description: "تقويم شامل بأحدث التقنيا�� الطبية المتقدمة",
    icon: Star,
    price: "من 150,000 ر.ي",
    image: "https://cdn.builder.io/o/assets%2F4227a3a1f6cd425b96f32afb21ed3b0b%2F3aa805bd670a4a869618878555c5aece?alt=media&token=41adbb8c-daac-4e89-acf4-441d75def9af&apiKey=4227a3a1f6cd425b96f32afb21ed3b0b"
  },
  {
    title: "زراعة الأسنان",
    description: "زراعة متطورة مع ضمان طويل المدى",
    icon: Heart,
    price: "من 125,000 ر.ي",
    image: "https://cdn.builder.io/api/v1/image/assets%2F4227a3a1f6cd425b96f32afb21ed3b0b%2F3785672e0dd448de9271e7871c4ac204"
  },
  {
    title: "تبييض الأسنان",
    description: "تبييض آمن وفعال لابتسامة مشرقة",
    icon: Star,
    price: "من 40,000 ر.ي",
    image: "https://cdn.builder.io/o/assets%2F4227a3a1f6cd425b96f32afb21ed3b0b%2Fa0d27b1b54994c99afa37896bf474b12?alt=media&token=0aad9bfe-c865-4eee-a16d-072936f66615&apiKey=4227a3a1f6cd425b96f32afb21ed3b0b"
  },
  {
    title: "علاج الجذور",
    description: "علاج متخصص للجذور بأحدث التقنيات",
    icon: Award,
    price: "من 30,000 ر.ي",
    image: "https://cdn.builder.io/o/assets%2F4227a3a1f6cd425b96f32afb21ed3b0b%2F675695eaeaf042d58f3251523ab08d2e?alt=media&token=ee144587-a0a0-4a86-922a-2ad6c36e7fc3&apiKey=4227a3a1f6cd425b96f32afb21ed3b0b"
  },
  {
    title: "طب أسنان الأطفال",
    description: "رعاي�� أسنان لطيفة وممتعة ��صممة خصيصًا للمرضى الصغار. نركز على الوقاية والتثقيف الصحي لتعزيز عادات صحية فموية تدوم مدى الحياة",
    icon: Baby,
    price: "من 7,500 ر.ي",
    image: "https://cdn.builder.io/api/v1/image/assets%2F4227a3a1f6cd425b96f32afb21ed3b0b%2Ffedfae90150d4fc9926af30887034b0e"
  },
  {
    title: "طب الأسنان الترميمي",
    description: "عالج أسنانك التالفة واسترجع وظيفة ابتسامتك ومظهرها. نقدم لك الحشوات والتيجان والجسور وغيرها لاستعادة صحة أسنانك",
    icon: Wrench,
    price: "من 20,000 ر.ي",
    image: "https://cdn.builder.io/api/v1/image/assets%2F4227a3a1f6cd425b96f32afb21ed3b0b%2F4ecc0485788f45fab358a32e32695be9"
  },
  {
    title: "طب الأسنان التجميلي",
    description: "حسّن ابتسامتك مع تبييض الأسنان الاحترافي، وقشور الأسنان، وغيرها من العلاجات التجميلية. عزز ثقتك بنفسك بابتسامة جميلة",
    icon: Sparkles,
    price: "من 25,000 ر.ي",
    image: "https://cdn.builder.io/api/v1/image/assets%2F4227a3a1f6cd425b96f32afb21ed3b0b%2Fba4bbcc0e9c54e84b82134fb9bf8f341"
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

const beforeAfterCases = [
  {
    id: 1,
    title: "تقويم الأسنان",
    description: "تقويم شامل لمدة 18 شهر مع نتائج مذهلة",
    beforeImage: "https://cdn.builder.io/api/v1/image/assets%2F4227a3a1f6cd425b96f32afb21ed3b0b%2F498b557e655b4717aebccef277928cb8",
    afterImage: "https://cdn.builder.io/api/v1/image/assets%2F4227a3a1f6cd425b96f32afb21ed3b0b%2Fd15de2edbd7e480288bbefeb6673351d",
  },
  {
    id: 2,
    title: "تبييض الأسنان",
    description: "تبييض احترافي مع تحسن 8 درجات",
    beforeImage: "https://cdn.builder.io/api/v1/image/assets%2F4227a3a1f6cd425b96f32afb21ed3b0b%2Fe25b29e5bf1e4962b0e27a70e2ba4648",
    afterImage: "https://cdn.builder.io/api/v1/image/assets%2F4227a3a1f6cd425b96f32afb21ed3b0b%2F26113c77982743bb91bbb6482b36781f",
  },
  {
    id: 3,
    title: "زراعة الأسنان",
    description: "زراعة متكاملة مع نتائج طبيعية 100%",
    beforeImage: "https://cdn.builder.io/api/v1/image/assets%2F4227a3a1f6cd425b96f32afb21ed3b0b%2Febb9d4d3fc0d430ea2056739377e5737",
    afterImage: "https://cdn.builder.io/api/v1/image/assets%2F4227a3a1f6cd425b96f32afb21ed3b0b%2F3785672e0dd448de9271e7871c4ac204",
  },
  {
    id: 4,
    title: "حشوات تجميلية",
    description: "حشوات تطابق لون الأسنان الطبيعي 100%",
    beforeImage: "https://cdn.builder.io/api/v1/image/assets%2F4227a3a1f6cd425b96f32afb21ed3b0b%2F675695eaeaf042d58f3251523ab08d2e",
    afterImage: "https://cdn.builder.io/api/v1/image/assets%2F4227a3a1f6cd425b96f32afb21ed3b0b%2F1b3a064be2df4fceaab047c5445f5579",
  },
  {
    id: 5,
    title: "قشور الأسن��ن",
    description: "ابتسامة هوليوودية طبيعية ومتينة",
    beforeImage: "https://cdn.builder.io/api/v1/image/assets%2F4227a3a1f6cd425b96f32afb21ed3b0b%2F3785672e0dd448de9271e7871c4ac204",
    afterImage: "https://cdn.builder.io/api/v1/image/assets%2F4227a3a1f6cd425b96f32afb21ed3b0b%2Fa0d27b1b54994c99afa37896bf474b12",
  },
  {
    id: 6,
    title: "علاج الجذور",
    description: "إنقاذ السن وإزالة الألم نهائياً",
    beforeImage: "https://cdn.builder.io/api/v1/image/assets%2F4227a3a1f6cd425b96f32afb21ed3b0b%2Febb9d4d3fc0d430ea2056739377e5737",
    afterImage: "https://cdn.builder.io/api/v1/image/assets%2F4227a3a1f6cd425b96f32afb21ed3b0b%2F675695eaeaf042d58f3251523ab08d2e",
  },
  // Additional cases for "View More"
  {
    id: 7,
    title: "تركيب التيجان",
    description: "تيجان خزفية بجودة عالية وشكل طبيعي",
    beforeImage: "https://cdn.builder.io/api/v1/image/assets%2F4227a3a1f6cd425b96f32afb21ed3b0b%2F675695eaeaf042d58f3251523ab08d2e",
    afterImage: "https://cdn.builder.io/api/v1/image/assets%2F4227a3a1f6cd425b96f32afb21ed3b0b%2F3aa805bd670a4a869618878555c5aece",
  },
  {
    id: 8,
    title: "جسور الأسنان",
    description: "جسور ثابتة ��تعويض الأسنان المفقودة",
    beforeImage: "https://cdn.builder.io/api/v1/image/assets%2F4227a3a1f6cd425b96f32afb21ed3b0b%2F3785672e0dd448de9271e7871c4ac204",
    afterImage: "https://cdn.builder.io/api/v1/image/assets%2F4227a3a1f6cd425b96f32afb21ed3b0b%2F1b3a064be2df4fceaab047c5445f5579",
  },
  {
    id: 9,
    title: "علاج اللثة",
    description: "علاج التهابات اللثة وتحسين صحة الفم",
    beforeImage: "https://cdn.builder.io/api/v1/image/assets%2F4227a3a1f6cd425b96f32afb21ed3b0b%2Febb9d4d3fc0d430ea2056739377e5737",
    afterImage: "https://cdn.builder.io/api/v1/image/assets%2F4227a3a1f6cd425b96f32afb21ed3b0b%2Fa0d27b1b54994c99afa37896bf474b12",
  },
];

export default function Index() {
  const [showMoreResults, setShowMoreResults] = useState(false);
  return (
    <div className="min-h-screen" dir="rtl">
      {/* Hero Section */}
      <section className="bg-yemen-gradient text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="animate-float absolute top-10 right-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
          <div className="animate-float absolute bottom-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl" style={{animationDelay: '1s'}}></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center animate-fadeInUp">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-arabic">
              عيا��ة الدكتور كمال الملصي
            </h1>
            <p className="text-xl md:text-2xl mb-8 font-arabic opacity-90">
              رعاية شاملة ومتطورة لصحة أسنانك وابتسامتك
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/booking">
                <Button
                  size="lg"
                  className="bg-white text-dental-primary hover:bg-gray-100 font-arabic text-lg px-8 py-3 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  احجز موعداً الآن
                  <Calendar className="mr-2 h-5 w-5 animate-pulse" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-dental-primary font-arabic text-lg px-8 py-3 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
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
                <Card key={index} className="hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 group">
                  <CardHeader>
                    <img
                      loading="lazy"
                      src={service.image}
                      className="w-full h-32 object-cover object-center rounded-t-lg mb-4"
                      alt={`خدمة ${service.title}`}
                    />
                    <div className="flex items-center justify-between">
                      <div className="p-3 rounded-full bg-dental-primary/10 group-hover:bg-dental-primary/20 transition-colors duration-300">
                        <Icon className="h-8 w-8 text-dental-primary group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <span className="text-dental-primary font-bold text-lg font-arabic bg-gradient-to-r from-dental-primary to-blue-600 bg-clip-text text-transparent">
                        {service.price}
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
              نتميز بالخدمة ال��هنية والتقنيات المتقدمة لضمان أفضل رعاية طبية
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center group cursor-pointer transform hover:-translate-y-1 transition-all duration-300">
                  <div className="bg-dental-primary/10 group-hover:bg-dental-primary/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 transform group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                    <Icon className="h-8 w-8 text-dental-primary group-hover:text-dental-primary/90" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 font-arabic group-hover:text-dental-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 font-arabic group-hover:text-gray-700 transition-colors duration-300">
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
              className="bg-white text-dental-primary hover:bg-gray-100 font-arabic text-lg px-8 py-3 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              احجز موعداً مجانياً
              <Calendar className="mr-2 h-5 w-5 animate-pulse" />
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
                  تصميم ابتسامتك المثالية باس��خدام أحدث برامج التصميم ثلاثي الأبعاد
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
      <section className="py-20 before-after-gallery">
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
            {/* Render initial cases (first 6) */}
            {beforeAfterCases.slice(0, 6).map((caseItem) => (
              <Card key={caseItem.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="grid grid-cols-2 gap-1">
                  <div className="relative bg-gray-100">
                    <img
                      src={caseItem.beforeImage}
                      alt={`قبل ${caseItem.title}`}
                      className="w-full h-32 object-cover"
                      loading="lazy"
                      style={{
                        WebkitUserSelect: 'none',
                        WebkitTouchCallout: 'none',
                        WebkitTapHighlightColor: 'transparent'
                      }}
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
                      src={caseItem.afterImage}
                      alt={`بعد ${caseItem.title}`}
                      className="w-full h-32 object-cover"
                      loading="lazy"
                      style={{
                        WebkitUserSelect: 'none',
                        WebkitTouchCallout: 'none',
                        WebkitTapHighlightColor: 'transparent'
                      }}
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
                  <h3 className="font-bold text-gray-900 mb-2 font-arabic">{caseItem.title}</h3>
                  <p className="text-sm text-gray-600 font-arabic">{caseItem.description}</p>
                </CardContent>
              </Card>
            ))}

            {/* Render additional cases if showMoreResults is true */}
            {showMoreResults && beforeAfterCases.slice(6).map((caseItem) => (
              <Card key={caseItem.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="grid grid-cols-2 gap-1">
                  <div className="relative bg-gray-100">
                    <img
                      src={caseItem.beforeImage}
                      alt={`قبل ${caseItem.title}`}
                      className="w-full h-32 object-cover"
                      loading="lazy"
                      style={{
                        WebkitUserSelect: 'none',
                        WebkitTouchCallout: 'none',
                        WebkitTapHighlightColor: 'transparent'
                      }}
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
                      src={caseItem.afterImage}
                      alt={`بعد ${caseItem.title}`}
                      className="w-full h-32 object-cover"
                      loading="lazy"
                      style={{
                        WebkitUserSelect: 'none',
                        WebkitTouchCallout: 'none',
                        WebkitTapHighlightColor: 'transparent'
                      }}
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
                  <h3 className="font-bold text-gray-900 mb-2 font-arabic">{caseItem.title}</h3>
                  <p className="text-sm text-gray-600 font-arabic">{caseItem.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* عرض المزيد */}
          <div className="text-center mt-12">
            <Button
              onClick={() => setShowMoreResults(!showMoreResults)}
              className="bg-gradient-to-r from-dental-primary to-blue-600 hover:from-dental-primary/90 hover:to-blue-600/90 text-white px-8 py-4 text-lg font-arabic transition-all duration-300 transform hover:scale-105"
              size="lg"
            >
              <div className="flex items-center space-x-reverse space-x-3">
                <span>{showMoreResults ? "إخفا�� النتائج الإضافية" : "شاهد المزيد من النتائج"}</span>
                {showMoreResults ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
                <span className="text-2xl">📸</span>
              </div>
            </Button>
            <p className="text-gray-600 font-arabic mt-4">
              {showMoreResults ?
                `عرض ${beforeAfterCases.length} حالة نجاح موثقة` :
                "+500 حالة نجاح موثقة"
              }
            </p>
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
                    "تجربة رائعة مع فريق متميز. العلاج كان مريحاً والنتائج فاقت توقعاتي. أنصح الجميع بعيادة الدكتور كمال ��لملصي."
                  </p>
                </div>
                <div className="flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1494790108755-2616b612b412?w=60&h=60&fit=crop&crop=face"
                    alt="أمل محم��"
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
                    <div className="text-sm text-gray-600 font-arabic">زراعة الأسن��ن</div>
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
                    "خدمة متميزة ونتائج مذهلة. تبييض الأسنان كان آمناً وف��الاً. أشكر الدكتور وكامل الفريق على الاهتمام الرائع."
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
                    <p>+967 777 775 545</p>
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
                    شا��ع المقالح -حي الاصبحي ��مام سيتي ماكس
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
