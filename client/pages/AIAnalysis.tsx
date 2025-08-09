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

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("حجم الملف كبير جداً. يرجى اختيار صورة أصغر من 10 ميجابايت.");
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert("يرجى اختيار ملف صورة صالح.");
      return;
    }

    setLoading(true);
    try {
      // Create form data for file upload
      const formData = new FormData();
      formData.append('image', file);
      formData.append('patientId', ''); // Can be selected later
      formData.append('doctorId', '1'); // Default doctor

      // Send to AI analysis API
      const response = await fetch('/api/ai-analysis/analyze-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('فشل في تحليل الصورة');
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'فشل في تحليل الصورة');
      }

      const newAnalysis: AnalysisResult = {
        id: result.analysis?.id?.toString() || Date.now().toString(),
        type: "image",
        result: {
          diagnosis: result.analysis?.diagnosis || "تم رفع الصورة بنجاح",
          confidence: result.analysis?.confidence || 85,
          recommendations: result.analysis?.recommendations || [
            "تم حفظ الصورة في النظام",
            "سيتم مراجعتها من قبل الطبيب المختص",
            "ستحصل على النتائج قريباً"
          ],
          severity: result.analysis?.severity || "medium",
          followUp: "متابعة مع الطبيب المختص",
        },
        timestamp: new Date(),
      };

      setAnalyses((prev) => [newAnalysis, ...prev]);

      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      alert("تم رفع الصورة وتحليلها بنجاح!");

    } catch (error) {
      console.error("Error analyzing image:", error);
      alert("حدث خطأ أثناء تحليل الصورة. يرجى المحاولة مرة أخرى.");

      // Still add a basic entry to show the upload attempt
      const fallbackResult: AnalysisResult = {
        id: Date.now().toString(),
        type: "image",
        result: {
          diagnosis: "فشل في التحليل - تم حفظ الصورة",
          confidence: 0,
          recommendations: [
            "تم حفظ الصورة في النظام",
            "يرجى مراجعة الطبيب لتحليل يدوي",
            "المحاولة مرة أخرى لاحقاً"
          ],
          severity: "medium",
          followUp: "مراجعة الطبيب المختص",
        },
        timestamp: new Date(),
      };
      setAnalyses((prev) => [fallbackResult, ...prev]);
    } finally {
      setLoading(false);
    }
  };

  const handleSymptomsAnalysis = async () => {
    if (!symptoms.trim()) return;

    setLoading(true);
    try {
      // Send to AI analysis API
      const response = await fetch('/api/ai-analysis/analyze-symptoms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symptoms: symptoms.trim(),
          patientId: null, // Can be selected later
          doctorId: 1, // Default doctor
        }),
      });

      if (!response.ok) {
        throw new Error('فشل في تحليل الأعراض');
      }

      const result = await response.json();

      const newAnalysis: AnalysisResult = {
        id: result.data?.id || Date.now().toString(),
        type: "symptoms",
        result: {
          diagnosis: result.data?.diagnosis || "تم تحليل الأعراض",
          confidence: result.data?.confidence || 75,
          recommendations: result.data?.recommendations || [
            "تم حفظ الأعراض في النظام",
            "مراجعة مع الطبيب المختص",
            "متابعة الأعراض"
          ],
          severity: result.data?.severity || "medium",
          followUp: result.data?.followUp || "مراجعة مع الطبيب المختص",
        },
        timestamp: new Date(),
      };

      setAnalyses((prev) => [newAnalysis, ...prev]);
      setSymptoms("");

      alert("تم تحليل الأعراض بنجاح!");

    } catch (error) {
      console.error("Error analyzing symptoms:", error);
      alert("حدث خطأ أثناء تحليل الأعراض. يرجى المحاولة مرة أخرى.");

      // Still add a basic entry to show the analysis attempt
      const fallbackResult: AnalysisResult = {
        id: Date.now().toString(),
        type: "symptoms",
        result: {
          diagnosis: "فشل في التحليل - تم حفظ الأعراض",
          confidence: 0,
          recommendations: [
            "تم حفظ الأعراض في النظام",
            "يرجى مراجعة الطبيب للتشخيص",
            "المحاولة مرة أخرى لاحقاً"
          ],
          severity: "medium",
          followUp: "مراجعة الطبيب المختص",
        },
        timestamp: new Date(),
      };
      setAnalyses((prev) => [fallbackResult, ...prev]);
      setSymptoms("");
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
              <div className={`border-2 border-dashed ${loading ? 'border-blue-300 bg-blue-50' : 'border-gray-300'} rounded-lg p-8 text-center transition-colors`}>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <Upload className={`h-12 w-12 mx-auto mb-4 ${loading ? 'text-blue-500 animate-pulse' : 'text-gray-400'}`} />
                <p className="text-lg mb-2">اسحب وأفلت الصورة هنا أو</p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                  className="mb-2"
                >
                  {loading ? "جاري الرفع..." : "اختيار ملف"}
                </Button>
                <p className="text-xs text-gray-500">
                  الحد الأقصى لحجم الملف: 10 ميجابايت
                </p>
              </div>
              {loading && (
                <div className="mt-4">
                  <Progress value={66} className="w-full" />
                  <p className="text-center mt-2 text-sm text-muted-foreground">
                    جاري رفع وتحليل الصورة...
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
