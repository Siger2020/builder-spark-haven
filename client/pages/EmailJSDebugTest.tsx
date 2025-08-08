import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Bug,
  Send,
  RefreshCw
} from 'lucide-react';
import { emailJSService } from '../services/emailJSService';

const EmailJSDebugTest: React.FC = () => {
  const [testEmail, setTestEmail] = useState('test@example.com');
  const [testResults, setTestResults] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [libraryInfo, setLibraryInfo] = useState<any>(null);

  // Test EmailJS library availability on component mount
  useEffect(() => {
    const checkLibrary = () => {
      try {
        // Import the library
        import('@emailjs/browser').then((emailjs) => {
          setLibraryInfo({
            importSuccess: true,
            hasEmailJS: !!emailjs,
            hasDefault: !!emailjs.default,
            hasSend: !!(emailjs.default?.send || emailjs.send),
            hasInit: !!(emailjs.default?.init || emailjs.init),
            exportedKeys: Object.keys(emailjs),
            defaultKeys: emailjs.default ? Object.keys(emailjs.default) : [],
            emailjsType: typeof emailjs,
            defaultType: typeof emailjs.default
          });
        }).catch((error) => {
          setLibraryInfo({
            importSuccess: false,
            error: error.message
          });
        });
      } catch (error) {
        setLibraryInfo({
          importSuccess: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    };

    checkLibrary();
  }, []);

  const runComprehensiveTest = async () => {
    setIsRunning(true);
    setTestResults(null);

    const results: any = {
      timestamp: new Date().toISOString(),
      tests: []
    };

    try {
      // Test 1: Library Import Test
      results.tests.push({
        name: 'Library Import Test',
        status: 'running'
      });

      let emailjsLibrary;
      try {
        emailjsLibrary = await import('@emailjs/browser');
        results.tests[0].status = 'success';
        results.tests[0].details = 'Library imported successfully';
      } catch (error) {
        results.tests[0].status = 'failed';
        results.tests[0].error = error instanceof Error ? error.message : 'Import failed';
        setTestResults(results);
        return;
      }

      // Test 2: Library Structure Test
      results.tests.push({
        name: 'Library Structure Test',
        status: 'running'
      });

      try {
        const structure = {
          hasDefault: !!emailjsLibrary.default,
          hasDirectSend: !!emailjsLibrary.send,
          hasDirectInit: !!emailjsLibrary.init,
          defaultSend: !!(emailjsLibrary.default?.send),
          defaultInit: !!(emailjsLibrary.default?.init),
          exportKeys: Object.keys(emailjsLibrary)
        };

        results.tests[1].status = 'success';
        results.tests[1].details = structure;
      } catch (error) {
        results.tests[1].status = 'failed';
        results.tests[1].error = error instanceof Error ? error.message : 'Structure check failed';
      }

      // Test 3: Service Configuration Test
      results.tests.push({
        name: 'Service Configuration Test',
        status: 'running'
      });

      try {
        const configStatus = emailJSService.isConfigured();
        const connectionStatus = emailJSService.getConnectionStatus();
        
        results.tests[2].status = configStatus ? 'success' : 'failed';
        results.tests[2].details = {
          isConfigured: configStatus,
          connectionStatus: connectionStatus,
          queueStatus: emailJSService.getQueueStatus()
        };
      } catch (error) {
        results.tests[2].status = 'failed';
        results.tests[2].error = error instanceof Error ? error.message : 'Configuration check failed';
      }

      // Test 4: TypeError Diagnosis
      results.tests.push({
        name: 'TypeError Diagnosis',
        status: 'running'
      });

      try {
        const typeErrorResults = await emailJSService.runTypeErrorDiagnosis();
        results.tests[3].status = typeErrorResults.success ? 'success' : 'warning';
        results.tests[3].details = typeErrorResults;
      } catch (error) {
        results.tests[3].status = 'failed';
        results.tests[3].error = error instanceof Error ? error.message : 'TypeError diagnosis failed';
      }

      // Test 5: Test Email Send (if configured)
      if (emailJSService.isConfigured()) {
        results.tests.push({
          name: 'Test Email Send',
          status: 'running'
        });

        try {
          const sendResult = await emailJSService.sendTestEmail(testEmail);
          results.tests[4].status = sendResult.success ? 'success' : 'failed';
          results.tests[4].details = sendResult;
        } catch (error) {
          results.tests[4].status = 'failed';
          results.tests[4].error = error instanceof Error ? error.message : 'Send test failed';
        }
      }

    } catch (error) {
      results.globalError = error instanceof Error ? error.message : 'Unknown error occurred';
    } finally {
      setTestResults(results);
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'running':
        return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />;
      default:
        return <div className="w-4 h-4" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-arabic">
            <Bug className="w-6 h-6" />
            اختبار متقدم لتشخيص أخطاء EmailJS
          </CardTitle>
          <CardDescription className="font-arabic">
            تشخيص شامل للكشف عن مصدر أخطاء TypeError في EmailJS
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Library Information */}
          {libraryInfo && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-arabic">معلومات المكتبة</CardTitle>
              </CardHeader>
              <CardContent>
                {libraryInfo.importSuccess ? (
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-arabic">نجح التحميل:</span>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-arabic">يحتوي على default:</span>
                      <Badge variant={libraryInfo.hasDefault ? "default" : "destructive"}>
                        {libraryInfo.hasDefault ? "نعم" : "لا"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-arabic">دالة send متوفرة:</span>
                      <Badge variant={libraryInfo.hasSend ? "default" : "destructive"}>
                        {libraryInfo.hasSend ? "نعم" : "لا"}
                      </Badge>
                    </div>
                    <div className="text-xs bg-gray-100 p-2 rounded">
                      <strong>الخصائص المُصدَّرة:</strong> {libraryInfo.exportedKeys.join(', ')}
                    </div>
                  </div>
                ) : (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="font-arabic">
                      فشل في تحميل المكتبة: {libraryInfo.error}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}

          {/* Test Configuration */}
          <div className="space-y-3">
            <Label htmlFor="testEmail" className="font-arabic">بريد إلكتروني للاختبار:</Label>
            <Input
              id="testEmail"
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="test@example.com"
            />
          </div>

          {/* Run Test Button */}
          <Button
            onClick={runComprehensiveTest}
            disabled={isRunning}
            className="w-full font-arabic"
            size="lg"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                جاري تشغيل الاختبارات...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                تشغيل اختبار شامل
              </>
            )}
          </Button>

          {/* Test Results */}
          {testResults && (
            <Card>
              <CardHeader>
                <CardTitle className="font-arabic">نتائج الاختبار</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {testResults.globalError && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="font-arabic">
                      خطأ عام: {testResults.globalError}
                    </AlertDescription>
                  </Alert>
                )}

                {testResults.tests.map((test: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium font-arabic">{test.name}</span>
                      {getStatusIcon(test.status)}
                    </div>
                    
                    {test.error && (
                      <Alert variant="destructive" className="mt-2">
                        <AlertDescription className="text-sm">
                          {test.error}
                        </AlertDescription>
                      </Alert>
                    )}

                    {test.details && (
                      <div className="mt-2 text-xs bg-gray-50 p-2 rounded">
                        <pre className="whitespace-pre-wrap overflow-auto max-h-32">
                          {JSON.stringify(test.details, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}

                <div className="text-xs text-gray-500 font-arabic">
                  وقت الاختبار: {new Date(testResults.timestamp).toLocaleString('ar-SA')}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailJSDebugTest;
