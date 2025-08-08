import { useState, useEffect } from "react";
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
import { useToast } from "@/hooks/use-toast";
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Search,
  Plus,
  Eye,
  Download,
  Calendar,
  Filter,
  Receipt,
  History,
  Check,
  X
} from "lucide-react";

// Mock data for transactions
const transactions = [
  {
    id: "TXN-001",
    patientName: "أحمد محمد",
    patientId: "PAT-001",
    service: "تنظيف الأسنان",
    amount: 200,
    paid: 200,
    remaining: 0,
    status: "paid",
    date: "2024-01-15",
    paymentMethod: "نقداً"
  },
  {
    id: "TXN-002",
    patientName: "فاطمة أحمد",
    patientId: "PAT-002",
    service: "تقويم الأسنان",
    amount: 3000,
    paid: 1500,
    remaining: 1500,
    status: "partial",
    date: "2024-01-14",
    paymentMethod: "بطاقة ائتمانية"
  },
  {
    id: "TXN-003",
    patientName: "��حمد علي",
    patientId: "PAT-003",
    service: "زراعة الأسنان",
    amount: 2500,
    paid: 0,
    remaining: 2500,
    status: "pending",
    date: "2024-01-13",
    paymentMethod: "-"
  },
  {
    id: "TXN-004",
    patientName: "نورا سالم",
    patientId: "PAT-004",
    service: "حشوات الأسنان",
    amount: 300,
    paid: 300,
    remaining: 0,
    status: "paid",
    date: "2024-01-12",
    paymentMethod: "تحويل بنكي"
  },
  {
    id: "TXN-005",
    patientName: "سارة خالد",
    patientId: "PAT-005",
    service: "تبييض الأسنان",
    amount: 800,
    paid: 400,
    remaining: 400,
    status: "partial",
    date: "2024-01-11",
    paymentMethod: "نقداً"
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "paid":
      return <Badge className="bg-green-100 text-green-800">مدفوع</Badge>;
    case "partial":
      return <Badge className="bg-yellow-100 text-yellow-800">����دفوع جزئي��ً</Badge>;
    case "pending":
      return <Badge className="bg-red-100 text-red-800">غ��ر ��دفوع</Badge>;
    default:
      return <Badge variant="secondary">غير محدد</Badge>;
  }
};

export default function Transactions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isNewPaymentDialogOpen, setIsNewPaymentDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactionsList, setTransactionsList] = useState(transactions);
  const [paymentHistory, setPaymentHistory] = useState<any[]>([
    {
      id: "PAY-001",
      transactionId: "TXN-001",
      patientName: "أحمد محمد",
      amount: 200,
      method: "نقداً",
      notes: "دفعة كاملة",
      date: "2024-01-15",
      timestamp: "15/01/2024 - 10:30 ص"
    },
    {
      id: "PAY-002",
      transactionId: "TXN-002",
      patientName: "فاطمة أحمد",
      amount: 1500,
      method: "بطاقة ائتماني��",
      notes: "دفعة أولى من تقويم الأسنان",
      date: "2024-01-14",
      timestamp: "14/01/2024 - 2:15 م"
    },
    {
      id: "PAY-003",
      transactionId: "TXN-004",
      patientName: "نورا سالم",
      amount: 300,
      method: "تحويل بنكي",
      notes: "دفعة كاملة للحشوات",
      date: "2024-01-12",
      timestamp: "12/01/2024 - 11:45 ص"
    },
    {
      id: "PAY-004",
      transactionId: "TXN-005",
      patientName: "سارة خالد",
      amount: 400,
      method: "نقداً",
      notes: "دفعة أولى من تبييض الأسنان",
      date: "2024-01-11",
      timestamp: "11/01/2024 - 4:20 م"
    }
  ]);
  const { toast } = useToast();

  // Load payment history from API
  useEffect(() => {
    const loadPaymentHistory = async () => {
      try {
        const response = await fetch('/api/payments');
        const result = await response.json();

        if (result.success && result.data) {
          const formattedPayments = result.data.map((payment: any) => ({
            id: payment.id,
            transactionId: payment.transaction_id,
            patientName: payment.patient_name,
            amount: payment.amount,
            method: payment.payment_method,
            notes: payment.notes,
            date: payment.payment_date.split('T')[0],
            timestamp: new Date(payment.payment_date).toLocaleString('ar-SA')
          }));
          setPaymentHistory(formattedPayments);
        }
      } catch (error) {
        console.error('Failed to load payment history:', error);
      }
    };

    loadPaymentHistory();
  }, []);

  // Calculate totals
  const totalRevenue = transactionsList.reduce((sum, t) => sum + t.paid, 0);
  const totalPending = transactionsList.reduce((sum, t) => sum + t.remaining, 0);
  const totalTransactions = transactionsList.reduce((sum, t) => sum + t.amount, 0);

  // Filter transactions
  const filteredTransactions = transactionsList.filter(transaction => {
    const matchesSearch = transaction.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || transaction.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handlePayment = (transaction: any) => {
    setSelectedTransaction(transaction);
    setPaymentAmount("");
    setPaymentMethod("");
    setPaymentNotes("");
    setIsPaymentDialogOpen(true);
  };

  const handleNewPayment = () => {
    setSelectedTransaction(null);
    setPaymentAmount("");
    setPaymentMethod("");
    setPaymentNotes("");
    setIsNewPaymentDialogOpen(true);
  };

  const processPayment = async () => {
    if (!paymentAmount || !paymentMethod) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(paymentAmount);
    if (amount <= 0) {
      toast({
        title: "خط��",
        description: "يجب أن يكون مبلغ الدفعة أكبر من صفر",
        variant: "destructive",
      });
      return;
    }

    if (selectedTransaction && amount > selectedTransaction.remaining) {
      toast({
        title: "خطأ",
        description: "مبلغ الدفعة أكبر من المبلغ المتبقي",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Prepare payment data
      const paymentData = {
        transaction_id: selectedTransaction?.id || null,
        patient_name: selectedTransaction?.patientName || "مر��ض جديد",
        amount: amount,
        payment_method: paymentMethod,
        notes: paymentNotes,
        service_name: selectedTransaction?.service || "خدمة عامة"
      };

      // Send to backend
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'فشل في تسجيل الدفعة');
      }

      // Update local state
      const newPayment = {
        id: result.data.id,
        transactionId: result.data.transaction_id,
        patientName: result.data.patient_name,
        amount: result.data.amount,
        method: result.data.payment_method,
        notes: result.data.notes,
        date: result.data.payment_date.split('T')[0],
        timestamp: new Date(result.data.payment_date).toLocaleString('ar-SA')
      };

      setPaymentHistory(prev => [newPayment, ...prev]);

      if (selectedTransaction) {
        // Update existing transaction
        const updatedTransactions = transactionsList.map(t => {
          if (t.id === selectedTransaction.id) {
            const newPaid = t.paid + amount;
            const newRemaining = t.amount - newPaid;
            const newStatus = newRemaining === 0 ? "paid" : (newPaid > 0 ? "partial" : "pending");

            return {
              ...t,
              paid: newPaid,
              remaining: newRemaining,
              status: newStatus,
              paymentMethod: paymentMethod
            };
          }
          return t;
        });
        setTransactionsList(updatedTransactions);
      }

      toast({
        title: "تم بنجاح",
        description: `تم تسجيل دفعة بمبلغ ${amount.toLocaleString()} ر.ي`,
      });

      setIsPaymentDialogOpen(false);
      setIsNewPaymentDialogOpen(false);

    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : "حدث خطأ أثناء معالجة الدفعة",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadPaymentHistory = async (transactionId: string) => {
    // Mock payment history - in real app this would come from backend
    const mockHistory = [
      {
        id: "PAY-001",
        amount: 1000,
        method: "نقداً",
        date: "2024-01-10",
        notes: "دفعة أولى"
      },
      {
        id: "PAY-002",
        amount: 500,
        method: "بطاقة ائتمانية",
        date: "2024-01-12",
        notes: "دفعة ثانية"
      }
    ];
    setPaymentHistory(mockHistory);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 font-arabic">المعاملات المالية</h1>
          <p className="text-gray-600 font-arabic">إدارة شاملة للمدفوعات والمبالغ المستحقة</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-arabic">إجمالي الإيرادات</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRevenue.toLocaleString()} ر.ي</div>
              <p className="text-xs text-muted-foreground font-arabic">
                <TrendingUp className="h-4 w-4 inline mr-1" />
                +12% من الشهر الماضي
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-arabic">المبالغ المستحقة</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{totalPending.toLocaleString()} ر.ي</div>
              <p className="text-xs text-muted-foreground font-arabic">
                <TrendingDown className="h-4 w-4 inline mr-1" />
                -5% من الشهر الماضي
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-arabic">إجمالي المعاملات</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTransactions.toLocaleString()} ر.ي</div>
              <p className="text-xs text-muted-foreground font-arabic">
                {transactions.length} معاملة ه��ا الشهر
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-arabic">نسبة التحصيل</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {Math.round((totalRevenue / totalTransactions) * 100)}%
              </div>
              <p className="text-xs text-muted-foreground font-arabic">
                م�� إجمالي المبالغ المطلوبة
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList className="font-arabic">
            <TabsTrigger value="transactions">المعاملات</TabsTrigger>
            <TabsTrigger value="payments">سجل المدفوعات</TabsTrigger>
            <TabsTrigger value="reports">التقارير</TabsTrigger>
            <TabsTrigger value="settings">الإعدادات</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="space-y-6">
            {/* Filters and Search */}
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
                        placeholder="ابحث باسم المريض أو رقم المعاملة..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 font-arabic"
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-48">
                    <Label className="font-arabic">حالة الدفع</Label>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus} className="font-arabic">
                      <SelectItem value="all">جميع الحالات</SelectItem>
                      <SelectItem value="paid">مدفوع</SelectItem>
                      <SelectItem value="partial">مدفوع جزئياً</SelectItem>
                      <SelectItem value="pending">غير مدفوع</SelectItem>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleNewPayment} className="font-arabic">
                      <Plus className="h-4 w-4 mr-2" />
                      إضافة دفعة جديدة
                    </Button>
                    <Button variant="outline" className="font-arabic">
                      <Filter className="h-4 w-4 mr-2" />
                      تصفية متقدمة
                    </Button>
                    <Button variant="outline" className="font-arabic">
                      <Download className="h-4 w-4 mr-2" />
                      تصدير
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transactions Table */}
            <Card>
              <CardHeader>
                <CardTitle className="font-arabic">قائمة المعاملات</CardTitle>
                <CardDescription className="font-arabic">
                  إدارة جميع المعاملات المالية للمرضى
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-arabic">رقم المعاملة</TableHead>
                      <TableHead className="font-arabic">اسم المريض</TableHead>
                      <TableHead className="font-arabic">الخدمة</TableHead>
                      <TableHead className="font-arabic">المبلغ الكلي</TableHead>
                      <TableHead className="font-arabic">المبلغ المدفوع</TableHead>
                      <TableHead className="font-arabic">المبلغ المتبقي</TableHead>
                      <TableHead className="font-arabic">الحالة</TableHead>
                      <TableHead className="font-arabic">التاريخ</TableHead>
                      <TableHead className="font-arabic">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">{transaction.id}</TableCell>
                        <TableCell className="font-arabic">{transaction.patientName}</TableCell>
                        <TableCell className="font-arabic">{transaction.service}</TableCell>
                        <TableCell>{transaction.amount.toLocaleString()} ر.ي</TableCell>
                        <TableCell className="text-green-600">{transaction.paid.toLocaleString()} ر.ي</TableCell>
                        <TableCell className="text-red-600">{transaction.remaining.toLocaleString()} ر.ي</TableCell>
                        <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                        <TableCell>{new Date(transaction.date).toLocaleDateString('ar-SA')}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            {transaction.remaining > 0 && (
                              <Button 
                                size="sm" 
                                onClick={() => handlePayment(transaction)}
                                className="font-arabic"
                              >
                                دفع
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            {/* Payment History */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="font-arabic">سجل الم��فوعات</CardTitle>
                    <CardDescription className="font-arabic">
                      جمي�� الدفعات المسجلة في النظام
                    </CardDescription>
                  </div>
                  <Button onClick={handleNewPayment} className="font-arabic">
                    <Plus className="h-4 w-4 mr-2" />
                    إضافة دفعة
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {paymentHistory.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-arabic">رقم الدفعة</TableHead>
                        <TableHead className="font-arabic">رقم المعاملة</TableHead>
                        <TableHead className="font-arabic">اسم المريض</TableHead>
                        <TableHead className="font-arabic">المبلغ</TableHead>
                        <TableHead className="font-arabic">طريقة الدفع</TableHead>
                        <TableHead className="font-arabic">التاريخ</TableHead>
                        <TableHead className="font-arabic">ملاحظات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paymentHistory.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-medium">{payment.id}</TableCell>
                          <TableCell>{payment.transactionId}</TableCell>
                          <TableCell className="font-arabic">{payment.patientName}</TableCell>
                          <TableCell className="text-green-600">{payment.amount.toLocaleString()} ر.ي</TableCell>
                          <TableCell className="font-arabic">{payment.method}</TableCell>
                          <TableCell>{payment.timestamp || payment.date}</TableCell>
                          <TableCell className="font-arabic">{payment.notes || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Receipt className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="font-arabic">لا توجد مدفوعات مسجلة بعد</p>
                    <Button onClick={handleNewPayment} className="mt-4 font-arabic">
                      <Plus className="h-4 w-4 mr-2" />
                      إضافة أول دفعة
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-arabic">التقارير المالية</CardTitle>
                <CardDescription className="font-arabic">
                  تقاري�� شاملة عن الإيرادات والمصروفات
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button className="h-20 font-arabic" variant="outline">
                    <div className="text-center">
                      <Calendar className="h-6 w-6 mx-auto mb-2" />
                      تقرير شهري
                    </div>
                  </Button>
                  <Button className="h-20 font-arabic" variant="outline">
                    <div className="text-center">
                      <TrendingUp className="h-6 w-6 mx-auto mb-2" />
                      تقرير الإيرادا��
                    </div>
                  </Button>
                  <Button className="h-20 font-arabic" variant="outline">
                    <div className="text-center">
                      <CreditCard className="h-6 w-6 mx-auto mb-2" />
                      تقرير المدفوعات
                    </div>
                  </Button>
                  <Button className="h-20 font-arabic" variant="outline">
                    <div className="text-center">
                      <Receipt className="h-6 w-6 mx-auto mb-2" />
                      تقرير المستحقات
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-arabic">إعدادات النظام المالي</CardTitle>
                <CardDescription className="font-arabic">
                  تخصيص إعدادات المدفوعات والفواتير
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="font-arabic">العملة ��لافتراضية</Label>
                  <Select defaultValue="sar" className="font-arabic">
                    <SelectTrigger className="font-arabic">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sar" className="font-arabic">ريال س��ودي (SAR)</SelectItem>
                      <SelectItem value="usd" className="font-arabic">دولار أمريكي (USD)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="font-arabic">طرق الدفع المق��ولة</Label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-reverse space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span className="font-arabic">نقداً</span>
                    </label>
                    <label className="flex items-center space-x-reverse space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span className="font-arabic">بطاقة ائتمانية</span>
                    </label>
                    <label className="flex items-center space-x-reverse space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span className="font-arabic">��حويل بنكي</span>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Payment Dialog */}
        <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
          <DialogContent className="sm:max-w-[500px]" dir="rtl">
            <DialogHeader>
              <DialogTitle className="font-arabic">��سجيل دفعة جديدة</DialogTitle>
              <DialogDescription className="font-arabic">
                {selectedTransaction && `للمريض: ${selectedTransaction.patientName} - المبلغ المتبقي: ${selectedTransaction.remaining} ر.ي`}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="font-arabic">مبلغ الدفعة <span className="text-red-500">*</span></Label>
                <Input
                  type="number"
                  placeholder="أدخل المبلغ"
                  className="font-arabic"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                />
                {selectedTransaction && (
                  <p className="text-sm text-gray-500 font-arabic">
                    الحد الأقصى: {selectedTransaction.remaining.toLocaleString()} ر.ي
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="font-arabic">طريقة الدفع <span className="text-red-500">*</span></Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod} placeholder="اختر طريقة الدفع" className="font-arabic">
                  <SelectItem value="نقداً">نقداً</SelectItem>
                  <SelectItem value="بطاقة ائتمانية">بطاقة ائتمانية</SelectItem>
                  <SelectItem value="تحويل بنكي">تحويل بنكي</SelectItem>
                  <SelectItem value="شيك">شيك</SelectItem>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-arabic">ملاحظات</Label>
                <Textarea
                  placeholder="ملاحظات إضافية..."
                  className="font-arabic"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)} className="font-arabic">
                إلغاء
              </Button>
              <Button onClick={processPayment} disabled={isLoading} className="font-arabic">
                {isLoading ? "جاري المعالجة..." : "تأكيد الدفع"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* New Payment Dialog */}
        <Dialog open={isNewPaymentDialogOpen} onOpenChange={setIsNewPaymentDialogOpen}>
          <DialogContent className="sm:max-w-[600px]" dir="rtl">
            <DialogHeader>
              <DialogTitle className="font-arabic">إضافة دفعة جديدة</DialogTitle>
              <DialogDescription className="font-arabic">
                تسجيل دفعة جديدة في النظام
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-arabic">اسم المريض <span className="text-red-500">*</span></Label>
                  <Input
                    placeholder="أد��ل اسم المريض"
                    className="font-arabic"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-arabic">رقم المريض</Label>
                  <Input
                    placeholder="رقم المريض (اختياري)"
                    className="font-arabic"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-arabic">نوع الخدمة</Label>
                  <Select placeholder="اختر نوع الخدمة" className="font-arabic">
                    <SelectItem value="تنظيف">تنظيف الأسنان</SelectItem>
                    <SelectItem value="حشوات">حشوات الأسنان</SelectItem>
                    <SelectItem value="تقويم">تقويم الأسنان</SelectItem>
                    <SelectItem value="زراعة">زراعة الأسنان</SelectItem>
                    <SelectItem value="تبييض">تبييض الأسنان</SelectItem>
                    <SelectItem value="أخرى">خدمة أخرى</SelectItem>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="font-arabic">مبلغ الدفعة <span className="text-red-500">*</span></Label>
                  <Input
                    type="number"
                    placeholder="أدخل المبلغ"
                    className="font-arabic"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="font-arabic">طريقة الدفع <span className="text-red-500">*</span></Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod} placeholder="اختر طريقة الدفع" className="font-arabic">
                  <SelectItem value="نقداً">نقداً</SelectItem>
                  <SelectItem value="بطاقة ائتمانية">بطاقة ائتمانية</SelectItem>
                  <SelectItem value="تحويل بنكي">تحويل بنكي</SelectItem>
                  <SelectItem value="شيك">شيك</SelectItem>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-arabic">ملاحظات</Label>
                <Textarea
                  placeholder="ملاحظات إضافية حول الدفعة..."
                  className="font-arabic"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewPaymentDialogOpen(false)} className="font-arabic">
                إلغاء
              </Button>
              <Button onClick={processPayment} disabled={isLoading} className="font-arabic">
                {isLoading ? "جاري الحفظ..." : "حفظ الدفعة"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
