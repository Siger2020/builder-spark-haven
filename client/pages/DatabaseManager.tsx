import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Database,
  Search,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  BarChart3,
  Eye,
  Loader2,
  AlertCircle,
  CheckCircle,
  Table as TableIcon,
  Play,
  Save,
} from "lucide-react";

interface DatabaseStats {
  [tableName: string]: number;
}

interface TableColumn {
  cid: number;
  name: string;
  type: string;
  notnull: number;
  dflt_value: any;
  pk: number;
}

interface TableData {
  tableName: string;
  columns: TableColumn[];
  rows: any[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalRows: number;
    limit: number;
  };
}

export default function DatabaseManager() {
  const [stats, setStats] = useState<DatabaseStats>({});
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [tableData, setTableData] = useState<TableData | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [customQuery, setCustomQuery] = useState("");
  const [queryResult, setQueryResult] = useState<any>(null);

  // جلب إحصائيات قاعدة البيانات
  useEffect(() => {
    fetchDatabaseStats();
    fetchTables();
  }, []);

  // جلب بيانات الجدول المحدد
  useEffect(() => {
    if (selectedTable) {
      fetchTableData();
    }
  }, [selectedTable, currentPage, searchTerm]);

  const fetchDatabaseStats = async () => {
    try {
      const response = await fetch("/api/database/stats");
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("خطأ في جلب الإحصائيات:", error);
    }
  };

  const fetchTables = async () => {
    try {
      const response = await fetch("/api/database/tables");
      const data = await response.json();
      if (data.success) {
        setTables(data.data.map((t: any) => t.name));
      }
    } catch (error) {
      console.error("خطأ في جلب الجداول:", error);
    }
  };

  const fetchTableData = async () => {
    if (!selectedTable) return;

    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
        search: searchTerm,
      });

      const response = await fetch(
        `/api/database/tables/${selectedTable}?${params}`,
      );
      const data = await response.json();

      if (data.success) {
        setTableData(data.data);
      }
    } catch (error) {
      console.error("خطأ في جلب بيانات الجدول:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record: any) => {
    setEditingRecord(record);
    setFormData({ ...record });
    setIsEditDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingRecord(null);
    setFormData({});
    setIsAddDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      const url = editingRecord
        ? `/api/database/tables/${selectedTable}/${editingRecord.id}`
        : `/api/database/tables/${selectedTable}`;

      const method = editingRecord ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setIsEditDialogOpen(false);
        setIsAddDialogOpen(false);
        fetchTableData();
        fetchDatabaseStats();
      } else {
        alert("خطأ في الحفظ: " + data.error);
      }
    } catch (error) {
      alert("خطأ في الحفظ");
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا السجل؟")) return;

    try {
      const response = await fetch(
        `/api/database/tables/${selectedTable}/${id}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (data.success) {
        fetchTableData();
        fetchDatabaseStats();
      } else {
        alert("خطأ في الحذف: " + data.error);
      }
    } catch (error) {
      alert("خطأ في الحذف");
      console.error(error);
    }
  };

  const executeCustomQuery = async () => {
    if (!customQuery.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/database/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: customQuery }),
      });

      const data = await response.json();
      setQueryResult(data);
    } catch (error) {
      setQueryResult({ success: false, error: "خطأ في تنفيذ الاستعلام" });
    } finally {
      setLoading(false);
    }
  };

  const createBackup = async () => {
    try {
      const response = await fetch("/api/database/backup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `backup_${new Date().toISOString().split("T")[0]}`,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("تم إنشاء النسخة الاحتياطية بنجاح");
      } else {
        alert("خطأ في إنشاء النسخة الاحتياطية");
      }
    } catch (error) {
      alert("خطأ في إنشاء النسخة الاحتياطية");
    }
  };

  const handleBulkCleanup = async () => {
    const confirmMessage =
      "هل أنت متأكد من حذف جميع البيانات؟\n\n" +
      "سيتم حذف:\n" +
      "- جميع المواعيد\n" +
      "- جميع المرضى\n" +
      "- جميع المستخدمين ماعدا حساب مدير النظام\n" +
      "- جميع المعاملات المالية\n" +
      "- جميع التقارير والبيانات الأخرى\n\n" +
      "هذا الإجراء لا يمكن التراجع عنه!";

    if (!confirm(confirmMessage)) return;

    // تأكيد إضافي
    const secondConfirm = prompt(
      "لتأكيد الحذف، اكتب كلمة 'حذف' بدون علامات الاقتباس:"
    );

    if (secondConfirm !== "حذف") {
      alert("تم إلغاء العملية");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/database/cleanup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (data.success) {
        alert(
          `تم تنظيف البيانات بنجاح!\n\n` +
          `تم حذف:\n` +
          `- ${data.data.deletedAppointments} موعد\n` +
          `- ${data.data.deletedPatients} مريض\n` +
          `- ${data.data.deletedUsers} مستخدم\n` +
          `- ${data.data.deletedTransactions} معاملة مالية\n\n` +
          `تم الاحتفاظ بحساب مدير النظام فقط`
        );

        // تحديث الإحصائيات والبيانات
        fetchDatabaseStats();
        setTableData(null);
        setSelectedTable("");
      } else {
        alert("خطأ في تنظيف البيانات: " + data.error);
      }
    } catch (error) {
      alert("خطأ في تنظيف البيانات");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-arabic">
              إدارة قاعدة البيانات
            </h1>
            <p className="text-gray-600 font-arabic">
              عرض وإدارة جميع بيانات النظام
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={createBackup}
              variant="outline"
              className="font-arabic"
            >
              <Download className="h-4 w-4 mr-2" />
              نسخة احتياطية
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="font-arabic">
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="tables">الجداول</TabsTrigger>
            <TabsTrigger value="query">استعلامات مخصصة</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* إحصائيات قاعدة البيانات */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(stats).map(([tableName, count]) => (
                <Card key={tableName}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <TableIcon className="h-5 w-5 text-blue-500" />
                      <div>
                        <div className="text-lg font-bold">{count}</div>
                        <div className="text-sm text-gray-500 font-arabic">
                          {tableName === "users" && "المستخدمين"}
                          {tableName === "patients" && "المرضى"}
                          {tableName === "doctors" && "الأطباء"}
                          {tableName === "appointments" && "المواعيد"}
                          {tableName === "services" && "الخدمات"}
                          {tableName === "medical_reports" && "التقارير الطبية"}
                          {tableName === "financial_transactions" &&
                            "المعاملات المالية"}
                          {tableName === "notifications" && "الإشعارات"}
                          {tableName === "inventory" && "المخزون"}
                          {![
                            "users",
                            "patients",
                            "doctors",
                            "appointments",
                            "services",
                            "medical_reports",
                            "financial_transactions",
                            "notifications",
                            "inventory",
                          ].includes(tableName) && tableName}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* معلومات إضافية */}
            <Card>
              <CardHeader>
                <CardTitle className="font-arabic">
                  معلومات قاعدة البيانات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="font-arabic">إجمالي الجداول</Label>
                    <div className="text-2xl font-bold">{tables.length}</div>
                  </div>
                  <div>
                    <Label className="font-arabic">إجمالي السجلات</Label>
                    <div className="text-2xl font-bold">
                      {Object.values(stats).reduce(
                        (sum, count) => sum + count,
                        0,
                      )}
                    </div>
                  </div>
                  <div>
                    <Label className="font-arabic">حالة قاعدة البيانات</Label>
                    <Badge className="bg-green-100 text-green-800">متصلة</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tables" className="space-y-6">
            {/* اختيار الجدول */}
            <Card>
              <CardHeader>
                <CardTitle className="font-arabic">اختر الجدول</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <Label className="font-arabic">الجدول</Label>
                    <Select
                      value={selectedTable}
                      onValueChange={setSelectedTable}
                    >
                      <SelectTrigger className="font-arabic">
                        <SelectValue placeholder="اختر جدولاً" />
                      </SelectTrigger>
                      <SelectContent>
                        {tables.map((table) => (
                          <SelectItem
                            key={table}
                            value={table}
                            className="font-arabic"
                          >
                            {table}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <Label className="font-arabic">البحث</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="البحث في الجدول..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 font-arabic"
                      />
                    </div>
                  </div>
                  {selectedTable && (
                    <Button onClick={handleAdd} className="font-arabic">
                      <Plus className="h-4 w-4 mr-2" />
                      إضافة سجل
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* بيانات الجدول */}
            {tableData && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-arabic">
                    بيانات جدول {selectedTable}
                  </CardTitle>
                  <CardDescription className="font-arabic">
                    إجمالي {tableData.pagination.totalRows} سجل
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                      <p className="text-gray-600 font-arabic">
                        جاري التحميل...
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              {tableData.columns.map((column) => (
                                <TableHead
                                  key={column.name}
                                  className="font-arabic"
                                >
                                  {column.name}
                                  {column.pk === 1 && (
                                    <Badge variant="outline" className="mr-1">
                                      PK
                                    </Badge>
                                  )}
                                </TableHead>
                              ))}
                              <TableHead className="font-arabic">
                                الإجراءات
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {tableData.rows.map((row, index) => (
                              <TableRow key={index}>
                                {tableData.columns.map((column) => (
                                  <TableCell
                                    key={column.name}
                                    className="font-arabic"
                                  >
                                    {row[column.name]?.toString() || "-"}
                                  </TableCell>
                                ))}
                                <TableCell>
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleEdit(row)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleDelete(row.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      {/* التنقل بين الصفحات */}
                      <div className="flex justify-between items-center mt-4">
                        <div className="text-sm text-gray-600 font-arabic">
                          عرض {(tableData.pagination.currentPage - 1) * 20 + 1}{" "}
                          إلى{" "}
                          {Math.min(
                            tableData.pagination.currentPage * 20,
                            tableData.pagination.totalRows,
                          )}{" "}
                          من أصل {tableData.pagination.totalRows}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setCurrentPage((prev) => Math.max(1, prev - 1))
                            }
                            disabled={currentPage === 1}
                            className="font-arabic"
                          >
                            السابق
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((prev) => prev + 1)}
                            disabled={
                              currentPage >= tableData.pagination.totalPages
                            }
                            className="font-arabic"
                          >
                            التالي
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="query" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-arabic">
                  تنفيذ استعلامات مخصصة
                </CardTitle>
                <CardDescription className="font-arabic">
                  اكتب استعلام SQL مخصص (SELECT فقط)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="font-arabic">��ستعلام SQL</Label>
                  <Textarea
                    placeholder="SELECT * FROM users WHERE role = 'patient';"
                    value={customQuery}
                    onChange={(e) => setCustomQuery(e.target.value)}
                    className="font-mono"
                    rows={6}
                  />
                </div>
                <Button
                  onClick={executeCustomQuery}
                  disabled={loading || !customQuery.trim()}
                  className="font-arabic"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4 mr-2" />
                  )}
                  تنفيذ الاستعلام
                </Button>

                {queryResult && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-arabic">
                        نتيجة الاستعلام
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {queryResult.success ? (
                        <div>
                          <p className="text-sm text-gray-600 mb-4 font-arabic">
                            تم العثور على {queryResult.data.results.length} سجل
                          </p>
                          <div className="overflow-x-auto">
                            <pre className="bg-gray-100 p-4 rounded-lg text-sm">
                              {JSON.stringify(
                                queryResult.data.results,
                                null,
                                2,
                              )}
                            </pre>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-red-600">
                          <AlertCircle className="h-4 w-4" />
                          <span className="font-arabic">
                            {queryResult.error}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* حوار التعديل */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]" dir="rtl">
            <DialogHeader>
              <DialogTitle className="font-arabic">تعديل السجل</DialogTitle>
            </DialogHeader>
            {tableData && (
              <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {tableData.columns
                  .filter(
                    (col) =>
                      col.name !== "id" &&
                      col.name !== "created_at" &&
                      col.name !== "updated_at",
                  )
                  .map((column) => (
                    <div key={column.name} className="space-y-2">
                      <Label className="font-arabic">{column.name}</Label>
                      <Input
                        value={formData[column.name] || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            [column.name]: e.target.value,
                          }))
                        }
                        placeholder={column.type}
                      />
                    </div>
                  ))}
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                className="font-arabic"
              >
                إلغاء
              </Button>
              <Button onClick={handleSave} className="font-arabic">
                حفظ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* حوار الإضافة */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[600px]" dir="rtl">
            <DialogHeader>
              <DialogTitle className="font-arabic">إضافة سجل جديد</DialogTitle>
            </DialogHeader>
            {tableData && (
              <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {tableData.columns
                  .filter(
                    (col) =>
                      col.name !== "id" &&
                      col.name !== "created_at" &&
                      col.name !== "updated_at",
                  )
                  .map((column) => (
                    <div key={column.name} className="space-y-2">
                      <Label className="font-arabic">
                        {column.name}
                        {column.notnull === 1 && (
                          <span className="text-red-500">*</span>
                        )}
                      </Label>
                      <Input
                        value={formData[column.name] || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            [column.name]: e.target.value,
                          }))
                        }
                        placeholder={column.type}
                        required={column.notnull === 1}
                      />
                    </div>
                  ))}
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
                className="font-arabic"
              >
                إلغاء
              </Button>
              <Button onClick={handleSave} className="font-arabic">
                إضافة
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
