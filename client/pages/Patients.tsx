import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Users,
  Search,
  Plus,
  Eye,
  Edit,
  Phone,
  Mail,
  Calendar,
  FileText,
  Activity,
  AlertCircle,
  User,
  MapPin,
  Clock,
  Loader2,
  DollarSign,
  CreditCard,
  Heart,
  Stethoscope,
  CalendarCheck,
  UserCheck,
  Receipt,
  History,
  FileBarChart,
  Pill,
  ClipboardList,
  TrendingUp,
  CalendarClock
} from "lucide-react";

interface Patient {
  id: number;
  patient_number: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  insurance_company: string;
  medical_history: string;
  allergies: string;
  blood_type: string;
  gender: string;
  role: string;
  created_at: string;
  updated_at: string;
  status: string; // Added for UI compatibility
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge className="bg-green-100 text-green-800">نشط</Badge>;
    case "inactive":
      return <Badge className="bg-gray-100 text-gray-800">غير نشط</Badge>;
    case "pending":
      return <Badge className="bg-yellow-100 text-yellow-800">في الانتظار</Badge>;
    default:
      return <Badge variant="secondary">غير محدد</Badge>;
  }
};

export default function Patients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isAddPatientDialogOpen, setIsAddPatientDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [isViewPatientDialogOpen, setIsViewPatientDialogOpen] = useState(false);

  // Fetch patients data from database
  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/patients');
      const data = await response.json();

      if (data.success && data.data) {
        // Transform the data to match our interface
        const transformedPatients = data.data.map((patient: any) => ({
          ...patient,
          status: 'active' // Default status since it's not in DB
        }));
        setPatients(transformedPatients);
      } else {
        setPatients([]);
      }
    } catch (error) {
      console.error('خطأ في جلب بيانات المرضى:', error);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter patients
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.patient_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.phone?.includes(searchTerm);
    const matchesStatus = selectedStatus === "all" || patient.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleViewPatient = (patient: any) => {
    setSelectedPatient(patient);
    setIsViewPatientDialogOpen(true);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-arabic">ملفات المرضى</h1>
            <p className="text-gray-600 font-arabic">إدارة شاملة لبيانات وملفات المرضى</p>
          </div>
          <Button onClick={() => setIsAddPatientDialogOpen(true)} className="font-arabic">
            <Plus className="h-4 w-4 mr-2" />
            إضافة مريض جديد
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-arabic">إجمالي المرضى</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : patients.length}</div>
              <p className="text-xs text-muted-foreground font-arabic">
                +2 مرضى جدد هذا الأسبوع
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-arabic">المرضى النشطون</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {loading ? '...' : patients.filter(p => p.status === 'active').length}
              </div>
              <p className="text-xs text-muted-foreground font-arabic">
                من إجمالي المرضى
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-arabic">مواعيد اليوم</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground font-arabic">
                3 مواعيد متبقية
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-arabic">حالات طارئة</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">1</div>
              <p className="text-xs text-muted-foreground font-arabic">
                تحتاج متابعة فورية
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="patients" className="space-y-6">
          <TabsList className="font-arabic">
            <TabsTrigger value="patients">قائمة المرضى</TabsTrigger>
            <TabsTrigger value="appointments">المواعيد</TabsTrigger>
            <TabsTrigger value="medical">السجلات الطبية</TabsTrigger>
          </TabsList>

          <TabsContent value="patients" className="space-y-6">
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
                        placeholder="ابحث باسم المريض أو رقم الهوية أو رقم الهاتف..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 font-arabic"
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-48">
                    <Label className="font-arabic">حالة المريض</Label>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="font-arabic">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all" className="font-arabic">جميع المرضى</SelectItem>
                        <SelectItem value="active" className="font-arabic">نشط</SelectItem>
                        <SelectItem value="inactive" className="font-arabic">غير نشط</SelectItem>
                        <SelectItem value="pending" className="font-arabic">في الانتظار</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Patients Table */}
            <Card>
              <CardHeader>
                <CardTitle className="font-arabic">قائمة المرضى</CardTitle>
                <CardDescription className="font-arabic">
                  إدارة بيانات المرضى والملفات الطبية
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="text-gray-600 font-arabic">جاري تحميل بيانات المرضى...</div>
                  </div>
                ) : filteredPatients.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 font-arabic">لا توجد بيانات مرضى</p>
                    <p className="text-sm text-gray-500 font-arabic mt-1">تم حذف جميع بيانات المرضى من النظام</p>
                  </div>
                ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-arabic">المريض</TableHead>
                      <TableHead className="font-arabic">العمر/الجنس</TableHead>
                      <TableHead className="font-arabic">اله��تف</TableHead>
                      <TableHead className="font-arabic">التأمين</TableHead>
                      <TableHead className="font-arabic">آخر زيارة</TableHead>
                      <TableHead className="font-arabic">الموعد القادم</TableHead>
                      <TableHead className="font-arabic">الحالة</TableHead>
                      <TableHead className="font-arabic">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPatients.map((patient) => (
                      <TableRow key={patient.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>{getInitials(patient.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium font-arabic">{patient.name}</div>
                              <div className="text-sm text-gray-500">{patient.patient_number || `ID: ${patient.id}`}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-arabic">غير محدد / {patient.gender === 'male' ? 'ذكر' : patient.gender === 'female' ? 'أنثى' : patient.gender}</TableCell>
                        <TableCell>{patient.phone}</TableCell>
                        <TableCell className="font-arabic">{patient.insurance_company || 'غير محدد'}</TableCell>
                        <TableCell>{patient.created_at ? new Date(patient.created_at).toLocaleDateString('ar-SA') : 'غير محدد'}</TableCell>
                        <TableCell>
                          <span className="text-gray-500 font-arabic">لا يوجد</span>
                        </TableCell>
                        <TableCell>{getStatusBadge(patient.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleViewPatient(patient)}
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
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-arabic">إدارة المواعيد</CardTitle>
                <CardDescription className="font-arabic">
                  جدولة ومتابعة مواعيد المرضى
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 font-arabic">سي��م إضافة إدارة المواعيد قريباً</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medical" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-arabic">السجلات الطبية</CardTitle>
                <CardDescription className="font-arabic">
                  إدارة السجلات والتاريخ الطبي للمرضى
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 font-arabic">سيتم إضاف�� السجلات الطبية قريباً</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add Patient Dialog */}
        <Dialog open={isAddPatientDialogOpen} onOpenChange={setIsAddPatientDialogOpen}>
          <DialogContent className="sm:max-w-[600px]" dir="rtl">
            <DialogHeader>
              <DialogTitle className="font-arabic">إضافة مريض جديد</DialogTitle>
              <DialogDescription className="font-arabic">
                أدخل بيانات المريض الأساسية
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-arabic">الاسم الكامل</Label>
                <Input placeholder="أدخل الاسم الكامل" className="font-arabic" />
              </div>
              <div className="space-y-2">
                <Label className="font-arabic">العمر</Label>
                <Input type="number" placeholder="العمر" className="font-arabic" />
              </div>
              <div className="space-y-2">
                <Label className="font-arabic">الجنس</Label>
                <Select>
                  <SelectTrigger className="font-arabic">
                    <SelectValue placeholder="اختر الجنس" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male" className="font-arabic">ذكر</SelectItem>
                    <SelectItem value="female" className="font-arabic">أنثى</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-arabic">رقم الهاتف</Label>
                <Input placeholder="+967 77x xxx xxx" className="font-arabic" />
              </div>
              <div className="space-y-2">
                <Label className="font-arabic">البريد الإلكتروني</Label>
                <Input type="email" placeholder="email@example.com" className="font-arabic" />
              </div>
              <div className="space-y-2">
                <Label className="font-arabic">التأمي�� الطبي</Label>
                <Input placeholder="شركة التأمين" className="font-arabic" />
              </div>
              <div className="col-span-2 space-y-2">
                <Label className="font-arabic">ا��عنوان</Label>
                <Input placeholder="العنوان الكامل" className="font-arabic" />
              </div>
              <div className="col-span-2 space-y-2">
                <Label className="font-arabic">التاريخ الطبي</Label>
                <Textarea placeholder="أي مشاكل صحية أو حساسيات..." className="font-arabic" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddPatientDialogOpen(false)} className="font-arabic">
                إلغاء
              </Button>
              <Button className="font-arabic">إضافة المريض</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Patient Dialog */}
        <Dialog open={isViewPatientDialogOpen} onOpenChange={setIsViewPatientDialogOpen}>
          <DialogContent className="sm:max-w-[700px]" dir="rtl">
            <DialogHeader>
              <DialogTitle className="font-arabic">ملف المريض</DialogTitle>
              <DialogDescription className="font-arabic">
                تفاصيل شاملة عن المريض
              </DialogDescription>
            </DialogHeader>
            {selectedPatient && (
              <div className="space-y-6">
                {/* Patient Info */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="text-lg">{getInitials(selectedPatient.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-bold font-arabic">{selectedPatient.name}</h3>
                    <p className="text-gray-600 font-arabic">{selectedPatient.patient_number || `ID: ${selectedPatient.id}`}</p>
                    <div className="flex gap-2 mt-2">
                      {getStatusBadge(selectedPatient.status)}
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-arabic text-sm">
                        الجنس: {selectedPatient.gender === 'male' ? 'ذكر' : selectedPatient.gender === 'female' ? 'أنثى' : selectedPatient.gender}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{selectedPatient.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{selectedPatient.email}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="font-arabic text-sm">{selectedPatient.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="font-arabic text-sm">التأمين: {selectedPatient.insurance_company || 'غير محدد'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="font-arabic text-sm">
                        تاريخ التسجيل: {selectedPatient.created_at ? new Date(selectedPatient.created_at).toLocaleDateString('ar-SA') : 'غير محدد'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Medical History */}
                <div>
                  <h4 className="font-bold font-arabic mb-2">التاريخ الطبي:</h4>
                  <p className="text-sm font-arabic text-gray-600">
                    {selectedPatient.medical_history || 'لا توجد معلومات'}
                  </p>
                </div>

                {/* Allergies */}
                <div>
                  <h4 className="font-bold font-arabic mb-2">الحساسيات:</h4>
                  <p className="text-sm font-arabic text-gray-600">
                    {selectedPatient.allergies || 'لا توجد حساسيات معروفة'}
                  </p>
                </div>

                {/* Blood Type */}
                <div>
                  <h4 className="font-bold font-arabic mb-2">فصيلة الدم:</h4>
                  <Badge variant="outline" className="font-arabic">
                    {selectedPatient.blood_type || 'غير محدد'}
                  </Badge>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewPatientDialogOpen(false)} className="font-arabic">
                إغلاق
              </Button>
              <Button className="font-arabic">تعديل البيانات</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
