import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  Receipt
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
      return <Badge className="bg-yellow-100 text-yellow-800">��دفوع جزئي��ً</Badge>;
    case "pending":
      return <Badge className="bg-red-100 text-red-800">غير ��دفوع</Badge>;
    default:
      return <Badge variant="secondary">غير محدد</Badge>;
  }
};

export default function Transactions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

  // Calculate totals
  const totalRevenue = transactions.reduce((sum, t) => sum + t.paid, 0);
  const totalPending = transactions.reduce((sum, t) => sum + t.remaining, 0);
  const totalTransactions = transactions.reduce((sum, t) => sum + t.amount, 0);

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || transaction.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handlePayment = (transaction: any) => {
    setSelectedTransaction(transaction);
    setIsPaymentDialogOpen(true);
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
                {transactions.length} معاملة هذا الشهر
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
                من إجمالي المبالغ المطلوبة
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList className="font-arabic">
            <TabsTrigger value="transactions">المعاملات</TabsTrigger>
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
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="font-arabic">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all" className="font-arabic">جميع الحالات</SelectItem>
                        <SelectItem value="paid" className="font-arabic">مدفوع</SelectItem>
                        <SelectItem value="partial" className="font-arabic">مدفوع جزئياً</SelectItem>
                        <SelectItem value="pending" className="font-arabic">غير مدفوع</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
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
                        <TableCell>{transaction.amount.toLocaleString()} ريال</TableCell>
                        <TableCell className="text-green-600">{transaction.paid.toLocaleString()} ريال</TableCell>
                        <TableCell className="text-red-600">{transaction.remaining.toLocaleString()} ريال</TableCell>
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

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-arabic">التقارير المالية</CardTitle>
                <CardDescription className="font-arabic">
                  تقارير شاملة عن الإيرادات والمصروفات
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
                      تقرير الإيرادات
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
                  <Label className="font-arabic">العملة الافتراضية</Label>
                  <Select defaultValue="sar">
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
                {selectedTransaction && `للمريض: ${selectedTransaction.patientName} - المبلغ المتبقي: ${selectedTransaction.remaining} ريال`}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="font-arabic">مبلغ الدفعة</Label>
                <Input type="number" placeholder="أدخل المبلغ" className="font-arabic" />
              </div>
              <div className="space-y-2">
                <Label className="font-arabic">طريقة الدفع</Label>
                <Select>
                  <SelectTrigger className="font-arabic">
                    <SelectValue placeholder="اختر طريقة الدفع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash" className="font-arabic">نقداً</SelectItem>
                    <SelectItem value="card" className="font-arabic">بطاقة ائتمانية</SelectItem>
                    <SelectItem value="transfer" className="font-arabic">تحويل بنكي</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-arabic">ملاحظات</Label>
                <Input placeholder="ملاحظات إضافية..." className="font-arabic" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)} className="font-arabic">
                إلغاء
              </Button>
              <Button className="font-arabic">تأكيد الدفع</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
