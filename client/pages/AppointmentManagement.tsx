import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Filter,
  Download,
  Loader2,
  RefreshCw,
} from "lucide-react";

interface Appointment {
  id: number;
  appointment_number: string;
  patient_name: string;
  phone: string;
  email: string;
  appointment_date: string;
  appointment_time: string;
  service_name: string;
  doctor_name: string;
  status: string;
  chief_complaint: string;
  notes: string;
  created_at: string;
}

export default function AppointmentManagement() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [serverConnected, setServerConnected] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    scheduled: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/bookings");

      if (response.ok) {
        const data = await response.json();
        setAppointments(data.data || []);
        calculateStats(data.data || []);
      } else {
        console.error("فشل في جلب المواعيد - حالة الاستجابة:", response.status);
        setAppointments([]);

        // Show user-friendly error message
        if (response.status === 500) {
          alert("خطأ في الخادم. يرجى المحاولة مرة أخرى.");
        } else if (response.status === 404) {
          alert("API غير موجود. يرجى التحقق من إعدادات النظام.");
        }
      }
    } catch (error) {
      console.error("خطأ في جلب المواعيد:", error);
      setAppointments([]);

      // Show user-friendly error message for network errors
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        alert("لا يمكن الاتصال بالخادم. يرجى التأكد من أن الخادم يعمل والمحاولة مرة أخرى.");
      } else {
        alert("حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.");
      }
    } finally {
      setLoading(false);
    }
  };

  const cleanupAppointmentData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/appointments/cleanup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log("تم تنظيف البيانات:", result);

        // إعادة تحميل المواعيد بعد التنظيف
        await fetchAppointments();

        alert(`تم تنظيف البيانات بنجاح!\nتم حذف ${result.statistics.deletedInvalid + result.statistics.deletedDuplicates} موعد خاطئ`);
      } else {
        console.error("فشل في تنظيف البيانات");
        alert("فشل في تنظيف البيانات");
      }
    } catch (error) {
      console.error("خطأ في تنظيف البيانات:", error);
      alert("خطأ في تنظيف البيانات");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (appointmentData: Appointment[]) => {
    const stats = appointmentData.reduce(
      (acc, appointment) => {
        acc.total++;
        switch (appointment.status) {
          case "scheduled":
            acc.scheduled++;
            break;
          case "confirmed":
            acc.confirmed++;
            break;
          case "completed":
            acc.completed++;
            break;
          case "cancelled":
            acc.cancelled++;
            break;
        }
        return acc;
      },
      { total: 0, scheduled: 0, confirmed: 0, completed: 0, cancelled: 0 }
    );
    setStats(stats);
  };

  const updateAppointmentStatus = async (id: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/bookings/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        await fetchAppointments(); // إعادة تحميل البيانات
        setSelectedAppointment(null);
        setShowEditDialog(false);
      } else {
        console.error("فشل في تحديث حالة الموعد");
      }
    } catch (error) {
      console.error("خطأ في تحديث حالة الموعد:", error);
    }
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch = 
      appointment.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.appointment_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-800">مجدول</Badge>;
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800">مؤكد</Badge>;
      case "completed":
        return <Badge className="bg-gray-100 text-gray-800">مكتمل</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">ملغي</Badge>;
      case "no_show":
        return <Badge className="bg-orange-100 text-orange-800">لم يحضر</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    return timeString || "غير محدد";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="mr-3 font-arabic">جاري تحميل المواعيد...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-arabic">
              إدارة المواعيد
            </h1>
            <p className="text-gray-600 font-arabic">
              إدارة شاملة لجميع مواعيد العيادة
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={fetchAppointments}
              className="font-arabic"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              تحديث
            </Button>
            <Button
              variant="outline"
              onClick={cleanupAppointmentData}
              className="font-arabic text-orange-600 border-orange-300 hover:bg-orange-50"
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              إصلاح البيانات
            </Button>
            <Button className="font-arabic">
              <Plus className="h-4 w-4 mr-2" />
              موعد جديد
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="text-lg font-bold">{stats.total}</div>
                  <div className="text-sm text-gray-500 font-arabic">الإجمالي</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="text-lg font-bold">{stats.scheduled}</div>
                  <div className="text-sm text-gray-500 font-arabic">مجدول</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <div className="text-lg font-bold">{stats.confirmed}</div>
                  <div className="text-sm text-gray-500 font-arabic">مؤكد</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-gray-500" />
                <div>
                  <div className="text-lg font-bold">{stats.completed}</div>
                  <div className="text-sm text-gray-500 font-arabic">مكتمل</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-500" />
                <div>
                  <div className="text-lg font-bold">{stats.cancelled}</div>
                  <div className="text-sm text-gray-500 font-arabic">ملغي</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="font-arabic">البحث</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="البحث بالاسم أو رقم الموعد أو الهاتف..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 font-arabic"
                  />
                </div>
              </div>
              <div>
                <Label className="font-arabic">حالة الموعد</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="font-arabic">
                    <SelectValue placeholder="اختر الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الحالات</SelectItem>
                    <SelectItem value="scheduled">مجدول</SelectItem>
                    <SelectItem value="confirmed">مؤكد</SelectItem>
                    <SelectItem value="completed">مكتمل</SelectItem>
                    <SelectItem value="cancelled">ملغي</SelectItem>
                    <SelectItem value="no_show">لم يحضر</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button variant="outline" className="w-full font-arabic">
                  <Download className="h-4 w-4 mr-2" />
                  تصدير Excel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appointments Table */}
        <Card>
          <CardHeader>
            <CardTitle className="font-arabic">قائمة المواعيد</CardTitle>
            <CardDescription className="font-arabic">
              {filteredAppointments.length} موعد من أصل {appointments.length}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredAppointments.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 font-arabic">
                  {appointments.length === 0 
                    ? "لا توجد مواعيد مسجلة في النظام"
                    : "لا توجد مواعيد تطابق معايير البحث"
                  }
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-arabic">رقم الموعد</TableHead>
                    <TableHead className="font-arabic">اسم المريض</TableHead>
                    <TableHead className="font-arabic">التاريخ</TableHead>
                    <TableHead className="font-arabic">الوقت</TableHead>
                    <TableHead className="font-arabic">الخدمة</TableHead>
                    <TableHead className="font-arabic">الطبيب</TableHead>
                    <TableHead className="font-arabic">الحالة</TableHead>
                    <TableHead className="font-arabic">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell className="font-mono">
                        {appointment.appointment_number}
                      </TableCell>
                      <TableCell className="font-arabic font-medium">
                        {appointment.patient_name}
                      </TableCell>
                      <TableCell>
                        {formatDate(appointment.appointment_date)}
                      </TableCell>
                      <TableCell>
                        {formatTime(appointment.appointment_time)}
                      </TableCell>
                      <TableCell className="font-arabic">
                        {appointment.service_name || appointment.chief_complaint}
                      </TableCell>
                      <TableCell className="font-arabic">
                        {appointment.doctor_name || "غير محدد"}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(appointment.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedAppointment(appointment);
                              setShowDetailsDialog(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedAppointment(appointment);
                              setShowEditDialog(true);
                            }}
                          >
                            <Edit2 className="h-4 w-4" />
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

        {/* Appointment Details Dialog */}
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-2xl" dir="rtl">
            <DialogHeader>
              <DialogTitle className="font-arabic">تفاصيل الموعد</DialogTitle>
            </DialogHeader>
            {selectedAppointment && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-arabic">رقم الموعد</Label>
                  <p className="font-mono">{selectedAppointment.appointment_number}</p>
                </div>
                <div>
                  <Label className="font-arabic">اسم المريض</Label>
                  <p className="font-arabic">{selectedAppointment.patient_name}</p>
                </div>
                <div>
                  <Label className="font-arabic">رقم الهاتف</Label>
                  <p>{selectedAppointment.phone}</p>
                </div>
                <div>
                  <Label className="font-arabic">البريد الإلكتروني</Label>
                  <p>{selectedAppointment.email}</p>
                </div>
                <div>
                  <Label className="font-arabic">التاريخ</Label>
                  <p>{formatDate(selectedAppointment.appointment_date)}</p>
                </div>
                <div>
                  <Label className="font-arabic">الوقت</Label>
                  <p>{formatTime(selectedAppointment.appointment_time)}</p>
                </div>
                <div>
                  <Label className="font-arabic">الخدمة المطلوبة</Label>
                  <p className="font-arabic">{selectedAppointment.service_name || selectedAppointment.chief_complaint}</p>
                </div>
                <div>
                  <Label className="font-arabic">الحالة</Label>
                  {getStatusBadge(selectedAppointment.status)}
                </div>
                {selectedAppointment.notes && (
                  <div className="col-span-2">
                    <Label className="font-arabic">ملاحظات</Label>
                    <p className="font-arabic">{selectedAppointment.notes}</p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Status Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent dir="rtl">
            <DialogHeader>
              <DialogTitle className="font-arabic">تحديث حالة الموعد</DialogTitle>
              <DialogDescription className="font-arabic">
                تحديث حالة الموعد رقم {selectedAppointment?.appointment_number}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="font-arabic">الحالة الجديدة</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Button
                    variant="outline"
                    className="font-arabic"
                    onClick={() => selectedAppointment && updateAppointmentStatus(selectedAppointment.id, "confirmed")}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    تأكيد
                  </Button>
                  <Button
                    variant="outline"
                    className="font-arabic"
                    onClick={() => selectedAppointment && updateAppointmentStatus(selectedAppointment.id, "completed")}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    مكتمل
                  </Button>
                  <Button
                    variant="outline"
                    className="font-arabic"
                    onClick={() => selectedAppointment && updateAppointmentStatus(selectedAppointment.id, "cancelled")}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    إلغاء
                  </Button>
                  <Button
                    variant="outline"
                    className="font-arabic"
                    onClick={() => selectedAppointment && updateAppointmentStatus(selectedAppointment.id, "no_show")}
                  >
                    <AlertCircle className="h-4 w-4 mr-2" />
                    لم يحضر
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
