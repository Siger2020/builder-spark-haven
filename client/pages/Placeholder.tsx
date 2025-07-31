import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface PlaceholderProps {
  title: string;
  description: string;
  features?: string[];
}

export default function Placeholder({ title, description, features = [] }: PlaceholderProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-12" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="bg-dental-primary/10 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <Construction className="h-12 w-12 text-dental-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-arabic">
            {title}
          </h1>
          <p className="text-lg text-gray-600 font-arabic">
            {description}
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-arabic">قيد التطوير</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6 font-arabic">
              هذا القسم قيد التطوير حالياً وسيتم إضافة المزيد من الميزات قريباً.
            </p>
            
            {features.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3 font-arabic">الميزات المخطط لها:</h3>
                <ul className="space-y-2">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-reverse space-x-2">
                      <ArrowRight className="h-4 w-4 text-dental-primary" />
                      <span className="font-arabic">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/">
                <Button variant="outline" className="font-arabic">
                  العودة للرئيسية
                </Button>
              </Link>
              <Link to="/booking">
                <Button className="font-arabic">
                  حجز موعد
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
