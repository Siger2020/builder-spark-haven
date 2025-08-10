import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  Heart,
  CheckCircle,
  Award,
  Users,
} from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  age: number;
  location: string;
  rating: number;
  service: string;
  review: string;
  beforeImage?: string;
  afterImage?: string;
  date: string;
  verified: boolean;
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "سارة أحمد",
    age: 28,
    location: "صنعاء",
    rating: 5,
    service: "تقويم الأسنان",
    review:
      "تجربة رائعة مع الدكتور كمال الملصي! حصلت على النتيجة التي حل��ت بها. الفريق محترف والعيادة نظيفة ومريحة. أنصح الجميع بزيارة هذه العيادة المتميزة.",
    date: "2024-01-15",
    verified: true,
  },
  {
    id: "2",
    name: "محمد علي",
    age: 35,
    location: "تعز",
    rating: 5,
    service: "زراعة الأسنان",
    review:
      "كان لدي خوف شديد من زراعة الأسنان، لكن الدكتور كمال جعل العملية سهلة ومريحة. النتيجة فاقت توقعاتي تماماً. شكراً لكم على الرعاية الممتازة!",
    date: "2024-01-10",
    verified: true,
  },
  {
    id: "3",
    name: "فاطمة الزهراء",
    age: 42,
    location: "عدن",
    rating: 5,
    service: "تبييض الأسنان",
    review:
      "خدمة استثنائية! حصلت على ابتسامة بيضاء مشرقة في جلسة واحدة. الأسعار معقولة والنتائج مذهلة. العيادة مجهزة بأحدث التقنيات.",
    date: "2024-01-08",
    verified: true,
  },
  {
    id: "4",
    name: "أحمد محمود",
    age: 29,
    location: "الحديدة",
    rating: 5,
    service: "حشوات تجميلية",
    review:
      "دقة في العمل واهتمام بالتفاصيل. ��م علاج أسناني بأحدث التقنيات وبدون ألم. أشكر الدكتور والفريق على الاهتمام الرائع.",
    date: "2024-01-05",
    verified: true,
  },
  {
    id: "5",
    name: "نور الهدى",
    age: 24,
    location: "إب",
    rating: 5,
    service: "تنظيف الأسنان",
    review:
      "عيادة رائعة بمعايير عالمية. الفريق ودود ومهني، والدكتور يشرح كل شيء بوضوح. أشعر بالثقة التامة في العلاج هنا.",
    date: "2024-01-03",
    verified: true,
  },
];

const CustomerTestimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
    setIsAutoPlaying(false);
  };

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section
      className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Heart className="h-6 w-6 text-red-500" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-arabic">
              شهادات عملائنا الكرام
            </h2>
            <Heart className="h-6 w-6 text-red-500" />
          </div>
          <p className="text-xl text-gray-600 font-arabic max-w-3xl mx-auto">
            تجارب حقيقية من عملائنا الذين حصلوا على أفضل رعاية لأسنانهم
          </p>

          {/* Statistics */}
          <div className="flex justify-center gap-8 mt-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Users className="h-5 w-5 text-dental-primary" />
                <span className="text-2xl font-bold text-dental-primary">
                  500+
                </span>
              </div>
              <p className="text-sm text-gray-600 font-arabic">عميل سعيد</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="text-2xl font-bold text-dental-primary">
                  4.9
                </span>
              </div>
              <p className="text-sm text-gray-600 font-arabic">تقييم متوسط</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Award className="h-5 w-5 text-dental-primary" />
                <span className="text-2xl font-bold text-dental-primary">
                  15+
                </span>
              </div>
              <p className="text-sm text-gray-600 font-arabic">سنة خبرة</p>
            </div>
          </div>
        </div>

        {/* Main Testimonial */}
        <div className="relative">
          <Card className="max-w-4xl mx-auto shadow-2xl border-0 overflow-hidden">
            <CardContent className="p-8 md:p-12 bg-white">
              <div className="flex items-center justify-center mb-6">
                <Quote className="h-12 w-12 text-dental-primary opacity-20" />
              </div>

              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  {renderStars(currentTestimonial.rating)}
                </div>
                <blockquote className="text-xl md:text-2xl text-gray-700 font-arabic leading-relaxed mb-6">
                  "{currentTestimonial.review}"
                </blockquote>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-right">
                    <h4 className="font-bold text-lg text-gray-900 font-arabic flex items-center gap-2">
                      {currentTestimonial.name}
                      {currentTestimonial.verified && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </h4>
                    <p className="text-gray-600 font-arabic">
                      {currentTestimonial.age} سنة •{" "}
                      {currentTestimonial.location}
                    </p>
                  </div>
                  <div className="text-left">
                    <Badge className="bg-dental-primary text-white font-arabic">
                      {currentTestimonial.service}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(currentTestimonial.date).toLocaleDateString(
                        "ar-SA",
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={prevTestimonial}
              className="h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonial}
              className="h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Testimonial Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToTestimonial(index)}
              className={`h-3 w-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-dental-primary scale-125"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>

        {/* Grid of Mini Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <Card
              key={testimonial.id}
              className="hover:shadow-lg transition-shadow duration-300"
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex">{renderStars(testimonial.rating)}</div>
                  {testimonial.verified && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                </div>
                <p className="text-gray-700 font-arabic text-sm mb-4 line-clamp-3">
                  "{testimonial.review}"
                </p>
                <div className="flex justify-between items-center">
                  <div>
                    <h5 className="font-semibold text-gray-900 font-arabic">
                      {testimonial.name}
                    </h5>
                    <p className="text-xs text-gray-500 font-arabic">
                      {testimonial.location}
                    </p>
                  </div>
                  <Badge variant="outline" className="font-arabic text-xs">
                    {testimonial.service}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-lg text-gray-600 font-arabic mb-6">
            انضم إلى عملائنا السعداء واحصل على الابتسامة التي تستحقها
          </p>
          <Button className="bg-dental-primary hover:bg-dental-primary/90 text-white px-8 py-3 rounded-full font-arabic text-lg shadow-lg hover:shadow-xl transition-all duration-300">
            احجز موعدك الآن
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CustomerTestimonials;
