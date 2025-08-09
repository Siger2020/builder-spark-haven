import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect as Select, NativeSelectItem as SelectItem } from "@/components/ui/native-select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  Download,
  FileText,
  BarChart3,
  Users,
  Calendar,
  CreditCard,
  Activity,
  Loader2,
  CheckCircle
} from "lucide-react";

interface ExportReportsProps {
  isOpen: boolean;
  onClose: () => void;
}

const reportTypes = [
  {
    id: 'patients',
    name: 'تقرير المرضى',
    description: 'قا��مة شاملة بجميع المرضى وبياناتهم',
    icon: Users,
    format: ['PDF', 'Excel', 'CSV']
  },
  {
    id: 'appointments',
    name: 'تقرير المواعيد',
    description: 'تقرير مفصل عن المواعيد والحجوزات',
    icon: Calendar,
    format: ['PDF', 'Excel']
  },
  {
    id: 'financial',
    name: 'التقرير المالي',
    description: 'الإيرادات والمصروفات والمعاملات المالية',
    icon: CreditCard,
    format: ['PDF', 'Excel']
  },
  {
    id: 'treatments',
    name: 'تقرير العلاجات',
    description: 'تقرير شامل عن جلسات العلاج والكشوفات',
    icon: Activity,
    format: ['PDF', 'Excel']
  },
  {
    id: 'analytics',
    name: 'تقرير التحليلات',
    description: 'إحصائيات ومؤشرات الأداء والرسوم البيانية',
    icon: BarChart3,
    format: ['PDF']
  },
  {
    id: 'medical',
    name: 'التقارير الطبية',
    description: 'الكشوفات الطبية والتشخيصا��',
    icon: FileText,
    format: ['PDF', 'Word']
  }
];

export function ExportReports({ isOpen, onClose }: ExportReportsProps) {
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [format, setFormat] = useState('PDF');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleReportToggle = (reportId: string) => {
    setSelectedReports(prev => 
      prev.includes(reportId) 
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    );
  };

  const handleExport = async () => {
    if (selectedReports.length === 0) {
      alert('يرجى اختيار نوع التقرير على ا��أقل');
      return;
    }

    setIsExporting(true);
    
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsExporting(false);
    setExportSuccess(true);
    
    // Reset after showing success
    setTimeout(() => {
      setExportSuccess(false);
      onClose();
      setSelectedReports([]);
    }, 2000);
  };

  const getAvailableFormats = () => {
    if (selectedReports.length === 0) return ['PDF'];
    
    // Get common formats across selected reports
    const selectedReportObjects = reportTypes.filter(r => selectedReports.includes(r.id));
    return selectedReportObjects.reduce((common, report) => {
      return common.filter(format => report.format.includes(format));
    }, selectedReportObjects[0]?.format || ['PDF']);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="font-arabic">ت��دير التقارير</DialogTitle>
          <DialogDescription className="font-arabic">
            اختر التقارير المطلوبة ونطاق التاريخ للتصدير
          </DialogDescription>
        </DialogHeader>

        {isExporting ? (
          <div className="text-center py-12">
            <Loader2 className="h-12 w-12 mx-auto animate-spin text-blue-500 mb-4" />
            <h3 className="text-lg font-bold font-arabic mb-2">جاري تصدير التقارير...</h3>
            <p className="text-gray-600 font-arabic">يرجى الانتظار، قد تستغرق هذه العملية بضع دقائق</p>
            <div className="mt-4">
              <div className="bg-gray-200 rounded-full h-2 w-full">
                <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>
        ) : exportSuccess ? (
          <div className="text-center py-12">
            <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
            <h3 className="text-lg font-bold font-arabic mb-2">تم تصدير التقارير بنجاح!</h3>
            <p className="text-gray-600 font-arabic">تم حفظ التقارير في مجلد التحميلات</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Report Type Selection */}
            <div>
              <h3 className="text-lg font-bold font-arabic mb-4">اختر أنواع التقارير</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportTypes.map((report) => {
                  const Icon = report.icon;
                  const isSelected = selectedReports.includes(report.id);
                  
                  return (
                    <Card 
                      key={report.id} 
                      className={`cursor-pointer transition-all ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'}`}
                      onClick={() => handleReportToggle(report.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Checkbox 
                            checked={isSelected}
                            onChange={() => {}}
                          />
                          <Icon className="h-5 w-5 text-blue-500 mt-1" />
                          <div className="flex-1">
                            <h4 className="font-medium font-arabic">{report.name}</h4>
                            <p className="text-sm text-gray-600 font-arabic">{report.description}</p>
                            <div className="flex gap-1 mt-2">
                              {report.format.map(fmt => (
                                <Badge key={fmt} variant="outline" className="text-xs">
                                  {fmt}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Date Range Selection */}
            <div>
              <h3 className="text-lg font-bold font-arabic mb-4">نطاق التاريخ</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-arabic">من تاريخ</Label>
                  <Input 
                    type="date" 
                    value={dateRange.from}
                    onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-arabic">إلى تاريخ</Label>
                  <Input 
                    type="date" 
                    value={dateRange.to}
                    onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    const today = new Date().toISOString().split('T')[0];
                    setDateRange({ from: today, to: today });
                  }}
                  className="font-arabic"
                >
                  اليوم
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    const today = new Date();
                    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                    setDateRange({ 
                      from: lastWeek.toISOString().split('T')[0], 
                      to: today.toISOString().split('T')[0] 
                    });
                  }}
                  className="font-arabic"
                >
                  آخر أسبوع
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    const today = new Date();
                    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
                    setDateRange({ 
                      from: lastMonth.toISOString().split('T')[0], 
                      to: today.toISOString().split('T')[0] 
                    });
                  }}
                  className="font-arabic"
                >
                  آخر شهر
                </Button>
              </div>
            </div>

            {/* Format Selection */}
            <div>
              <h3 className="text-lg font-bold font-arabic mb-4">تنسيق التصدير</h3>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white font-arabic"
              >
                {getAvailableFormats().map(fmt => (
                  <option key={fmt} value={fmt}>
                    {fmt}
                  </option>
                ))}
              </select>
            </div>

            {/* Export Summary */}
            {selectedReports.length > 0 && (
              <Card className="bg-blue-50">
                <CardContent className="p-4">
                  <h4 className="font-bold font-arabic mb-2">ملخص التصدير</h4>
                  <ul className="space-y-1 text-sm">
                    <li className="font-arabic">
                      <strong>عدد التقارير:</strong> {selectedReports.length}
                    </li>
                    <li className="font-arabic">
                      <strong>التنسيق:</strong> {format}
                    </li>
                    {dateRange.from && dateRange.to && (
                      <li className="font-arabic">
                        <strong>الفترة:</strong> من {new Date(dateRange.from).toLocaleDateString('ar-SA')} إلى {new Date(dateRange.to).toLocaleDateString('ar-SA')}
                      </li>
                    )}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {!isExporting && !exportSuccess && (
          <DialogFooter>
            <Button variant="outline" onClick={onClose} className="font-arabic">
              إلغاء
            </Button>
            <Button 
              onClick={handleExport}
              disabled={selectedReports.length === 0}
              className="font-arabic"
            >
              <Download className="h-4 w-4 mr-2" />
              تصدير التقارير
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ExportReports;
