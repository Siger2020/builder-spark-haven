import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectItem } from "@/components/ui/native-select";
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
  X,
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

interface Appointment {
  id: number;
  patient_name: string;
  patient_id: number;
  date: string;
  time: string;
  doctor_name: string;
  service: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  notes?: string;
}

interface MedicalRecord {
  id: number;
  patient_id: number;
  date: string;
  diagnosis: string;
  treatment: string;
  prescription: string;
  doctor_name: string;
  notes?: string;
  visit_type: string;
}

interface Payment {
  id: number;
  patient_id: number;
  patient_name: string;
  amount: number;
  service: string;
  payment_method: 'cash' | 'card' | 'insurance';
  date: string;
  status: 'paid' | 'pending' | 'partial';
  invoice_number: string;
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
  const [isEditPatientDialogOpen, setIsEditPatientDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [isViewPatientDialogOpen, setIsViewPatientDialogOpen] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [activeTab, setActiveTab] = useState("patients");
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    gender: '',
    insurance_company: '',
    medical_history: '',
    allergies: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isAddMedicalRecordOpen, setIsAddMedicalRecordOpen] = useState(false);
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [selectedMedicalRecord, setSelectedMedicalRecord] = useState<any>(null);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);

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

  const handleEditPatient = (patient: any) => {
    setSelectedPatient(patient);
    setFormData({
      name: patient.name || '',
      phone: patient.phone || '',
      email: patient.email || '',
      address: patient.address || '',
      gender: patient.gender || '',
      insurance_company: patient.insurance_company || '',
      medical_history: patient.medical_history || '',
      allergies: patient.allergies || ''
    });
    setIsEditPatientDialogOpen(true);
  };

  const handleAddPatient = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      address: '',
      gender: '',
      insurance_company: '',
      medical_history: '',
      allergies: ''
    });
    setSelectedPatient(null);
    setIsAddPatientDialogOpen(true);
  };

  const handleDeletePatient = async (patientId: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا المريض؟ لا يمكن التراجع عن هذا الإجراء.')) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/database/tables/patients/${patientId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('تم حذف المريض بنجاح');
        fetchPatients(); // Refresh the list
      } else {
        alert('حدث خطأ أثناء حذف المريض');
      }
    } catch (error) {
      console.error('Error deleting patient:', error);
      alert('حدث خطأ أثناء حذف المريض');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePatient = async () => {
    if (!formData.name || !formData.phone) {
      alert('يرجى ملء الحقول المطلوبة على الأقل (الاسم والهاتف)');
      return;
    }

    try {
      setIsLoading(true);
      const isEdit = selectedPatient && selectedPatient.id;
      const url = isEdit
        ? `/api/database/tables/patients/${selectedPatient.id}`
        : '/api/database/tables/patients';

      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert(isEdit ? 'تم تحديث بيانات المريض بنج��ح' : 'تم إضافة المريض بنجاح');
        setIsAddPatientDialogOpen(false);
        setIsEditPatientDialogOpen(false);
        fetchPatients(); // Refresh the list
      } else {
        alert('حدث خطأ أثناء حفظ بيانات المريض');
      }
    } catch (error) {
      console.error('Error saving patient:', error);
      alert('حدث خطأ أثناء حفظ بيانات المريض');
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleViewMedicalRecord = (record: any) => {
    setSelectedMedicalRecord(record);
    alert(`عرض السجل الطبي للمريض: ${record.patient}\nالتشخيص: ${record.diagnosis}\nالعلاج: ${record.treatment}`);
  };

  const handleEditMedicalRecord = (record: any) => {
    setSelectedMedicalRecord(record);
    setIsAddMedicalRecordOpen(true);
  };

  const handleAddMedicalRecord = () => {
    setSelectedMedicalRecord(null);
    setIsAddMedicalRecordOpen(true);
  };

  const handleViewPayment = (payment: any) => {
    setSelectedPayment(payment);
    alert(`تفاصيل الدفعة:\nرقم الفاتورة: ${payment.invoice}\nالمريض: ${payment.patient}\nالمبلغ: ${payment.amount}\nالحالة: ${payment.status}`);
  };

  const handleEditPayment = (payment: any) => {
    setSelectedPayment(payment);
    setIsAddPaymentOpen(true);
  };

  const handleAddPayment = () => {
    setSelectedPayment(null);
    setIsAddPaymentOpen(true);
  };

  const handlePrintReceipt = (payment: any) => {
    alert(`طباعة إيصال الدفع:\nرقم الفاتورة: ${payment.invoice}\nالمبلغ: ${payment.amount}\nالمريض: ${payment.patient}`);
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
          <Button onClick={handleAddPatient} className="font-arabic">
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
            <TabsTrigger value="profile">الملف الشخصي</TabsTrigger>
            <TabsTrigger value="appointments">المواعيد</TabsTrigger>
            <TabsTrigger value="medical">السجل الطبي</TabsTrigger>
            <TabsTrigger value="payments">المدفوعات</TabsTrigger>
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
                    <Select
                      value={selectedStatus}
                      onValueChange={setSelectedStatus}
                      placeholder="اختر حالة المريض"
                      className="font-arabic"
                    >
                      <SelectItem value="all" className="font-arabic">جميع المرضى</SelectItem>
                      <SelectItem value="active" className="font-arabic">نشط</SelectItem>
                      <SelectItem value="inactive" className="font-arabic">غير نشط</SelectItem>
                      <SelectItem value="pending" className="font-arabic">في الانت��ار</SelectItem>
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
                              title="عرض التفاصيل"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditPatient(patient)}
                              title="تعديل"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeletePatient(patient.id)}
                              title="حذف"
                              disabled={isLoading}
                            >
                              <X className="h-4 w-4" />
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

          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Patient Selection */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-arabic">اختيار المريض</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {patients.slice(0, 5).map((patient) => (
                        <div
                          key={patient.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedPatient?.id === patient.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                          }`}
                          onClick={() => setSelectedPatient(patient)}
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs">{getInitials(patient.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium font-arabic text-sm">{patient.name}</div>
                              <div className="text-xs text-gray-500">{patient.phone}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Patient Profile Details */}
              <div className="lg:col-span-2">
                {selectedPatient ? (
                  <div className="space-y-6">
                    {/* Basic Info Card */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="font-arabic flex items-center gap-2">
                          <UserCheck className="h-5 w-5" />
                          المعلومات الأساسية
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4 mb-6">
                          <Avatar className="h-20 w-20">
                            <AvatarFallback className="text-2xl">{getInitials(selectedPatient.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-xl font-bold font-arabic">{selectedPatient.name}</h3>
                            <p className="text-gray-600 font-arabic">{selectedPatient.patient_number || `ID: ${selectedPatient.id}`}</p>
                            <div className="flex gap-2 mt-2">
                              {getStatusBadge(selectedPatient.status)}
                              <Badge variant="outline" className="font-arabic">
                                {selectedPatient.blood_type || 'فصيلة غير محددة'}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-gray-500" />
                              <span className="font-arabic text-sm font-medium">الجنس:</span>
                              <span className="text-sm">{selectedPatient.gender === 'male' ? 'ذكر' : selectedPatient.gender === 'female' ? 'أنثى' : selectedPatient.gender}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-gray-500" />
                              <span className="font-arabic text-sm font-medium">الهاتف:</span>
                              <span className="text-sm">{selectedPatient.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-gray-500" />
                              <span className="font-arabic text-sm font-medium">البريد:</span>
                              <span className="text-sm">{selectedPatient.email}</span>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-500" />
                              <span className="font-arabic text-sm font-medium">العنوان:</span>
                              <span className="text-sm font-arabic">{selectedPatient.address}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-gray-500" />
                              <span className="font-arabic text-sm font-medium">التأمين:</span>
                              <span className="text-sm font-arabic">{selectedPatient.insurance_company || 'غير محدد'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <span className="font-arabic text-sm font-medium">التسجيل:</span>
                              <span className="text-sm">{selectedPatient.created_at ? new Date(selectedPatient.created_at).toLocaleDateString('ar-SA') : 'غير محدد'}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Medical Info Card */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="font-arabic flex items-center gap-2">
                          <Heart className="h-5 w-5" />
                          المعلومات الطبية
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-bold font-arabic mb-2">التاريخ الطبي:</h4>
                          <p className="text-sm font-arabic text-gray-600 bg-gray-50 p-3 rounded">
                            {selectedPatient.medical_history || 'لا توجد معلومات طبية مسجلة'}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-bold font-arabic mb-2">الحساسيات:</h4>
                          <p className="text-sm font-arabic text-gray-600 bg-red-50 p-3 rounded">
                            {selectedPatient.allergies || 'لا توجد حساسيات معروفة'}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <Card>
                    <CardContent className="text-center py-12">
                      <UserCheck className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600 font-arabic">اختر مريضاً من القائمة لعرض ��لفه الشخصي</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-6">
            {/* Appointments Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium font-arabic">م��اعيد اليوم</CardTitle>
                  <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-xs text-muted-foreground font-arabic">3 منجزة، 5 متبقية</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium font-arabic">مواعيد الأسبوع</CardTitle>
                  <CalendarClock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground font-arabic">زيادة 15% عن الأسبوع الماضي</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium font-arabic">معدل الحضور</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">92%</div>
                  <p className="text-xs text-muted-foreground font-arabic">أداء ممتاز</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium font-arabic">إلغاءات</CardTitle>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">3</div>
                  <p className="text-xs text-muted-foreground font-arabic">هذا الأسبوع</p>
                </CardContent>
              </Card>
            </div>

            {/* Appointments Table */}
            <Card>
              <CardHeader>
                <CardTitle className="font-arabic">جدول المواعيد</CardTitle>
                <CardDescription className="font-arabic">
                  إدارة ومتابعة مواعيد جميع المرضى
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-arabic">المريض</TableHead>
                      <TableHead className="font-arabic">التاريخ</TableHead>
                      <TableHead className="font-arabic">الوقت</TableHead>
                      <TableHead className="font-arabic">الطبيب</TableHead>
                      <TableHead className="font-arabic">ال��دمة</TableHead>
                      <TableHead className="font-arabic">الحالة</TableHead>
                      <TableHead className="font-arabic">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Sample appointments data */}
                    <TableRow>
                      <TableCell className="font-arabic">أحمد محمد علي</TableCell>
                      <TableCell>2024-01-15</TableCell>
                      <TableCell>10:00 AM</TableCell>
                      <TableCell className="font-arabic">د. كمال الملصي</TableCell>
                      <TableCell className="font-arabic">فحص دوري</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800 font-arabic">مكتمل</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-arabic">فاطم�� أحمد</TableCell>
                      <TableCell>2024-01-15</TableCell>
                      <TableCell>2:00 PM</TableCell>
                      <TableCell className="font-arabic">د. كمال الملصي</TableCell>
                      <TableCell className="font-arabic">تنظ��ف الأسنان</TableCell>
                      <TableCell>
                        <Badge className="bg-blue-100 text-blue-800 font-arabic">مجدول</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-arabic">محمد علي حسن</TableCell>
                      <TableCell>2024-01-16</TableCell>
                      <TableCell>9:30 AM</TableCell>
                      <TableCell className="font-arabic">د. كمال الملصي</TableCell>
                      <TableCell className="font-arabic">حشو الأسنان</TableCell>
                      <TableCell>
                        <Badge className="bg-yellow-100 text-yellow-800 font-arabic">في الانتظار</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medical" className="space-y-6">
            {/* Medical Records Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium font-arabic">إجمالي السجلات</CardTitle>
                  <FileBarChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">247</div>
                  <p className="text-xs text-muted-foreground font-arabic">سجل طبي</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium font-arabic">سجلات هذا الشهر</CardTitle>
                  <ClipboardList className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">38</div>
                  <p className="text-xs text-muted-foreground font-arabic">سجل جديد</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium font-arabic">وصفات طبية</CardTitle>
                  <Pill className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">156</div>
                  <p className="text-xs text-muted-foreground font-arabic">وصفة نشطة</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium font-arabic">حالات متابعة</CardTitle>
                  <Stethoscope className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">12</div>
                  <p className="text-xs text-muted-foreground font-arabic">تحتاج متابعة</p>
                </CardContent>
              </Card>
            </div>

            {/* Medical Records Table */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="font-arabic">السجلات الطبية</CardTitle>
                    <CardDescription className="font-arabic">
                      تاريخ العلاجات والتشخيصات الطبية
                    </CardDescription>
                  </div>
                  <Button onClick={handleAddMedicalRecord} className="font-arabic">
                    <Plus className="h-4 w-4 mr-2" />
                    إضافة سجل طبي
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-arabic">المريض</TableHead>
                      <TableHead className="font-arabic">التاريخ</TableHead>
                      <TableHead className="font-arabic">التشخيص</TableHead>
                      <TableHead className="font-arabic">العلاج</TableHead>
                      <TableHead className="font-arabic">الطبيب</TableHead>
                      <TableHead className="font-arabic">نوع الزيارة</TableHead>
                      <TableHead className="font-arabic">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Sample medical records */}
                    <TableRow>
                      <TableCell className="font-arabic">أحمد محمد علي</TableCell>
                      <TableCell>2024-01-15</TableCell>
                      <TableCell className="font-arabic">تسوس في الضرس العلوي الأيمن</TableCell>
                      <TableCell className="font-arabic">حشو مركب</TableCell>
                      <TableCell className="font-arabic">د. كمال الملصي</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-arabic">علاج</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-arabic">فاطمة أحمد</TableCell>
                      <TableCell>2024-01-14</TableCell>
                      <TableCell className="font-arabic">تنظيف دوري وإزالة الجير</TableCell>
                      <TableCell className="font-arabic">تنظيف عميق</TableCell>
                      <TableCell className="font-arabic">د. كمال الملصي</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-arabic">وقاية</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-arabic">محمد علي حسن</TableCell>
                      <TableCell>2024-01-13</TableCell>
                      <TableCell className="font-arabic">كسر في الناب السفلي</TableCell>
                      <TableCell className="font-arabic">تركيب تاج</TableCell>
                      <TableCell className="font-arabic">د. كمال الملصي</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-arabic">طارئ</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-arabic">سارة محمود</TableCell>
                      <TableCell>2024-01-12</TableCell>
                      <TableCell className="font-arabic">التهاب اللثة</TableCell>
                      <TableCell className="font-arabic">علاج التهاب اللثة + مضاد حيوي</TableCell>
                      <TableCell className="font-arabic">د. كمال الملصي</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-arabic">علاج</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            {/* Payments Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium font-arabic">إجمالي الإيرادات</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">₹ 45,230</div>
                  <p className="text-xs text-muted-foreground font-arabic">هذا الشهر</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium font-arabic">دفعات معلقة</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">₹ 8,420</div>
                  <p className="text-xs text-muted-foreground font-arabic">5 فواتير</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium font-arabic">التأمين</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">₹ 12,300</div>
                  <p className="text-xs text-muted-foreground font-arabic">مطالبات معلقة</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium font-arabic">نقدي</CardTitle>
                  <Receipt className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹ 24,510</div>
                  <p className="text-xs text-muted-foreground font-arabic">دفعات نقدية</p>
                </CardContent>
              </Card>
            </div>

            {/* Payments Table */}
            <Card>
              <CardHeader>
                <CardTitle className="font-arabic">سجل المدفوعات</CardTitle>
                <CardDescription className="font-arabic">
                  تتبع جميع المدفوعات والفواتير
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-arabic">رقم الفاتورة</TableHead>
                      <TableHead className="font-arabic">المريض</TableHead>
                      <TableHead className="font-arabic">الخدمة</TableHead>
                      <TableHead className="font-arabic">المبلغ</TableHead>
                      <TableHead className="font-arabic">طريقة الدفع</TableHead>
                      <TableHead className="font-arabic">التاريخ</TableHead>
                      <TableHead className="font-arabic">الحالة</TableHead>
                      <TableHead className="font-arabic">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Sample payment records */}
                    <TableRow>
                      <TableCell className="font-mono">#INV-001</TableCell>
                      <TableCell className="font-arabic">أحمد محمد علي</TableCell>
                      <TableCell className="font-arabic">حشو مركب</TableCell>
                      <TableCell className="font-bold text-green-600">₹ 1,200</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800 font-arabic">نقدي</Badge>
                      </TableCell>
                      <TableCell>2024-01-15</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800 font-arabic">مدفوع</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Receipt className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">#INV-002</TableCell>
                      <TableCell className="font-arabic">فاطمة أحمد</TableCell>
                      <TableCell className="font-arabic">تنظيف الأسنان</TableCell>
                      <TableCell className="font-bold text-green-600">₹ 800</TableCell>
                      <TableCell>
                        <Badge className="bg-blue-100 text-blue-800 font-arabic">بطاقة</Badge>
                      </TableCell>
                      <TableCell>2024-01-14</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800 font-arabic">مدفوع</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Receipt className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">#INV-003</TableCell>
                      <TableCell className="font-arabic">محمد علي حسن</TableCell>
                      <TableCell className="font-arabic">تركيب تاج</TableCell>
                      <TableCell className="font-bold text-orange-600">₹ 3,500</TableCell>
                      <TableCell>
                        <Badge className="bg-purple-100 text-purple-800 font-arabic">تأمين</Badge>
                      </TableCell>
                      <TableCell>2024-01-13</TableCell>
                      <TableCell>
                        <Badge className="bg-yellow-100 text-yellow-800 font-arabic">معلق</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Receipt className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">#INV-004</TableCell>
                      <TableCell className="font-arabic">سارة محمود</TableCell>
                      <TableCell className="font-arabic">علاج التهاب اللثة</TableCell>
                      <TableCell className="font-bold text-green-600">₹ 1,500</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800 font-arabic">نقدي</Badge>
                      </TableCell>
                      <TableCell>2024-01-12</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800 font-arabic">مدفوع</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Receipt className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
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
                <Input placeholder="أدخل الا��م الكامل" className="font-arabic" />
              </div>
              <div className="space-y-2">
                <Label className="font-arabic">العمر</Label>
                <Input type="number" placeholder="العمر" className="font-arabic" />
              </div>
              <div className="space-y-2">
                <Label className="font-arabic">الجنس</Label>
                <Select
                  placeholder="اختر الجنس"
                  className="font-arabic"
                >
                  <SelectItem value="male" className="font-arabic">ذكر</SelectItem>
                  <SelectItem value="female" className="font-arabic">أنثى</SelectItem>
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
                <Label className="font-arabic">العنوان</Label>
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
              <Button
                onClick={() => {
                  setIsViewPatientDialogOpen(false);
                  handleEditPatient(selectedPatient);
                }}
                className="font-arabic"
              >
                تعديل البيانات
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Patient Dialog */}
        <Dialog open={isAddPatientDialogOpen} onOpenChange={setIsAddPatientDialogOpen}>
          <DialogContent className="sm:max-w-[600px]" dir="rtl">
            <DialogHeader>
              <DialogTitle className="font-arabic">إضافة مريض جديد</DialogTitle>
              <DialogDescription className="font-arabic">
                املأ البيانات التالية لإضافة مريض جديد
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-arabic">الاسم الكامل <span className="text-red-500">*</span></Label>
                  <Input
                    placeholder="أدخل الاسم الكامل"
                    className="font-arabic"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-arabic">رقم الهاتف <span className="text-red-500">*</span></Label>
                  <Input
                    placeholder="أدخل رقم الهاتف"
                    className="font-arabic"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-arabic">البريد الإلكتروني</Label>
                  <Input
                    type="email"
                    placeholder="أدخل البريد الإلكتروني"
                    className="font-arabic"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-arabic">الجنس</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
                  >
                    <option value="">اختر الجنس</option>
                    <option value="male">ذكر</option>
                    <option value="female">أنثى</option>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-arabic">العنوان</Label>
                <Input
                  placeholder="أدخل العنوان"
                  className="font-arabic"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label className="font-arabic">شركة التأمين</Label>
                <Input
                  placeholder="أدخل اسم شركة التأمين"
                  className="font-arabic"
                  value={formData.insurance_company}
                  onChange={(e) => setFormData(prev => ({ ...prev, insurance_company: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label className="font-arabic">التاريخ الطبي</Label>
                <Textarea
                  placeholder="أدخل التاريخ الطبي والأمراض السابقة..."
                  className="font-arabic"
                  value={formData.medical_history}
                  onChange={(e) => setFormData(prev => ({ ...prev, medical_history: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label className="font-arabic">الحساسيات</Label>
                <Textarea
                  placeholder="أدخل الحساسيات المعروفة..."
                  className="font-arabic"
                  value={formData.allergies}
                  onChange={(e) => setFormData(prev => ({ ...prev, allergies: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddPatientDialogOpen(false)} className="font-arabic">
                إلغاء
              </Button>
              <Button onClick={handleSavePatient} disabled={isLoading} className="font-arabic">
                {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                حفظ المريض
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Patient Dialog */}
        <Dialog open={isEditPatientDialogOpen} onOpenChange={setIsEditPatientDialogOpen}>
          <DialogContent className="sm:max-w-[600px]" dir="rtl">
            <DialogHeader>
              <DialogTitle className="font-arabic">تعديل بيانات المريض</DialogTitle>
              <DialogDescription className="font-arabic">
                قم بتعديل البيانات المطلوبة
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-arabic">الاسم الكامل <span className="text-red-500">*</span></Label>
                  <Input
                    placeholder="أدخل الاسم الكامل"
                    className="font-arabic"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-arabic">رقم الهاتف <span className="text-red-500">*</span></Label>
                  <Input
                    placeholder="أدخل رقم الهاتف"
                    className="font-arabic"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-arabic">الب��يد الإلكتروني</Label>
                  <Input
                    type="email"
                    placeholder="أدخل البريد الإلكتروني"
                    className="font-arabic"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-arabic">الجنس</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
                  >
                    <option value="">اختر الجنس</option>
                    <option value="male">ذكر</option>
                    <option value="female">أنثى</option>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-arabic">العنوان</Label>
                <Input
                  placeholder="أدخل العنوان"
                  className="font-arabic"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label className="font-arabic">شركة التأمين</Label>
                <Input
                  placeholder="أدخل اسم شركة التأمين"
                  className="font-arabic"
                  value={formData.insurance_company}
                  onChange={(e) => setFormData(prev => ({ ...prev, insurance_company: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label className="font-arabic">التاريخ الطبي</Label>
                <Textarea
                  placeholder="أدخل التاريخ الطبي والأمراض السابقة..."
                  className="font-arabic"
                  value={formData.medical_history}
                  onChange={(e) => setFormData(prev => ({ ...prev, medical_history: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label className="font-arabic">الحساسيات</Label>
                <Textarea
                  placeholder="أدخل الحساسيات المعروفة..."
                  className="font-arabic"
                  value={formData.allergies}
                  onChange={(e) => setFormData(prev => ({ ...prev, allergies: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditPatientDialogOpen(false)} className="font-arabic">
                إلغاء
              </Button>
              <Button onClick={handleSavePatient} disabled={isLoading} className="font-arabic">
                {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                حفظ التغييرات
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
