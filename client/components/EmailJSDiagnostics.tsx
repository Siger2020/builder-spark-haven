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
        <Button 
          onClick={runDiagnostics}
          disabled={isRunning}
          className="w-full font-arabic"
        >
          {isRunning ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              جاري التشخيص...
            </>
          ) : (
            <>
              <Bug className="w-4 h-4 mr-2" />
              تشغيل التشخيص الشامل
            </>
          )}
        </Button>

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
                          'غير متوفر'
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
