import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect as Select, NativeSelectItem as SelectItem } from "@/components/ui/native-select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText, 
  Download, 
  Eye,
  Plus,
  Search,
  Filter,
  Calendar,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Printer,
  Share
} from "lucide-react";

// Mock data for reports
const medicalReports = [
  {
    id: "RPT-001",
    patientName: "أحمد محمد السعد",
    patientId: "PAT-001",
    type: "كشف دوري",
    diagnosis: "تسوس في الضرس الأول العلوي الأيمن",
    treatment: "حشوة تجميلية",
    doctor: "د. سارة أحمد",
    date: "2024-01-15",
    status: "مكتمل",
    recommendations: "متابعة بعد أسبوعين، تنظيف يومي بالفرشاة والخيط",
    nextVisit: "2024-01-29"
  },
  {
    id: "RPT-002",
    patientName: "فاطمة أحمد العلي",
    patientId: "PAT-002",
    type: "استشارة تقويم",
    diagnosis: "عدم انتظام في ترتيب الأسنان",
    treatment: "تقويم معدني",
    doctor: "د. محمد علي",
    date: "2024-01-14",
    status: "جاري العلاج",
    recommendations: "زيارة شهرية لتعديل التقويم، تجنب الأطعمة الصلبة",
    nextVisit: "2024-02-14"
  },
  {
    id: "RPT-003",
    patientName: "محمد علي القحطاني",
    patientId: "PAT-003",
    type: "علاج اللثة",
    diagnosis: "التهاب مزمن في اللثة",
    treatment: "تنظيف عميق وعلاج اللثة",
    doctor: "د. نورا سالم",
    date: "2024-01-10",
    status: "يحتاج متابعة",
    recommendations: "استخدام غسول طبي، تنظيف دوري كل 3 أشهر",
    nextVisit: "2024-04-10"
  }
];

const analyticsData = [
  { label: "كشوفات هذا الشهر", value: "45", change: "+12%", trend: "up" },
  { label: "التشخيصات الجديدة", value: "23", change: "+8%", trend: "up" },
  { label: "العلاجات المكتملة", value: "38", change: "+15%", trend: "up" },
  { label: "المتابعات المطلوبة", value: "12", change: "-5%", trend: "down" }
];

const commonDiagnoses = [
  { diagnosis: "تسوس الأسنان", count: 15, percentage: 35 },
  { diagnosis: "التهاب اللثة", count: 12, percentage: 28 },
  { diagnosis: "عدم انتظام الأسنان", count: 8, percentage: 19 },
  { diagnosis: "حساسية الأسنان", count: 5, percentage: 12 },
  { diagnosis: "أخرى", count: 3, percentage: 6 }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "مكتمل":
      return <Badge className="bg-green-100 text-green-800">مكتمل</Badge>;
    case "جاري العلاج":
      return <Badge className="bg-blue-100 text-blue-800">جاري العلاج</Badge>;
    case "يحتاج متابعة":
      return <Badge className="bg-yellow-100 text-yellow-800">يحتاج متابعة</Badge>;
    case "ملغي":
      return <Badge className="bg-red-100 text-red-800">ملغي</Badge>;
    default:
      return <Badge variant="secondary">غير محدد</Badge>;
  }
};

export default function Reports() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [isViewReportDialogOpen, setIsViewReportDialogOpen] = useState(false);
  const [isNewReportDialogOpen, setIsNewReportDialogOpen] = useState(false);

  const filteredReports = medicalReports.filter(report => {
    const matchesSearch = report.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || report.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleViewReport = (report: any) => {
    setSelectedReport(report);
    setIsViewReportDialogOpen(true);
  };

  const exportMedicalReports = () => {
    try {
      const dataToExport = filteredReports.map(report => ({
        'رقم التقرير': report.id,
        'اسم المريض': report.patientName,
        'نوع الكشف': report.type,
        'التشخيص': report.diagnosis,
        'العلاج': report.treatment,
        'الطبيب': report.doctor,
        'التاريخ': new Date(report.date).toLocaleDateString('ar-SA'),
        'الحالة': report.status,
        'التوصيات': report.recommendations,
        'الزيارة القادمة': report.nextVisit ? new Date(report.nextVisit).toLocaleDateString('ar-SA') : ''
      }));

      const headers = Object.keys(dataToExport[0] || {});
      const csvContent = [
        '\ufeff', // BOM for Arabic
        headers.join(','),
        ...dataToExport.map(row =>
          headers.map(header => `"${row[header] || ''}"`).join(',')
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `medical_reports_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert(`تم تصدير ${dataToExport.length} تقرير طبي بنجاح!`);
    } catch (error) {
      console.error('Error exporting medical reports:', error);
      alert('حدث خطأ أثناء تصدير التقارير الطبية');
    }
  };

  const exportFinancialReport = () => {
    try {
      const financialData = [
        { name: "تقويم الأسنان", revenue: 85000, percentage: 35 },
        { name: "زراعة الأسنان", revenue: 72000, percentage: 30 },
        { name: "تبييض الأسنان", revenue: 48000, percentage: 20 },
        { name: "حشوات الأس��ان", revenue: 24000, percentage: 10 },
        { name: "علاج اللثة", revenue: 12000, percentage: 5 }
      ];

      const dataToExport = financialData.map(item => ({
        'نوع العلاج': item.name,
        'الإيرادات': item.revenue,
        'النسبة المئوية': `${item.percentage}%`
      }));

      const headers = Object.keys(dataToExport[0] || {});
      const csvContent = [
        '\ufeff',
        headers.join(','),
        ...dataToExport.map(row =>
          headers.map(header => `"${row[header] || ''}"`).join(',')
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `financial_report_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert('تم تصدير التقرير المالي بنجاح!');
    } catch (error) {
      console.error('Error exporting financial report:', error);
      alert('حدث خطأ أثناء تصدير التقرير المالي');
    }
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-arabic">الكشوفات والتقارير</h1>
            <p className="text-gray-600 font-arabic">إدارة شاملة للكشوفات الطبية والتقارير التفصيلية</p>
          </div>
          <Button onClick={() => setIsNewReportDialogOpen(true)} className="font-arabic">
            <Plus className="h-4 w-4 mr-2" />
            إنشاء كشف جديد
          </Button>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {analyticsData.map((item, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium font-arabic">{item.label}</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{item.value}</div>
                <p className={`text-xs font-arabic ${item.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  <TrendingUp className={`h-4 w-4 inline mr-1 ${item.trend === 'down' ? 'rotate-180' : ''}`} />
                  {item.change} من الشهر الماضي
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="medical" className="space-y-6">
          <TabsList className="font-arabic">
            <TabsTrigger value="medical">الكشوفات الطبية</TabsTrigger>
            <TabsTrigger value="analytics">التحليلات</TabsTrigger>
            <TabsTrigger value="financial">التقارير المالية</TabsTrigger>
            <TabsTrigger value="export">التصدير</TabsTrigger>
          </TabsList>

          <TabsContent value="medical" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="font-arabic">البحث والتصفية</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Label htmlFor="search" className="font-arabic">البحث</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="search"
                        placeholder="ابحث باسم المريض أو رقم التقرير..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 font-arabic"
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-48">
                    <Label className="font-arabic">نوع الكشف</Label>
                    <Select value={selectedType} onValueChange={setSelectedType} className="font-arabic">
                      <SelectItem value="all">جميع الأنواع</SelectItem>
                      <SelectItem value="كشف دوري">كشف دوري</SelectItem>
                      <SelectItem value="استشارة تقويم">استشارة تقويم</SelectItem>
                      <SelectItem value="علاج اللثة">علاج اللثة</SelectItem>
                      <SelectItem value="زراعة الأسنان">زراعة الأسنان</SelectItem>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="font-arabic">
                      <Filter className="h-4 w-4 mr-2" />
                      تصفية متقدم��
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reports Table */}
            <Card>
              <CardHeader>
                <CardTitle className="font-arabic">الكشوفات الطبية</CardTitle>
                <CardDescription className="font-arabic">
                  قائمة بجميع الكشوف��ت والتقارير الطبية
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-arabic">رقم التقرير</TableHead>
                      <TableHead className="font-arabic">اسم المريض</TableHead>
                      <TableHead className="font-arabic">نوع الكشف</TableHead>
                      <TableHead className="font-arabic">التشخيص</TableHead>
                      <TableHead className="font-arabic">الطبيب</TableHead>
                      <TableHead className="font-arabic">التاريخ</TableHead>
                      <TableHead className="font-arabic">الحالة</TableHead>
                      <TableHead className="font-arabic">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.id}</TableCell>
                        <TableCell className="font-arabic">{report.patientName}</TableCell>
                        <TableCell className="font-arabic">{report.type}</TableCell>
                        <TableCell className="font-arabic">{report.diagnosis}</TableCell>
                        <TableCell className="font-arabic">{report.doctor}</TableCell>
                        <TableCell>{new Date(report.date).toLocaleDateString('ar-SA')}</TableCell>
                        <TableCell>{getStatusBadge(report.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleViewReport(report)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Printer className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Common Diagnoses Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-arabic">التشخيصات الشائعة</CardTitle>
                  <CardDescription className="font-arabic">
                    أكثر التشخيصات تكراراً هذا الشهر
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {commonDiagnoses.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          <span className="font-arabic text-sm">{item.diagnosis}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{item.count}</span>
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-500">{item.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Trends */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-arabic">الاتجاهات الشهرية</CardTitle>
                  <CardDescription className="font-arabic">
                    إحصائيات الكشوفات والعلاجات
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-3">
                      {[
                        { name: "تسوس الأسنان", count: 45, percentage: 35 },
                        { name: "التهاب اللثة", count: 32, percentage: 25 },
                        { name: "تقويم الأس��ان", count: 28, percentage: 22 },
                        { name: "زراعة الأسنان", count: 15, percentage: 12 },
                        { name: "تبييض الأسنان", count: 8, percentage: 6 }
                      ].map((item, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-arabic">{item.name}</span>
                            <span>{item.count} حالة ({item.percentage}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="pt-4 border-t">
                      <div className="text-center">
                        <p className="text-sm text-gray-600 font-arabic">إجمالي الحالات: 128 حالة</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="financial" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-arabic">التقارير المالية</CardTitle>
                <CardDescription className="font-arabic">
                  تقارير مفصلة عن الإيرادات المرتبطة بالعلاجات
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Revenue by Treatment Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-arabic flex items-center gap-2">
                        <PieChart className="h-5 w-5" />
                        الإيرادات حسب نوع العلاج
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { name: "تقويم الأسنان", revenue: 85000, percentage: 35, color: "bg-blue-500" },
                          { name: "زراعة الأسنان", revenue: 72000, percentage: 30, color: "bg-green-500" },
                          { name: "تبييض الأسنان", revenue: 48000, percentage: 20, color: "bg-yellow-500" },
                          { name: "حشوات الأسنان", revenue: 24000, percentage: 10, color: "bg-purple-500" },
                          { name: "علاج اللثة", revenue: 12000, percentage: 5, color: "bg-red-500" }
                        ].map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-4 h-4 rounded ${item.color}`}></div>
                              <span className="font-arabic text-sm">{item.name}</span>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">{item.revenue.toLocaleString()} ر.ي</div>
                              <div className="text-sm text-gray-500">{item.percentage}%</div>
                            </div>
                          </div>
                        ))}
                        <div className="pt-4 border-t">
                          <div className="flex justify-between font-bold">
                            <span className="font-arabic">الإجمالي</span>
                            <span>241,000 ر.ي</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Monthly Revenue Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-arabic flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        الإيرادات الشهرية
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { month: "يناير", revenue: 45000, growth: 12 },
                          { month: "فبراير", revenue: 52000, growth: 15 },
                          { month: "مارس", revenue: 48000, growth: -8 },
                          { month: "أبريل", revenue: 58000, growth: 20 },
                          { month: "مايو", revenue: 62000, growth: 7 },
                          { month: "يونيو", revenue: 55000, growth: -11 }
                        ].map((item, index) => {
                          const maxRevenue = 62000;
                          const width = (item.revenue / maxRevenue) * 100;
                          return (
                            <div key={index} className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span className="font-arabic">{item.month}</span>
                                <div className="flex items-center gap-2">
                                  <span>{item.revenue.toLocaleString()} ر.ي</span>
                                  <span className={`text-xs ${item.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {item.growth > 0 ? '+' : ''}{item.growth}%
                                  </span>
                                </div>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${width}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Financial Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">82%</div>
                        <div className="text-sm text-gray-600 font-arabic">معدل التحصيل</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">156</div>
                        <div className="text-sm text-gray-600 font-arabic">عدد المعاملات</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">1,547</div>
                        <div className="text-sm text-gray-600 font-arabic">متوسط قيمة المعاملة</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">15%</div>
                        <div className="text-sm text-gray-600 font-arabic">نمو هذا الشهر</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="export" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-arabic">تصدير التقارير</CardTitle>
                <CardDescription className="font-arabic">
                  تصدير البيانات بص��غ مختلفة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-bold font-arabic">تصدير البيانات الطبية</h3>
                    <div className="space-y-2">
                      <Button className="w-full font-arabic" variant="outline" onClick={printReport}>
                        <Printer className="h-4 w-4 mr-2" />
                        طباعة التقارير
                      </Button>
                      <Button className="w-full font-arabic" variant="outline" onClick={exportMedicalReports}>
                        <Download className="h-4 w-4 mr-2" />
                        تصدير الكشوفات (Excel)
                      </Button>
                      <Button className="w-full font-arabic" variant="outline" onClick={() => alert('سيتم إضافة هذه الميزة قريباً')}>
                        <Share className="h-4 w-4 mr-2" />
                        مشاركة التقرير الشهري
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-bold font-arabic">تصدير التقارير ا��مالية</h3>
                    <div className="space-y-2">
                      <Button className="w-full font-arabic" variant="outline" onClick={exportFinancialReport}>
                        <Download className="h-4 w-4 mr-2" />
                        تقرير الإيرادات (Excel)
                      </Button>
                      <Button className="w-full font-arabic" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        تق��ير المصروفات (Excel)
                      </Button>
                      <Button className="w-full font-arabic" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        تقرير الأرباح والخسائر
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* View Report Dialog */}
        <Dialog open={isViewReportDialogOpen} onOpenChange={setIsViewReportDialogOpen}>
          <DialogContent className="sm:max-w-[700px]" dir="rtl">
            <DialogHeader>
              <DialogTitle className="font-arabic">تفاصيل الكشف الطبي</DialogTitle>
              <DialogDescription className="font-arabic">
                عرض تفصيلي للكشف والتوصيات
              </DialogDescription>
            </DialogHeader>
            {selectedReport && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-arabic font-bold">رقم التقرير:</Label>
                    <p>{selectedReport.id}</p>
                  </div>
                  <div>
                    <Label className="font-arabic font-bold">اسم المريض:</Label>
                    <p className="font-arabic">{selectedReport.patientName}</p>
                  </div>
                  <div>
                    <Label className="font-arabic font-bold">نوع الكشف:</Label>
                    <p className="font-arabic">{selectedReport.type}</p>
                  </div>
                  <div>
                    <Label className="font-arabic font-bold">الطبيب المعالج:</Label>
                    <p className="font-arabic">{selectedReport.doctor}</p>
                  </div>
                </div>

                <div>
                  <Label className="font-arabic font-bold">التشخيص:</Label>
                  <p className="font-arabic mt-1">{selectedReport.diagnosis}</p>
                </div>

                <div>
                  <Label className="font-arabic font-bold">العلاج المقترح:</Label>
                  <p className="font-arabic mt-1">{selectedReport.treatment}</p>
                </div>

                <div>
                  <Label className="font-arabic font-bold">التوصيات:</Label>
                  <p className="font-arabic mt-1">{selectedReport.recommendations}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-arabic font-bold">تاريخ الكشف:</Label>
                    <p>{new Date(selectedReport.date).toLocaleDateString('ar-SA')}</p>
                  </div>
                  <div>
                    <Label className="font-arabic font-bold">الزيارة القادمة:</Label>
                    <p>{new Date(selectedReport.nextVisit).toLocaleDateString('ar-SA')}</p>
                  </div>
                </div>

                <div>
                  <Label className="font-arabic font-bold">حالة العلاج:</Label>
                  <div className="mt-1">{getStatusBadge(selectedReport.status)}</div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewReportDialogOpen(false)} className="font-arabic">
                إغلاق
              </Button>
              <Button className="font-arabic">
                <Download className="h-4 w-4 mr-2" />
                تحميل PDF
              </Button>
              <Button className="font-arabic">
                <Printer className="h-4 w-4 mr-2" />
                طباعة
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* New Report Dialog */}
        <Dialog open={isNewReportDialogOpen} onOpenChange={setIsNewReportDialogOpen}>
          <DialogContent className="sm:max-w-[600px]" dir="rtl">
            <DialogHeader>
              <DialogTitle className="font-arabic">إنشاء كشف طبي جديد</DialogTitle>
              <DialogDescription className="font-arabic">
                إنشاء كشف وتقرير طبي شامل للمريض
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-arabic">اسم المريض</Label>
                  <Select placeholder="اختر المريض" className="font-arabic">
                    <SelectItem value="pat1">أحمد محمد السعد</SelectItem>
                    <SelectItem value="pat2">فاطمة أحمد العلي</SelectItem>
                    <SelectItem value="pat3">محمد علي القحطاني</SelectItem>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="font-arabic">نوع الكشف</Label>
                  <Select placeholder="اختر نوع الكشف" className="font-arabic">
                    <SelectItem value="routine">كشف دوري</SelectItem>
                    <SelectItem value="orthodontic">استشارة تقويم</SelectItem>
                    <SelectItem value="gum">علاج اللثة</SelectItem>
                    <SelectItem value="implant">زراعة الأسنان</SelectItem>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="font-arabic">التشخيص</Label>
                <Textarea placeholder="وصف مفصل للحا��ة والتشخيص..." className="font-arabic" />
              </div>
              <div className="space-y-2">
                <Label className="font-arabic">العلاج المقترح</Label>
                <Textarea placeholder="خطة العلاج والإجراءات المطلوبة..." className="font-arabic" />
              </div>
              <div className="space-y-2">
                <Label className="font-arabic">التوصيات</Label>
                <Textarea placeholder="التوصيات والإرشادات للمريض..." className="font-arabic" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-arabic">تاريخ الزيارة القادمة</Label>
                  <Input type="date" className="font-arabic" />
                </div>
                <div className="space-y-2">
                  <Label className="font-arabic">الطبيب المعالج</Label>
                  <Select placeholder="اختر الطبيب" className="font-arabic">
                    <SelectItem value="doc1">د. سارة أحمد</SelectItem>
                    <SelectItem value="doc2">د. محمد علي</SelectItem>
                    <SelectItem value="doc3">د. نورا سالم</SelectItem>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewReportDialogOpen(false)} className="font-arabic">
                إلغاء
              </Button>
              <Button className="font-arabic">حفظ الكشف</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
