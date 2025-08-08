import { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Brain,
  Upload,
  FileText,
  Image,
  Activity,
  Stethoscope,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

interface AnalysisResult {
  id: string;
  type: "image" | "text" | "symptoms";
  result: {
    diagnosis: string;
    confidence: number;
    recommendations: string[];
    severity: "low" | "medium" | "high";
    followUp: string;
  };
  timestamp: Date;
}

export default function AIAnalysis() {
  const [analyses, setAnalyses] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [symptoms, setSymptoms] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      // Simulate AI analysis
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const mockResult: AnalysisResult = {
        id: Date.now().toString(),
        type: "image",
        result: {
          diagnosis: "اشتباه في التهاب اللثة المتوسط",
          confidence: 87,
          recommendations: [
            "تنظيف عميق للأسنان",
            "استخدام غسول فم مطهر",
            "مراجعة طبيب الأسنان خلال أسبوع",
          ],
          severity: "medium",
          followUp: "متابعة خلال أسبوعين لتقييم التحسن",
        },
        timestamp: new Date(),
      };

      setAnalyses((prev) => [mockResult, ...prev]);
    } catch (error) {
      console.error("Error analyzing image:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSymptomsAnalysis = async () => {
    if (!symptoms.trim()) return;

    setLoading(true);
    try {
      // Simulate AI analysis
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockResult: AnalysisResult = {
        id: Date.now().toString(),
        type: "symptoms",
        result: {
          diagnosis: "أعراض تشير إلى التهاب الجيوب الأنفية",
          confidence: 76,
          recommendations: [
            "راحة كافية وشرب السوائل",
            "استخدام بخاخ محلول ملحي",
            "مراجعة الطبيب إذا استمرت الأعراض أكثر من أسبوع",
          ],
          severity: "low",
          followUp: "مراجعة خلال 3-5 أيام إذا لم تتحسن الأعراض",
        },
        timestamp: new Date(),
      };

      setAnalyses((prev) => [mockResult, ...prev]);
      setSymptoms("");
    } catch (error) {
      console.error("Error analyzing symptoms:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "low":
        return <CheckCircle className="h-4 w-4" />;
      case "medium":
        return <Activity className="h-4 w-4" />;
      case "high":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-4 rtl:space-x-reverse">
        <Brain className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold">تحليلات الذكاء الاصطناعي</h1>
          <p className="text-muted-foreground">
            تحليل الأمراض وملفات المرضى بتقنية الذكاء الاصطناعي
          </p>
        </div>
      </div>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            تحليل الصور
          </TabsTrigger>
          <TabsTrigger value="symptoms" className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4" />
            تحليل الأعراض
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            التقارير
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                رفع صورة طبية للتحليل
              </CardTitle>
              <CardDescription>
                ارفع صورة أشعة، تحليل مختبري، أو صورة سريرية للحصول على تحليل
                فوري بالذكاء الاصطناعي
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg mb-2">اسحب وأفلت الصورة هنا أو</p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                >
                  اختيار ملف
                </Button>
              </div>
              {loading && (
                <div className="mt-4">
                  <Progress value={33} className="w-full" />
                  <p className="text-center mt-2 text-sm text-muted-foreground">
                    جاري تحليل الصورة...
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="symptoms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5" />
                وصف الأعراض للتحليل
              </CardTitle>
              <CardDescription>
                اكتب الأعراض التي يعاني منها المريض للحصول على تشخيص أولي
                وتوصيات
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="اكتب الأعراض هنا... مثال: صداع، حمى، ألم في الحلق، سعال"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                rows={4}
              />
              <Button
                onClick={handleSymptomsAnalysis}
                disabled={loading || !symptoms.trim()}
                className="w-full"
              >
                {loading ? "جاري التحليل..." : "تحليل الأعراض"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid gap-4">
            {analyses.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Brain className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-lg text-muted-foreground">
                    لا توجد تحليلات بعد
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ابدأ بتحليل صورة أو أعراض لرؤية التقارير
                  </p>
                </CardContent>
              </Card>
            ) : (
              analyses.map((analysis) => (
                <Card key={analysis.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        {analysis.type === "image" && (
                          <Image className="h-5 w-5" />
                        )}
                        {analysis.type === "symptoms" && (
                          <Stethoscope className="h-5 w-5" />
                        )}
                        {analysis.result.diagnosis}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={getSeverityColor(analysis.result.severity)}
                        >
                          {getSeverityIcon(analysis.result.severity)}
                          {analysis.result.severity === "low" && "منخفض"}
                          {analysis.result.severity === "medium" && "متوسط"}
                          {analysis.result.severity === "high" && "عالي"}
                        </Badge>
                        <Badge variant="outline">
                          دقة: {analysis.result.confidence}%
                        </Badge>
                      </div>
                    </div>
                    <CardDescription>
                      {analysis.timestamp.toLocaleDateString("ar-SA")} في{" "}
                      {analysis.timestamp.toLocaleTimeString("ar-SA")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">التوصيات:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {analysis.result.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm">
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>المتابعة المطلوبة:</strong>{" "}
                        {analysis.result.followUp}
                      </AlertDescription>
                    </Alert>
                    <div className="text-xs text-muted-foreground border-t pt-2">
                      <strong>تنبيه:</strong> هذا التحليل مساعد فقط ولا يغني عن
                      استشارة طبيب مختص
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
