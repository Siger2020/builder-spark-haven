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
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  Calendar,
  Clock,
  Search, 
  Plus,
  Eye,
  Edit,
  CheckCircle,
  AlertCircle,
  PlayCircle,
  PauseCircle,
  TrendingUp,
  FileText,
  Timer,
  Target
} from "lucide-react";

// Mock data for treatment sessions
const treatmentSessions = [
  {
    id: "SES-001",
    patientName: "أحمد محمد السعد",
    patientId: "PAT-001",
    treatmentPlan: "تقويم الأسنان",
    sessionNumber: 3,
    totalSessions: 12,
    date: "2024-01-15",
    duration: 45,
    status: "مكتمل",
    doctor: "د. محمد علي",
    notes: "تم تعديل السلك وتقييم التقدم. النتائج ممتازة.",
    nextSession: "2024-02-15",
    progress: 25,
    procedures: ["فحص التقويم", "تعديل السلك", "تنظيف الأقواس"]
  },
  {
    id: "SES-002", 
    patientName: "فاطمة أحمد العلي",
    patientId: "PAT-002",
    treatmentPlan: "زراعة الأسنان",
    sessionNumber: 2,
    totalSessions: 4,
    date: "2024-01-14",
    duration: 90,
    status: "جاري العلاج",
    doctor: "د. سارة أحمد",
    notes: "تم وضع الغرسة بنجاح. يحتاج فترة شفاء 3 أشهر.",
    nextSession: "2024-04-14",
    progress: 50,
    procedures: ["وضع الغرسة", "خياطة الجرح", "وصف مضادات حيوية"]
  },
  {
    id: "SES-003",
    patientName: "محمد علي ال��حطاني", 
    patientId: "PAT-003",
    treatmentPlan: "علاج اللثة",
    sessionNumber: 4,
    totalSessions: 6,
    date: "2024-01-13",
    duration: 60,
    status: "مجدول",
    doctor: "د. نورا سالم",
    notes: "جلسة تنظيف عميق للجيوب اللثوية.",
    nextSession: "2024-01-27",
    progress: 67,
    procedures: ["تنظيف الجيوب", "إزالة الجير", "تطبيق جل مضاد للالتهاب"]
  },
  {
    id: "SES-004",
    patientName: "نورا سالم الحربي",
    patientId: "PAT-004", 
    treatmentPlan: "تبييض الأسنان",
    sessionNumber: 1,
    totalSessions: 3,
    date: "2024-01-12",
    duration: 60,
    status: "مكتمل",
    doctor: "د. أحمد محمد",
    notes: "الجلسة الأولى لتبييض الأسنان. النتائج واعدة.",
    nextSession: "2024-01-26",
    progress: 33,
    procedures: ["تطبيق جل التبييض", "تفعيل بالضوء", "قياس درجة البياض"]
  },
  {
    id: "SES-005",
    patientName: "سارة خالد ال��طيري",
    patientId: "PAT-005",
    treatmentPlan: "حشوات تجميلية",
    sessionNumber: 2,
    totalSessions: 2,
    date: "2024-01-11",
    duration: 30,
    status: "مؤجل",
    doctor: "د. فاطمة علي",
    notes: "تم تأجيل الجلسة بناء على طلب المريضة.",
    nextSession: "2024-01-25",
    progress: 100,
    procedures: ["حشوة نهائية", "تسوية السطح", "فحص الإطباق"]
  }
];

const treatmentPlans = [
  {
    id: "PLAN-001",
    name: "تقويم الأسنان الشامل",
    duration: "18-24 شهر",
    sessions: 12,
    description: "خطة علاج شاملة لتصحيح ترتيب الأسنان",
    phases: [
      { name: "التحضير", duration: "2 أسابيع", sessions: 2 },
      { name: "التقويم النشط", duration: "18 شهر", sessions: 18 },
      { name: "التثبيت", duration: "6 أشهر", sessions: 6 }
    ]
  },
  {
    id: "PLAN-002", 
    name: "زراعة الأسنان",
    duration: "6-9 أشهر",
    sessions: 4,
    description: "زراعة وتركيب الأسنان المفقودة",
    phases: [
      { name: "التخطيط", duration: "1 أسبوع", sessions: 1 },
      { name: "الزراعة", duration: "1 يوم", sessions: 1 },
      { name: "الشفاء", duration: "3-6 أشهر", sessions: 0 },
      { name: "التركيب", duration: "2 أسابيع", sessions: 2 }
    ]
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "مكتمل":
      return <Badge className="bg-green-100 text-green-800">مكتمل</Badge>;
    case "جاري العلاج":
      return <Badge className="bg-blue-100 text-blue-800">جاري العلاج</Badge>;
    case "مجدول":
      return <Badge className="bg-yellow-100 text-yellow-800">مجدول</Badge>;
    case "مؤجل":
      return <Badge className="bg-gray-100 text-gray-800">مؤجل</Badge>;
    case "ملغي":
      return <Badge className="bg-red-100 text-red-800">ملغي</Badge>;
    default:
      return <Badge variant="secondary">غير محدد</Badge>;
  }
};

export default function Sessions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [isViewSessionDialogOpen, setIsViewSessionDialogOpen] = useState(false);
  const [isNewSessionDialogOpen, setIsNewSessionDialogOpen] = useState(false);
  const [sessionForm, setSessionForm] = useState({
    patientId: '',
    treatmentPlan: '',
    sessionDate: '',
    sessionTime: '',
    duration: '',
    notes: '',
    doctor: 'د. محمد علي'
  });
  const [isLoading, setIsLoading] = useState(false);

  // Calculate statistics
  const completedSessions = treatmentSessions.filter(s => s.status === "مكتمل").length;
  const activeSessions = treatmentSessions.filter(s => s.status === "جاري العلاج" || s.status === "مجدول").length;
  const totalProgress = treatmentSessions.reduce((sum, s) => sum + s.progress, 0) / treatmentSessions.length;

  const filteredSessions = treatmentSessions.filter(session => {
    const matchesSearch = session.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.treatmentPlan.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || session.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleViewSession = (session: any) => {
    setSelectedSession(session);
    setIsViewSessionDialogOpen(true);
  };

  const handleNewSession = () => {
    setSessionForm({
      patientId: '',
      treatmentPlan: '',
      sessionDate: '',
      sessionTime: '',
      duration: '',
      notes: '',
      doctor: 'د. محمد علي'
    });
    setIsNewSessionDialogOpen(true);
  };

  const handleSaveSession = async () => {
    if (!sessionForm.patientId || !sessionForm.treatmentPlan || !sessionForm.sessionDate) {
      alert('يرجى ملء الحقول المطلوبة');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In a real app, you would post to API here
      const newSession = {
        id: `SES-${Date.now()}`,
        patientName: sessionForm.patientId === 'pat1' ? 'أحمد محمد السعد' :
                    sessionForm.patientId === 'pat2' ? 'فاطمة أحمد العلي' : 'محمد علي القحطاني',
        patientId: sessionForm.patientId,
        treatmentPlan: sessionForm.treatmentPlan,
        sessionNumber: 1,
        totalSessions: 12,
        date: sessionForm.sessionDate,
        duration: parseInt(sessionForm.duration) || 60,
        status: "مجدول",
        doctor: sessionForm.doctor,
        notes: sessionForm.notes,
        nextSession: sessionForm.sessionDate,
        progress: 0,
        procedures: ["جلسة استشارية", "فحص أولي"]
      };

      // In real app, this would trigger a re-fetch from the API
      alert('تم حفظ الجلسة بنجاح!');
      setIsNewSessionDialogOpen(false);

    } catch (error) {
      console.error('Error saving session:', error);
      alert('حدث خطأ أثناء حفظ الجلسة');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-arabic">جلسات العلاج</h1>
            <p className="text-gray-600 font-arabic">إدارة شاملة لجلسات العلاج المتعددة ومتابعة تطور المرضى</p>
          </div>
          <Button onClick={handleNewSession} className="font-arabic">
            <Plus className="h-4 w-4 mr-2" />
            جدولة جلسة جديدة
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-arabic">إجمالي الجلسات</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{treatmentSessions.length}</div>
              <p className="text-xs text-muted-foreground font-arabic">
                هذا الشهر
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-arabic">الجلسات المكتملة</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{completedSessions}</div>
              <p className="text-xs text-muted-foreground font-arabic">
                من إجمالي {treatmentSessions.length} جلسة
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-arabic">الجلسات النشطة</CardTitle>
              <PlayCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{activeSessions}</div>
              <p className="text-xs text-muted-foreground font-arabic">
                تحتاج متابعة
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-arabic">متوسط التقدم</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(totalProgress)}%</div>
              <Progress value={totalProgress} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="sessions" className="space-y-6">
          <TabsList className="font-arabic">
            <TabsTrigger value="sessions">الجلسات</TabsTrigger>
            <TabsTrigger value="plans">خطط العلاج</TabsTrigger>
            <TabsTrigger value="calendar">التقويم</TabsTrigger>
            <TabsTrigger value="analytics">التحليلات</TabsTrigger>
          </TabsList>

          <TabsContent value="sessions" className="space-y-6">
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
                        placeholder="ابحث باسم المريض أو نوع العلاج..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 font-arabic"
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-48">
                    <Label className="font-arabic">حالة الجلسة</Label>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="font-arabic">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all" className="font-arabic">جميع الحالات</SelectItem>
                        <SelectItem value="مكتمل" className="font-arabic">مكتمل</SelectItem>
                        <SelectItem value="جاري العلاج" className="font-arabic">جاري العلاج</SelectItem>
                        <SelectItem value="مجدول" className="font-arabic">مجدول</SelectItem>
                        <SelectItem value="مؤجل" className="font-arabic">مؤجل</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sessions Table */}
            <Card>
              <CardHeader>
                <CardTitle className="font-arabic">قائمة الجلسات</CardTitle>
                <CardDescription className="font-arabic">
                  إدارة ومتابعة جميع جلسات العلاج
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-arabic">رقم الجلسة</TableHead>
                      <TableHead className="font-arabic">اسم المريض</TableHead>
                      <TableHead className="font-arabic">خطة العلاج</TableHead>
                      <TableHead className="font-arabic">التقدم</TableHead>
                      <TableHead className="font-arabic">المدة</TableHead>
                      <TableHead className="font-arabic">التاريخ</TableHead>
                      <TableHead className="font-arabic">الحالة</TableHead>
                      <TableHead className="font-arabic">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSessions.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell className="font-medium">{session.id}</TableCell>
                        <TableCell className="font-arabic">{session.patientName}</TableCell>
                        <TableCell className="font-arabic">{session.treatmentPlan}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={session.progress} className="w-16" />
                            <span className="text-sm">{session.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{session.duration} دقيقة</TableCell>
                        <TableCell>{new Date(session.date).toLocaleDateString('ar-SA')}</TableCell>
                        <TableCell>{getStatusBadge(session.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleViewSession(session)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
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

          <TabsContent value="plans" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-arabic">خطط العلاج</CardTitle>
                <CardDescription className="font-arabic">
                  خطط العلاج المختلفة والمراحل المرتبطة بها
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {treatmentPlans.map((plan) => (
                    <Card key={plan.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="font-arabic">{plan.name}</CardTitle>
                            <CardDescription className="font-arabic">
                              {plan.description}
                            </CardDescription>
                          </div>
                          <div className="text-left">
                            <div className="text-sm text-gray-500 font-arabic">المدة: {plan.duration}</div>
                            <div className="text-sm text-gray-500 font-arabic">الجلسات: {plan.sessions}</div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <h4 className="font-bold font-arabic">مراحل العلاج:</h4>
                          {plan.phases.map((phase, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                                  {index + 1}
                                </div>
                                <div>
                                  <div className="font-medium font-arabic">{phase.name}</div>
                                  <div className="text-sm text-gray-500 font-arabic">المدة: {phase.duration}</div>
                                </div>
                              </div>
                              <div className="text-sm text-gray-500 font-arabic">
                                {phase.sessions} جلسة
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-arabic">تقويم الجلسات</CardTitle>
                <CardDescription className="font-arabic">
                  عرض جميع الجلسات المجدولة في التقويم
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {/* Calendar Header */}
                  {['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'ا��سبت'].map(day => (
                    <div key={day} className="text-center font-medium text-sm text-gray-600 p-2 font-arabic">
                      {day}
                    </div>
                  ))}

                  {/* Calendar Days */}
                  {Array.from({ length: 35 }, (_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() - date.getDay() + i);
                    const dayNumber = date.getDate();
                    const isToday = date.toDateString() === new Date().toDateString();
                    const hasSession = treatmentSessions.some(session =>
                      new Date(session.date).toDateString() === date.toDateString()
                    );

                    return (
                      <div
                        key={i}
                        className={`
                          p-2 text-center text-sm border rounded cursor-pointer transition-colors
                          ${isToday ? 'bg-blue-100 border-blue-300 text-blue-800' : 'hover:bg-gray-50'}
                          ${hasSession ? 'bg-green-100 border-green-300' : ''}
                        `}
                      >
                        <div className="font-medium">{dayNumber}</div>
                        {hasSession && (
                          <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mt-1"></div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Upcoming Sessions */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 font-arabic">الجلسات القادمة</h4>
                  {treatmentSessions
                    .filter(session => new Date(session.nextSession) > new Date())
                    .slice(0, 3)
                    .map(session => (
                      <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium font-arabic">{session.patientName}</div>
                          <div className="text-sm text-gray-600 font-arabic">{session.treatmentPlan}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{new Date(session.nextSession).toLocaleDateString('ar-SA')}</div>
                          <div className="text-xs text-gray-500">جلسة #{session.sessionNumber + 1}</div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-arabic">معدل نجاح العلاجات</CardTitle>
                  <CardDescription className="font-arabic">
                    نسب نجاح العلاجات المختلفة
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-arabic">تقويم الأسنان</span>
                      <div className="flex items-center gap-2">
                        <Progress value={95} className="w-20" />
                        <span className="text-sm">95%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-arabic">زراعة الأسنان</span>
                      <div className="flex items-center gap-2">
                        <Progress value={98} className="w-20" />
                        <span className="text-sm">98%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-arabic">علاج اللثة</span>
                      <div className="flex items-center gap-2">
                        <Progress value={87} className="w-20" />
                        <span className="text-sm">87%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-arabic">تبييض الأسنان</span>
                      <div className="flex items-center gap-2">
                        <Progress value={92} className="w-20" />
                        <span className="text-sm">92%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-arabic">متوسط مدة العلاج</CardTitle>
                  <CardDescription className="font-arabic">
                    المدة المتوقعة لإكمال العلاجات
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-arabic">تقويم الأسنان</span>
                      <span className="text-sm font-arabic">18-24 شهر</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-arabic">زراعة الأسنان</span>
                      <span className="text-sm font-arabic">6-9 أشهر</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-arabic">علاج اللثة</span>
                      <span className="text-sm font-arabic">3-6 أشهر</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-arabic">تبييض الأسنان</span>
                      <span className="text-sm font-arabic">2-4 أسابيع</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* View Session Dialog */}
        <Dialog open={isViewSessionDialogOpen} onOpenChange={setIsViewSessionDialogOpen}>
          <DialogContent className="sm:max-w-[700px]" dir="rtl">
            <DialogHeader>
              <DialogTitle className="font-arabic">تفاصيل الجلسة</DialogTitle>
              <DialogDescription className="font-arabic">
                معلومات شاملة عن جلسة العلاج
              </DialogDescription>
            </DialogHeader>
            {selectedSession && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-arabic font-bold">رقم الجلسة:</Label>
                    <p>{selectedSession.id}</p>
                  </div>
                  <div>
                    <Label className="font-arabic font-bold">اسم المريض:</Label>
                    <p className="font-arabic">{selectedSession.patientName}</p>
                  </div>
                  <div>
                    <Label className="font-arabic font-bold">خطة العلاج:</Label>
                    <p className="font-arabic">{selectedSession.treatmentPlan}</p>
                  </div>
                  <div>
                    <Label className="font-arabic font-bold">الطبيب المعالج:</Label>
                    <p className="font-arabic">{selectedSession.doctor}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="font-arabic font-bold">رقم الجلسة:</Label>
                    <p className="font-arabic">{selectedSession.sessionNumber} من {selectedSession.totalSessions}</p>
                  </div>
                  <div>
                    <Label className="font-arabic font-bold">المدة:</Label>
                    <p>{selectedSession.duration} دقيقة</p>
                  </div>
                  <div>
                    <Label className="font-arabic font-bold">التقدم:</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress value={selectedSession.progress} className="flex-1" />
                      <span className="text-sm">{selectedSession.progress}%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="font-arabic font-bold">الإجراءات المنفذة:</Label>
                  <ul className="mt-2 space-y-1">
                    {selectedSession.procedures.map((procedure: string, index: number) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="font-arabic">{procedure}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <Label className="font-arabic font-bold">ملاحظات الطبيب:</Label>
                  <p className="font-arabic mt-1 p-3 bg-gray-50 rounded-lg">{selectedSession.notes}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-arabic font-bold">تاريخ الجلسة:</Label>
                    <p>{new Date(selectedSession.date).toLocaleDateString('ar-SA')}</p>
                  </div>
                  <div>
                    <Label className="font-arabic font-bold">الجلسة القادمة:</Label>
                    <p>{new Date(selectedSession.nextSession).toLocaleDateString('ar-SA')}</p>
                  </div>
                </div>

                <div>
                  <Label className="font-arabic font-bold">حالة الجلسة:</Label>
                  <div className="mt-1">{getStatusBadge(selectedSession.status)}</div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewSessionDialogOpen(false)} className="font-arabic">
                إغلاق
              </Button>
              <Button className="font-arabic">
                <Edit className="h-4 w-4 mr-2" />
                تعديل
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* New Session Dialog */}
        <Dialog open={isNewSessionDialogOpen} onOpenChange={setIsNewSessionDialogOpen}>
          <DialogContent className="sm:max-w-[600px]" dir="rtl">
            <DialogHeader>
              <DialogTitle className="font-arabic">جدولة جلسة جديدة</DialogTitle>
              <DialogDescription className="font-arabic">
                إضافة جلسة علاج جديدة للمريض
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-arabic">اسم المريض</Label>
                  <Select>
                    <SelectTrigger className="font-arabic">
                      <SelectValue placeholder="اختر المريض" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pat1" className="font-arabic">أحمد محمد السعد</SelectItem>
                      <SelectItem value="pat2" className="font-arabic">فاطمة أحمد العلي</SelectItem>
                      <SelectItem value="pat3" className="font-arabic">محمد علي القحطاني</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="font-arabic">خطة العلاج</Label>
                  <Select>
                    <SelectTrigger className="font-arabic">
                      <SelectValue placeholder="اختر نوع العلاج" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="orthodontic" className="font-arabic">تقويم الأسنان</SelectItem>
                      <SelectItem value="implant" className="font-arabic">زراعة الأسنان</SelectItem>
                      <SelectItem value="gum" className="font-arabic">علاج اللثة</SelectItem>
                      <SelectItem value="whitening" className="font-arabic">تبييض الأسنان</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-arabic">تاريخ الجلسة</Label>
                  <Input type="date" className="font-arabic" />
                </div>
                <div className="space-y-2">
                  <Label className="font-arabic">وقت الجلسة</Label>
                  <Input type="time" className="font-arabic" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-arabic">المدة المتوقعة</Label>
                  <Select>
                    <SelectTrigger className="font-arabic">
                      <SelectValue placeholder="اختر المدة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30" className="font-arabic">30 دقيقة</SelectItem>
                      <SelectItem value="45" className="font-arabic">45 دقيقة</SelectItem>
                      <SelectItem value="60" className="font-arabic">60 دقيقة</SelectItem>
                      <SelectItem value="90" className="font-arabic">90 دقيقة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="font-arabic">الطبيب المعالج</Label>
                  <Select>
                    <SelectTrigger className="font-arabic">
                      <SelectValue placeholder="اختر الطبيب" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="doc1" className="font-arabic">د. سارة أحمد</SelectItem>
                      <SelectItem value="doc2" className="font-arabic">د. محمد علي</SelectItem>
                      <SelectItem value="doc3" className="font-arabic">د. نورا سالم</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="font-arabic">ملاحظات</Label>
                <Textarea placeholder="ملاحظات حول الجلسة..." className="font-arabic" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewSessionDialogOpen(false)} className="font-arabic">
                إلغاء
              </Button>
              <Button className="font-arabic">جدولة الجلسة</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
