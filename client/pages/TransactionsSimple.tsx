import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  Settings,
  Calculator,
  Receipt,
  CashIcon as Cash,
  Calendar,
  User,
  Phone,
  Mail,
} from "lucide-react";

interface Transaction {
  id: number;
  type: "income" | "expense";
  amount: number;
  description: string;
  category: string;
  date: string;
  status: "completed" | "pending" | "failed";
  patient_name?: string;
  service_type?: string;
  payment_method: string;
}

interface PaymentStats {
  total_revenue: number;
  total_expenses: number;
  pending_payments: number;
  completed_payments: number;
  monthly_revenue: number;
  monthly_expenses: number;
}

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [paymentStats, setPaymentStats] = useState<PaymentStats>({
    total_revenue: 0,
    total_expenses: 0,
    pending_payments: 0,
    completed_payments: 0,
    monthly_revenue: 0,
    monthly_expenses: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "completed" | "pending" | "failed">("all");
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPaymentDialog, setShowNewPaymentDialog] = useState(false);
  const { toast } = useToast();

  // New payment form state
  const [newPayment, setNewPayment] = useState({
    patient_name: "",
    service_type: "",
    amount: "",
    payment_method: "cash",
    description: "",
    type: "income" as "income" | "expense"
  });

  useEffect(() => {
    fetchTransactions();
    fetchPaymentStats();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/transactions');
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const fetchPaymentStats = async () => {
    try {
      const response = await fetch('/api/transactions/stats');
      if (response.ok) {
        const data = await response.json();
        setPaymentStats(data);
      }
    } catch (error) {
      console.error('Error fetching payment stats:', error);
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.service_type?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || transaction.type === filterType;
    const matchesStatus = filterStatus === "all" || transaction.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const processPayment = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newPayment,
          amount: parseFloat(newPayment.amount),
          date: new Date().toISOString(),
          status: 'completed',
          category: newPayment.service_type || 'general'
        }),
      });

      if (response.ok) {
        const savedTransaction = await response.json();
        setTransactions(prev => [savedTransaction, ...prev]);
        setShowNewPaymentDialog(false);
        setNewPayment({
          patient_name: "",
          service_type: "",
          amount: "",
          payment_method: "cash",
          description: "",
          type: "income"
        });
        toast({
          title: "نجح حفظ المعاملة",
          description: "تم حفظ المعاملة المالية بنجاح",
        });
        fetchPaymentStats();
      } else {
        throw new Error('Failed to save transaction');
      }
    } catch (error) {
      toast({
        title: "خطأ في حفظ المعاملة",
        description: "حدث خطأ أثناء حفظ المعاملة المالية",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="default" className="bg-green-100 text-green-800">مكتملة</Badge>;
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">معلقة</Badge>;
      case "failed":
        return <Badge variant="destructive">فاشلة</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    return type === "income" ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 font-arabic">إدارة المعاملات المالية</h1>
          <p className="mt-2 text-gray-600 font-arabic">
            تتبع وإدارة جميع المعاملات المالية والمدفوعات
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-arabic">إجمالي الإيرادات</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{paymentStats.total_revenue.toLocaleString()} ر.س</div>
              <p className="text-xs text-muted-foreground font-arabic">
                الشهر الحالي: {paymentStats.monthly_revenue.toLocaleString()} ر.س
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-arabic">إجمالي المصروفات</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{paymentStats.total_expenses.toLocaleString()} ر.س</div>
              <p className="text-xs text-muted-foreground font-arabic">
                الشهر الحالي: {paymentStats.monthly_expenses.toLocaleString()} ر.س
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-arabic">المدفوعات المكتملة</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{paymentStats.completed_payments}</div>
              <p className="text-xs text-muted-foreground font-arabic">معاملة مكتملة</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-arabic">المدفوعات المعلقة</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{paymentStats.pending_payments}</div>
              <p className="text-xs text-muted-foreground font-arabic">معاملة معلقة</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="transactions" className="font-arabic">المعاملات</TabsTrigger>
            <TabsTrigger value="settings" className="font-arabic">الإعدادات</TabsTrigger>
          </TabsList>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            {/* Filters and Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="font-arabic">البحث والتصفية</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="البحث في المعاملات..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pr-10 font-arabic"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <select 
                      value={filterType} 
                      onChange={(e) => setFilterType(e.target.value as any)}
                      className="px-3 py-2 border rounded-md bg-white font-arabic"
                    >
                      <option value="all">جميع الأنواع</option>
                      <option value="income">إيرادات</option>
                      <option value="expense">مصروفات</option>
                    </select>
                    <select 
                      value={filterStatus} 
                      onChange={(e) => setFilterStatus(e.target.value as any)}
                      className="px-3 py-2 border rounded-md bg-white font-arabic"
                    >
                      <option value="all">جميع الحالات</option>
                      <option value="completed">مكتملة</option>
                      <option value="pending">معلقة</option>
                      <option value="failed">فاشلة</option>
                    </select>
                    <Dialog open={showNewPaymentDialog} onOpenChange={setShowNewPaymentDialog}>
                      <DialogTrigger asChild>
                        <Button className="font-arabic">
                          <Plus className="h-4 w-4 ml-2" />
                          إضافة معاملة
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle className="font-arabic">إضافة معاملة جديدة</DialogTitle>
                          <DialogDescription className="font-arabic">
                            قم بإدخال بيانات المعاملة المالية الجديدة
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label className="font-arabic">اسم المريض</Label>
                            <Input
                              value={newPayment.patient_name}
                              onChange={(e) => setNewPayment(prev => ({ ...prev, patient_name: e.target.value }))}
                              placeholder="أدخل اسم المريض"
                              className="font-arabic"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="font-arabic">نوع الخدمة</Label>
                            <select
                              value={newPayment.service_type}
                              onChange={(e) => setNewPayment(prev => ({ ...prev, service_type: e.target.value }))}
                              className="w-full px-3 py-2 border rounded-md bg-white font-arabic"
                            >
                              <option value="">اختر نوع الخدمة</option>
                              <option value="تنظيف">تنظيف الأسنان</option>
                              <option value="حشوات">حشوات الأسنان</option>
                              <option value="تقويم">تقويم الأسنان</option>
                              <option value="زراعة">زراعة الأسنان</option>
                              <option value="تبييض">تبييض الأسنان</option>
                              <option value="أخرى">خدمة أخرى</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <Label className="font-arabic">المبلغ</Label>
                            <Input
                              type="number"
                              value={newPayment.amount}
                              onChange={(e) => setNewPayment(prev => ({ ...prev, amount: e.target.value }))}
                              placeholder="أدخل المبلغ"
                              className="font-arabic"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="font-arabic">طريقة الدفع</Label>
                            <select
                              value={newPayment.payment_method}
                              onChange={(e) => setNewPayment(prev => ({ ...prev, payment_method: e.target.value }))}
                              className="w-full px-3 py-2 border rounded-md bg-white font-arabic"
                            >
                              <option value="cash">نقداً</option>
                              <option value="card">بطاقة ائتمان</option>
                              <option value="transfer">تحويل بنكي</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <Label className="font-arabic">نوع المعاملة</Label>
                            <select
                              value={newPayment.type}
                              onChange={(e) => setNewPayment(prev => ({ ...prev, type: e.target.value as "income" | "expense" }))}
                              className="w-full px-3 py-2 border rounded-md bg-white font-arabic"
                            >
                              <option value="income">إيراد</option>
                              <option value="expense">مصروف</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <Label className="font-arabic">وصف المعاملة</Label>
                            <Textarea
                              value={newPayment.description}
                              onChange={(e) => setNewPayment(prev => ({ ...prev, description: e.target.value }))}
                              placeholder="أدخل وصف المعاملة"
                              className="font-arabic"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={processPayment} disabled={isLoading} className="font-arabic">
                            {isLoading ? "جاري الحفظ..." : "حفظ المعاملة"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transactions Table */}
            <Card>
              <CardHeader>
                <CardTitle className="font-arabic">قائمة المعاملات</CardTitle>
                <CardDescription className="font-arabic">
                  عرض جميع المعاملات المالية مع إمكانية البحث والتصفية
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-arabic">التاريخ</TableHead>
                      <TableHead className="font-arabic">المريض</TableHead>
                      <TableHead className="font-arabic">الخدمة</TableHead>
                      <TableHead className="font-arabic">المبلغ</TableHead>
                      <TableHead className="font-arabic">النوع</TableHead>
                      <TableHead className="font-arabic">الحالة</TableHead>
                      <TableHead className="font-arabic">طريقة الدفع</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-arabic">
                          {new Date(transaction.date).toLocaleDateString('ar-SA')}
                        </TableCell>
                        <TableCell className="font-arabic">{transaction.patient_name || "-"}</TableCell>
                        <TableCell className="font-arabic">{transaction.service_type || transaction.category}</TableCell>
                        <TableCell className="font-arabic">
                          <span className={transaction.type === "income" ? "text-green-600" : "text-red-600"}>
                            {transaction.type === "income" ? "+" : "-"}{transaction.amount.toLocaleString()} ر.س
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getTypeIcon(transaction.type)}
                            <span className="font-arabic">
                              {transaction.type === "income" ? "إيراد" : "مصروف"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                        <TableCell className="font-arabic">
                          {transaction.payment_method === "cash" ? "نقداً" :
                           transaction.payment_method === "card" ? "بطاقة ائتمان" :
                           transaction.payment_method === "transfer" ? "تحويل بنكي" :
                           transaction.payment_method}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {filteredTransactions.length === 0 && (
                  <div className="text-center py-8 text-gray-500 font-arabic">
                    لا توجد معاملات مطابقة للبحث
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-arabic">إعدادات المدفوعات</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="font-arabic">العملة الافتراضية</Label>
                  <div className="p-3 border rounded-md bg-gray-50 font-arabic">
                    ريال سعودي (SAR)
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="font-arabic">طرق الدفع المقبولة</Label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-reverse space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span className="font-arabic">نقداً</span>
                    </label>
                    <label className="flex items-center space-x-reverse space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span className="font-arabic">بطاقة ائتمان</span>
                    </label>
                    <label className="flex items-center space-x-reverse space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span className="font-arabic">تحويل بنكي</span>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
