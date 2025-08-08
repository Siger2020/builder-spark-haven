import Database from "better-sqlite3";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// إنشاء اتصال قاعدة البيانات
const dbPath = join(__dirname, "../../clinic_database.sqlite");
export const db = new Database(dbPath);

// تكوين قاعدة البيانات
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// تهيئة قاعدة البيانات
export async function initializeDatabase() {
  try {
    const schema = readFileSync(join(__dirname, "schema.sql"), "utf8");
    db.exec(schema);
    console.log("✅ تم تهيئة قاعدة البيانات بنجاح");

    // إضافة بيانات تجريبية إذا لم تكن موجودة
    seedDatabase();

    // تحديث وفحص قاعدة البيانات
    try {
      const { updateDatabase, validateDatabaseIntegrity } = await import("./update.js");
      updateDatabase();
      validateDatabaseIntegrity();
    } catch (error) {
      console.log("⚠️ تحديث قاعدة البيانات غير متاح:", error.message);
    }

    // التأكد من وجود حساب المدير
    ensureAdminExists();

    // إصلاح تطابق بيانات المواعيد
    fixAppointmentDataConsistency();

  } catch (error) {
    console.error("❌ خطأ في تهيئة قاعدة البيانات:", error);
    throw error;
  }
}

// إضافة بيانات تجريبية
function seedDatabase() {
  try {
    // التحقق من وجود مستخدمين
    const userCount = db
      .prepare("SELECT COUNT(*) as count FROM users")
      .get() as { count: number };

    if (userCount.count === 0) {
      console.log("📝 إضافة بيانات تجريبية...");

      // إضافة ��لمستخدمين
      const insertUser = db.prepare(`
        INSERT INTO users (name, email, password, phone, role, gender, address) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      const users = [
        [
          "مدير النظام",
          "admin@dkalmoli.com",
          "123456",
          "00967777775545",
          "admin",
          "male",
          "صنعاء، اليمن",
        ],
        [
          "د. سارة أحمد",
          "sara@dkalmoli.com",
          "hashed_password_123",
          "00967771234567",
          "doctor",
          "female",
          "صنعاء، اليمن",
        ],
        [
          "أحمد محمد علي",
          "patient1@test.com",
          "hashed_password_123",
          "00967772345678",
          "patient",
          "male",
          "صنعاء، حي الحصبة",
        ],
        [
          "فاطمة خالد",
          "patient2@test.com",
          "hashed_password_123",
          "00967773456789",
          "patient",
          "female",
          "صنعاء، حي الثورة",
        ],
        [
          "محمد سا��م",
          "patient3@test.com",
          "hashed_password_123",
          "00967774567890",
          "patient",
          "male",
          "صنعاء، حي السبعين",
        ],
        [
          "نورا أحمد",
          "receptionist@dkalmoli.com",
          "hashed_password_123",
          "00967775678901",
          "receptionist",
          "female",
          "صنعاء، اليمن",
        ],
      ];

      const insertUserTransaction = db.transaction((users) => {
        for (const user of users) {
          insertUser.run(...user);
        }
      });

      insertUserTransaction(users);

      // إضافة الأطباء
      const insertDoctor = db.prepare(`
        INSERT INTO doctors (user_id, doctor_number, specialization, license_number, qualification, experience_years, consultation_fee) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      insertDoctor.run(
        1,
        "DOC001",
        "طبيب أسنان عام وتجميل",
        "LIC001",
        "بكالوريوس طب الأسنان - جا��عة صنعاء",
        15,
        50,
      );
      insertDoctor.run(
        2,
        "DOC002",
        "تقويم الأسنان",
        "LIC002",
        "ماجستير تقويم الأسنان",
        8,
        75,
      );

      // إضافة المرضى
      const insertPatient = db.prepare(`
        INSERT INTO patients (user_id, patient_number, insurance_company, medical_history, allergies, blood_type, preferred_doctor_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      insertPatient.run(
        3,
        "PAT001",
        "شركة التأمين الوطنية",
        "لا توجد مشاكل صحية كبيرة",
        "لا توجد حساسيات معروفة",
        "O+",
        1,
      );
      insertPatient.run(
        4,
        "PAT002",
        "التأمين الحكومي",
        "ارتفاع ضغط الدم",
        "حساسية من البنسلين",
        "A+",
        2,
      );
      insertPatient.run(
        5,
        "PAT003",
        null,
        "داء السكري من النوع ا��ثاني",
        "حساسية من الأسبرين",
        "B+",
        1,
      );

      // تنظيف المواعيد القديمة أولاً
      db.prepare("DELETE FROM appointments").run();

      // إضافة مواعيد تجريبية بـ patient_id صحيحة
      const insertAppointment = db.prepare(`
        INSERT INTO appointments (appointment_number, patient_id, doctor_id, service_id, appointment_date, appointment_time, status, chief_complaint)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const today = new Date().toISOString().split("T")[0];
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

      // الحصول على patient_id الصحيحة من جدول patients
      const patients = db.prepare("SELECT id FROM patients ORDER BY id LIMIT 3").all();

      if (patients.length >= 1) {
        insertAppointment.run(
          "APP001",
          patients[0].id,
          1,
          1,
          today,
          "09:00",
          "confirmed",
          "تنظيف دوري",
        );
      }

      if (patients.length >= 2) {
        insertAppointment.run(
          "APP002",
          patients[1].id,
          2,
          3,
          tomorrow,
          "10:30",
          "scheduled",
          "استشارة تقويم",
        );
      }

      if (patients.length >= 3) {
        insertAppointment.run(
          "APP003",
          patients[2].id,
          1,
          2,
          tomorrow,
          "14:00",
          "scheduled",
          "ألم في الضرس",
        );
      }

      // إضافة معاملات مالية تجري��ية
      const insertTransaction = db.prepare(`
        INSERT INTO financial_transactions (transaction_number, patient_id, transaction_type, amount, payment_method, payment_status, description) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      insertTransaction.run(
        "TXN001",
        1,
        "payment",
        50,
        "cash",
        "completed",
        "تنظيف ��لأسنان",
      );
      insertTransaction.run(
        "TXN002",
        2,
        "charge",
        200,
        "card",
        "pending",
        "استشارة تقويم",
      );
      insertTransaction.run(
        "TXN003",
        3,
        "payment",
        100,
        "cash",
        "completed",
        "حشوة سن",
      );

      console.log("✅ تم إضافة البيانات التجريبية بنجاح");
    }
  } catch (error) {
    console.error("❌ خطأ في إضافة البيانات التجريبية:", error);
  }
}

// إصلاح تطابق بيانات ال��واعيد
function fixAppointmentDataConsistency() {
  try {
    console.log("🔧 إصلاح تطابق بيانات المواعيد...");

    // الحصول على جميع المواعيد التي لها patient_id خاطئة
    const invalidAppointments = db.prepare(`
      SELECT a.id, a.appointment_number, a.patient_id
      FROM appointments a
      WHERE NOT EXISTS (
        SELECT 1 FROM patients p WHERE p.id = a.patient_id
      )
    `).all();

    if (invalidAppointments.length > 0) {
      console.log(`🔄 إصلاح ${invalidAppointments.length} موعد بأرقام مرضى خاطئة...`);

      // حذف المواعيد ذات patient_id خاطئة
      const deleteInvalidAppointments = db.prepare(`
        DELETE FROM appointments
        WHERE NOT EXISTS (
          SELECT 1 FROM patients p WHERE p.id = appointments.patient_id
        )
      `);
      deleteInvalidAppointments.run();

      console.log("✅ تم حذف المواعيد ذات الأرقام الخاطئة");
    }

    // التأكد من أن جميع المواعيد الحالية لها أسماء صحيحة
    const validAppointments = db.prepare(`
      SELECT
        a.appointment_number,
        u.name as patient_name,
        u.phone,
        u.email
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN users u ON p.user_id = u.id
    `).all();

    console.log(`✅ ${validAppointments.length} موعد بأسماء صحيحة`);

    for (const apt of validAppointments) {
      console.log(`  - ${apt.appointment_number}: ${apt.patient_name}`);
    }

  } catch (error) {
    console.error("❌ خطأ في إصلاح بيانات المواعيد:", error);
  }
}

// التأكد من وجود حساب المدير
function ensureAdminExists() {
  try {
    // حذف أي حساب مدير موجود لضمان البيانات الصحيحة
    db.prepare("DELETE FROM users WHERE email = 'admin@dkalmoli.com'").run();

    // إضافة حساب المدير الجديد
    const insertAdmin = db.prepare(`
      INSERT INTO users (name, email, password, phone, role, gender, address, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `);

    insertAdmin.run(
      "مدير النظام",
      "admin@dkalmoli.com",
      "123456",
      "00967777775545",
      "admin",
      "male",
      "صنعاء، اليمن"
    );

    console.log("✅ تم إنشاء حساب المدير بنجاح");

    // التحقق من البيانات
    const admin = db.prepare("SELECT id, name, email, role FROM users WHERE email = 'admin@dkalmoli.com'").get();
    console.log("📊 بيانات المدير:", admin);

  } catch (error) {
    console.error("❌ خطأ في إنشاء حساب المدير:", error);
  }
}

// وظائف مساعدة لإدارة قاعدة البيانات

// الحصول على إحصائيات قاعدة البيانات
export function getDatabaseStats() {
  const tables = [
    "users",
    "patients",
    "doctors",
    "appointments",
    "services",
    "medical_reports",
    "treatment_plans",
    "treatment_sessions",
    "financial_transactions",
    "invoices",
    "notifications",
    "inventory",
  ];

  const stats: { [key: string]: number } = {};

  for (const table of tables) {
    try {
      const result = db
        .prepare(`SELECT COUNT(*) as count FROM ${table}`)
        .get() as { count: number };
      stats[table] = result.count;
    } catch (error) {
      stats[table] = 0;
    }
  }

  return stats;
}

// إنشاء نسخة احتياطية
export async function createBackup(backupName?: string) {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const name = backupName || `backup_${timestamp}`;
    const backupPath = join(__dirname, `../../backups/${name}.sqlite`);

    // تأكد من وجود مجلد النسخ الاحتياطية
    const backupsDir = join(__dirname, "../../backups");
    const fs = await import("fs");
    if (!fs.existsSync(backupsDir)) {
      fs.mkdirSync(backupsDir, { recursive: true });
    }

    // إنشاء النسخة الاحتياطية
    await db.backup(backupPath);

    // تسجيل النسخة الاحتياطية في قاعدة البيانات
    const insertBackup = db.prepare(`
      INSERT INTO backups (backup_name, backup_type, file_path, status, completed_at) 
      VALUES (?, ?, ?, ?, ?)
    `);

    const stats = await import("fs").then((fs) => fs.statSync(backupPath));
    insertBackup.run(
      name,
      "full",
      backupPath,
      "completed",
      new Date().toISOString(),
    );

    return { success: true, path: backupPath, size: stats.size };
  } catch (error) {
    console.error("❌ خطأ في إنشاء النسخة الاحتياطية:", error);
    return { success: false, error: error.message };
  }
}

// استعادة النسخة ا��احتياطية
export async function restoreBackup(backupPath: string) {
  try {
    // إغلاق الاتصال الحالي
    db.close();

    // نسخ ملف النس��ة الاحتياطية
    const fs = await import("fs");
    fs.copyFileSync(backupPath, dbPath);

    // إعادة تهيئة الاتصال
    const newDb = new Database(dbPath);
    newDb.pragma("journal_mode = WAL");
    newDb.pragma("foreign_keys = ON");

    return { success: true };
  } catch (error) {
    console.error("❌ خطأ في استعادة النسخة الاحتياطية:", error);
    return { success: false, error: error.message };
  }
}

// تسجيل النشاط
export function logActivity(
  userId: number,
  action: string,
  entityType?: string,
  entityId?: number,
  oldValues?: any,
  newValues?: any,
) {
  try {
    const insertLog = db.prepare(`
      INSERT INTO activity_logs (user_id, action, entity_type, entity_id, old_values, new_values) 
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    insertLog.run(
      userId,
      action,
      entityType || null,
      entityId || null,
      oldValues ? JSON.stringify(oldValues) : null,
      newValues ? JSON.stringify(newValues) : null,
    );
  } catch (error) {
    console.error("❌ خطأ في تسجيل النشاط:", error);
  }
}

// البحث العام في قاعدة البيانات
export function globalSearch(query: string, limit = 50) {
  const results: any[] = [];

  try {
    // البحث في المرضى
    const patientSearch = db.prepare(`
      SELECT u.id, u.name, u.email, u.phone, 'patient' as type, p.patient_number
      FROM users u 
      JOIN patients p ON u.id = p.user_id 
      WHERE u.name LIKE ? OR u.email LIKE ? OR u.phone LIKE ? OR p.patient_number LIKE ?
      LIMIT ?
    `);

    const searchTerm = `%${query}%`;
    const patients = patientSearch.all(
      searchTerm,
      searchTerm,
      searchTerm,
      searchTerm,
      Math.floor(limit / 4),
    );
    results.push(...patients);

    // البحث في المواعيد
    const appointmentSearch = db.prepare(`
      SELECT a.id, a.appointment_number, u.name as patient_name, a.appointment_date, 'appointment' as type
      FROM appointments a 
      JOIN patients p ON a.patient_id = p.id 
      JOIN users u ON p.user_id = u.id 
      WHERE a.appointment_number LIKE ? OR u.name LIKE ?
      LIMIT ?
    `);

    const appointments = appointmentSearch.all(
      searchTerm,
      searchTerm,
      Math.floor(limit / 4),
    );
    results.push(...appointments);

    // البحث في المعاملات المالية
    const transactionSearch = db.prepare(`
      SELECT t.id, t.transaction_number, u.name as patient_name, t.amount, 'transaction' as type
      FROM financial_transactions t 
      JOIN patients p ON t.patient_id = p.id 
      JOIN users u ON p.user_id = u.id 
      WHERE t.transaction_number LIKE ? OR u.name LIKE ?
      LIMIT ?
    `);

    const transactions = transactionSearch.all(
      searchTerm,
      searchTerm,
      Math.floor(limit / 4),
    );
    results.push(...transactions);

    return results;
  } catch (error) {
    console.error("❌ خطأ في البحث:", error);
    return [];
  }
}

// تصدير قاعدة البيانات
export { db as database };
