import Database from "better-sqlite3";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log("🗑️ بدء عملية حذف البيانات التجريبية...");

try {
  // إنشاء اتصال قاعدة البيانات
  const dbPath = join(__dirname, "clinic_database.sqlite");
  const db = new Database(dbPath);

  console.log("📊 التحقق من البيانات الحالية...");

  // التحقق من وجود بيانات المدير
  const adminCheck = db.prepare("SELECT id, name, email, role FROM users WHERE email = 'admin@dkalmoli.com'").get();
  console.log("👤 بيانات المدير:", adminCheck);

  // عرض جم��ع المستخدمين
  const allUsers = db.prepare("SELECT id, name, email, role FROM users").all();
  console.log("👥 جميع المستخدمين:", allUsers);

  // تعطيل foreign key constraints مؤقتاً
  db.pragma("foreign_keys = OFF");

  // حذف البيانات التجريبية
  console.log("🗑️ حذف المعاملات المالية...");
  const deleteTransactions = db.prepare("DELETE FROM financial_transactions").run();
  console.log(`✅ تم حذف ${deleteTransactions.changes} معاملة مالية`);

  console.log("🗑️ حذف المواعيد...");
  const deleteAppointments = db.prepare("DELETE FROM appointments").run();
  console.log(`✅ تم حذف ${deleteAppointments.changes} موعد`);

  console.log("🗑️ حذف المرضى...");
  const deletePatients = db.prepare("DELETE FROM patients").run();
  console.log(`✅ تم حذف ${deletePatients.changes} مريض`);

  console.log("🗑️ حذف الأطباء...");
  const deleteDoctors = db.prepare("DELETE FROM doctors").run();
  console.log(`✅ تم حذف ${deleteDoctors.changes} طبيب`);

  console.log("🗑️ حذف جميع المستخدمين...");
  const deleteUsers = db.prepare("DELETE FROM users").run();
  console.log(`✅ تم حذف ${deleteUsers.changes} مستخدم`);

  // حذف سجلات النشاط والإشعارات
  try {
    const deleteActivityLogs = db.prepare("DELETE FROM activity_logs").run();
    console.log(`✅ تم حذف ${deleteActivityLogs.changes} سجل نشاط`);
  } catch (error) {
    console.log("⚠️ تعذر حذف سجلات النشاط:", error.message);
  }

  try {
    const deleteNotifications = db.prepare("DELETE FROM notifications").run();
    console.log(`✅ تم حذف ${deleteNotifications.changes} إشعار`);
  } catch (error) {
    console.log("⚠️ تعذر حذف الإشعارات:", error.message);
  }

  // إعادة تعيين AUTO_INCREMENT للجداول الرئيسية
  const resetTables = ['users', 'patients', 'doctors', 'appointments', 'services', 'financial_transactions'];
  for (const table of resetTables) {
    try {
      db.prepare(`DELETE FROM sqlite_sequence WHERE name = '${table}'`).run();
      console.log(`🔄 تم إعادة تعيين تسلسل جدول ${table}`);
    } catch (error) {
      console.log(`⚠️ تعذر إعادة تعيين تسلسل جدول ${table}:`, error.message);
    }
  }

  // إعادة تفعيل foreign key constraints
  db.pragma("foreign_keys = ON");

  console.log("✅ تم حذف جميع البيانات ��لتجريبية بنجاح!");

  // التحقق من النتيجة
  const remainingUsers = db.prepare("SELECT COUNT(*) as count FROM users").get();
  console.log(`📊 عدد المستخدمين المتبقين: ${remainingUsers.count}`);

  const remainingPatients = db.prepare("SELECT COUNT(*) as count FROM patients").get();
  console.log(`📊 عدد المرضى المتبقين: ${remainingPatients.count}`);

  const remainingAppointments = db.prepare("SELECT COUNT(*) as count FROM appointments").get();
  console.log(`📊 عدد المواعيد المتبقية: ${remainingAppointments.count}`);

  // إغلاق الاتصال
  db.close();

  console.log("🎉 تمت العملية بنجاح! النظام الآن نظيف وجاهز للاستخدام الفعلي.");

} catch (error) {
  console.error("❌ خطأ في حذف البيانات التجريبية:", error);
  process.exit(1);
}
