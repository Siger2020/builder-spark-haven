import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';
import { 
  Bug, 
  CheckCircle, 
  XCircle, 
  Info, 
  RefreshCw,
  AlertTriangle 
} from 'lucide-react';
import { emailJSService } from '../services/emailJSService';

const EmailJSDiagnostics: React.FC = () => {
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [typeErrorDiagnosis, setTypeErrorDiagnosis] = useState<any>(null);
  const [isRunningTypeError, setIsRunningTypeError] = useState(false);

  const runDiagnostics = () => {
    setIsRunning(true);

    try {
      // Get comprehensive diagnostic information
      const diagInfo = emailJSService.getDiagnosticInfo();
      setDiagnostics(diagInfo);

      // Log to console for developers
      console.log("=== EmailJS Comprehensive Diagnostics ===");
      console.log(diagInfo);

    } catch (error) {
      console.error("Diagnostics error:", error);
      setDiagnostics({
        error: "فشل في تشغيل التشخيص: " + (error instanceof Error ? error.message : 'خطأ غير معروف')
      });
    } finally {
      setIsRunning(false);
    }
  };

  const runTypeErrorDiagnosis = async () => {
    setIsRunningTypeError(true);

    try {
      const result = await emailJSService.runTypeErrorDiagnosis();
      setTypeErrorDiagnosis(result);

      console.log("=== TypeError Diagnosis Results ===");
      console.log(result);

    } catch (error) {
      console.error("TypeError diagnosis error:", error);
      setTypeErrorDiagnosis({
        success: false,
        issues: ["فشل في تشغيل تشخيص TypeError"],
        recommendations: ["تحقق من console للتفاصيل"]
      });
    } finally {
      setIsRunningTypeError(false);
    }
  };

  const StatusIcon = ({ status }: { status: boolean }) => {
    return status ? 
      <CheckCircle className="w-4 h-4 text-green-600" /> : 
      <XCircle className="w-4 h-4 text-red-600" />;
  };

  const StatusBadge = ({ status, trueText = "نعم", falseText = "لا" }: { 
    status: boolean; 
    trueText?: string; 
    falseText?: string; 
  }) => {
    return (
      <Badge variant={status ? "default" : "destructive"}>
        {status ? trueText : falseText}
      </Badge>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-arabic">
          <Bug className="w-5 h-5" />
          تشخيص EmailJS المتقدم
        </CardTitle>
        <CardDescription className="font-arabic">
          فحص شامل لحالة EmailJS والإعدادات والبيئة
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Button
            onClick={runDiagnostics}
            disabled={isRunning}
            className="font-arabic"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                جاري التشخيص...
              </>
            ) : (
              <>
                <Bug className="w-4 h-4 mr-2" />
                تشخيص شامل
              </>
            )}
          </Button>

          <Button
            onClick={runTypeErrorDiagnosis}
            disabled={isRunningTypeError}
            variant="outline"
            className="font-arabic"
          >
            {isRunningTypeError ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                فحص TypeError...
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 mr-2" />
                فحص TypeError
              </>
            )}
          </Button>
        </div>

        {typeErrorDiagnosis && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-arabic">
                <AlertTriangle className="w-5 h-5" />
                نتائج فحص TypeError
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-arabic">الحالة:</span>
                <StatusBadge
                  status={typeErrorDiagnosis.success}
                  trueText="سليم"
                  falseText="يوجد مشاكل"
                />
              </div>

              {typeErrorDiagnosis.issues && typeErrorDiagnosis.issues.length > 0 && (
                <div>
                  <h4 className="font-arabic font-medium mb-2">المشاكل المكتشفة:</h4>
                  <ul className="space-y-1">
                    {typeErrorDiagnosis.issues.map((issue: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <span className="font-arabic">{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {typeErrorDiagnosis.recommendations && typeErrorDiagnosis.recommendations.length > 0 && (
                <div>
                  <h4 className="font-arabic font-medium mb-2">التوصيات:</h4>
                  <ul className="space-y-1">
                    {typeErrorDiagnosis.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="font-arabic">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {diagnostics && (
          <div className="space-y-4">
            {diagnostics.error ? (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="font-arabic">
                  {diagnostics.error}
                </AlertDescription>
              </Alert>
            ) : (
              <>
                {/* Service Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-arabic">معلومات الخدمة</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-arabic">حالة التكوين:</span>
                      <StatusBadge 
                        status={diagnostics.serviceInfo?.isConfigured} 
                        trueText="مُعد"
                        falseText="غير مُعد"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-arabic">حالة التهيئة:</span>
                      <StatusBadge 
                        status={diagnostics.serviceInfo?.isInitialized} 
                        trueText="مُهيأ"
                        falseText="غير مُهيأ"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-arabic">حالة الاتصال:</span>
                      <Badge variant="outline">
                        {diagnostics.serviceInfo?.connectionStatus || 'غير معروف'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-arabic">طلبات معلقة:</span>
                      <Badge variant="outline">
                        {diagnostics.serviceInfo?.pendingRequests || 0}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-arabic">طابور الانتظار:</span>
                      <Badge variant="outline">
                        {diagnostics.serviceInfo?.queueLength || 0}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Configuration Information */}
                {diagnostics.configInfo && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg font-arabic">معلومات التكوين</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-arabic">Service ID:</span>
                        <StatusIcon status={diagnostics.configInfo.hasServiceId} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-arabic">Template ID:</span>
                        <StatusIcon status={diagnostics.configInfo.hasTemplateId} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-arabic">Public Key:</span>
                        <StatusIcon status={diagnostics.configInfo.hasPublicKey} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-arabic">Sender Email:</span>
                        <StatusIcon status={diagnostics.configInfo.hasSenderEmail} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-arabic">مُفعل:</span>
                        <StatusBadge status={diagnostics.configInfo.enabled} />
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Library Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-arabic">معلومات المكتبة</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-arabic">EmailJS متاح:</span>
                      <StatusIcon status={diagnostics.libraryInfo?.emailjsAvailable} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-arabic">نوع EmailJS:</span>
                      <Badge variant="outline">
                        {diagnostics.libraryInfo?.emailjsType || 'غير معروف'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-arabic">دالة الإرسال:</span>
                      <StatusIcon status={diagnostics.libraryInfo?.hasSendFunction} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-arabic">دالة التهيئة:</span>
                      <StatusIcon status={diagnostics.libraryInfo?.hasInitFunction} />
                    </div>
                  </CardContent>
                </Card>

                {/* Environment Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-arabic">معلومات البيئة</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-arabic">متصفح:</span>
                      <StatusIcon status={diagnostics.environmentInfo?.isBrowser} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="font-arabic text-sm font-medium">User Agent:</span>
                      <div className="text-xs bg-gray-100 p-2 rounded break-all">
                        {diagnostics.environmentInfo?.userAgent || 'غير متوفر'}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-arabic">وقت التشخيص:</span>
                      <Badge variant="outline" className="text-xs">
                        {diagnostics.environmentInfo?.timestamp ? 
                          new Date(diagnostics.environmentInfo.timestamp).toLocaleString('ar-SA') : 
                          'غير م��وفر'
                        }
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription className="font-arabic">
                    تم حفظ معلومات التشخيص التفصيلية في console للمطورين. 
                    اضغط F12 وانتقل إلى Console لرؤية التفاصيل الكاملة.
                  </AlertDescription>
                </Alert>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmailJSDiagnostics;
