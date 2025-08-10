import express from "express";
import { db } from "../database/index.js";

const router = express.Router();

// تسجيل مستخدم جديد
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    console.log("Registration attempt:", {
      name: name || "MISSING",
      email: email || "MISSING",
      passwordLength: password?.length || "MISSING",
      phone: phone || "MISSING",
      role: role || "MISSING",
      allFields: req.body,
    });

    // التحقق من وجود البيانات المطلوبة
    if (!name || !email || !password || !phone || !role) {
      console.log("Missing required fields:", {
        name: !!name,
        email: !!email,
        password: !!password,
        phone: !!phone,
        role: !!role,
      });
      return res.status(400).json({
        success: false,
        error: "جميع الحقول مطلوبة",
      });
    }

    // التحقق من عدم وجود المستخدم مسبقاً
    const existingUser = db
      .prepare("SELECT id FROM users WHERE email = ?")
      .get(email);

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "المستخدم موجود بالفعل",
      });
    }

    // إضافة المستخدم الجديد
    const stmt = db.prepare(`
      INSERT INTO users (name, email, password, phone, role, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `);

    const result = stmt.run(name, email, password, phone, role);

    // إرجاع بيانات المستخدم بدون كلمة المرور
    const user = {
      id: result.lastInsertRowid,
      name,
      email,
      phone,
      role,
    };

    res.json({
      success: true,
      message: "تم إنشاء الحساب بنجاح",
      user,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      error: "خطأ في إنشاء الحساب",
    });
  }
});

// تسجيل الدخول
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login attempt:", {
      email: email,
      passwordLength: password?.length,
    });

    // التحقق من وجود البيانات المطلوبة
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "البر��د الإلكتروني وكلمة المرور مطلوبان",
      });
    }

    // البحث عن المستخدم بالإيميل أولاً للتشخيص
    const emailCheck = db
      .prepare("SELECT id, name, email, role FROM users WHERE email = ?")
      .get(email);

    console.log("Email check result:", emailCheck);

    // البحث عن المستخدم
    const user = db
      .prepare(
        `
      SELECT id, name, email, phone, role
      FROM users
      WHERE email = ? AND password = ?
    `,
      )
      .get(email, password);

    console.log("Login check result:", user ? "User found" : "User not found");

    if (user) {
      res.json({
        success: true,
        message: "تم تسجيل الدخول بنجاح",
        user,
      });
    } else {
      res.status(401).json({
        success: false,
        error: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      error: "خطأ في تسجيل الدخول",
    });
  }
});

// التحقق من صحة الجلسة
router.get("/verify", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "معرف المستخدم مطلوب",
      });
    }

    const user = db
      .prepare(
        `
      SELECT id, name, email, phone, role 
      FROM users 
      WHERE id = ?
    `,
      )
      .get(userId);

    if (user) {
      res.json({
        success: true,
        user,
      });
    } else {
      res.status(404).json({
        success: false,
        error: "المستخدم غير موجود",
      });
    }
  } catch (error) {
    console.error("Verify error:", error);
    res.status(500).json({
      success: false,
      error: "خطأ في التحقق من الجلسة",
    });
  }
});

// نقطة اختبار للتحقق من بيانات المدير
router.get("/test-admin", async (req, res) => {
  try {
    const admin = db
      .prepare(
        "SELECT id, name, email, password, role FROM users WHERE email = 'admin@dkalmoli.com'",
      )
      .get();

    res.json({
      success: true,
      admin: admin,
    });
  } catch (error) {
    console.error("Test admin error:", error);
    res.status(500).json({
      success: false,
      error: "خطأ في جلب بيانات المدير",
    });
  }
});

// حذف بيانات المدير التجريبية
router.delete("/reset-admin", async (req, res) => {
  try {
    console.log("🗑️ بدء عملية حذف بيانات المدير التجريبية...");

    // حذف حساب المدير
    const deleteResult = db
      .prepare("DELETE FROM users WHERE email = 'admin@dkalmoli.com'")
      .run();

    console.log(`✅ تم حذف ${deleteResult.changes} حساب مدير`);

    // حذف جميع البيانات التجريبية الأخرى
    const tables = [
      'financial_transactions',
      'appointments',
      'patients',
      'doctors'
    ];

    let totalDeleted = 0;
    for (const table of tables) {
      try {
        const result = db.prepare(`DELETE FROM ${table}`).run();
        totalDeleted += result.changes;
        console.log(`🗑️ تم حذف ${result.changes} سجل من جدول ${table}`);
      } catch (error) {
        console.log(`⚠️ تعذر حذف بيانات من جدول ${table}:`, error.message);
      }
    }

    // حذف باقي المستخدمين التجريبيين
    const deleteUsers = db
      .prepare("DELETE FROM users WHERE email LIKE '%@test.com' OR email LIKE '%@dkalmoli.com'")
      .run();

    console.log(`🗑️ تم حذف ${deleteUsers.changes} مستخدم تجريبي`);

    res.json({
      success: true,
      message: "تم حذف جميع البيانات التجريبية بنجاح",
      details: {
        adminDeleted: deleteResult.changes,
        testUsersDeleted: deleteUsers.changes,
        totalRecordsDeleted: totalDeleted,
      },
    });

  } catch (error) {
    console.error("❌ خطأ في حذف البيانات التجريبية:", error);
    res.status(500).json({
      success: false,
      error: "خطأ في حذف البيانات التجريبية",
      details: error.message,
    });
  }
});

// إعادة تهيئة قاعدة البيانات (حذف جميع البيانات)
router.post("/reset-database", async (req, res) => {
  try {
    console.log("🔄 بدء عملية إعادة تهيئة قاعدة البيانات...");

    // قائمة الجداول بالترتيب الصحيح للحذف (بسبب foreign keys)
    const tables = [
      'activity_logs',
      'backups',
      'notifications',
      'invoice_items',
      'invoices',
      'financial_transactions',
      'treatment_sessions',
      'treatment_plans',
      'medical_reports',
      'appointments',
      'inventory',
      'patients',
      'doctors',
      'services',
      'users'
    ];

    let totalDeleted = 0;

    // تعطيل foreign key constraints مؤقتاً
    db.pragma("foreign_keys = OFF");

    for (const table of tables) {
      try {
        const result = db.prepare(`DELETE FROM ${table}`).run();
        totalDeleted += result.changes;
        console.log(`🗑️ تم حذف ${result.changes} سجل من جدول ${table}`);
      } catch (error) {
        console.log(`⚠️ تعذر حذف بيانات من جدول ${table}:`, error.message);
      }
    }

    // إعادة تفعيل foreign key constraints
    db.pragma("foreign_keys = ON");

    // إعادة تعيين AUTO_INCREMENT للجداول
    const resetTables = ['users', 'patients', 'doctors', 'appointments', 'services'];
    for (const table of resetTables) {
      try {
        db.prepare(`DELETE FROM sqlite_sequence WHERE name = '${table}'`).run();
      } catch (error) {
        // تجاهل الأخطاء - قد لا يكون الجدول يستخدم AUTO_INCREMENT
      }
    }

    console.log("✅ تم إعادة تهيئة قاعدة البيانات بنجاح");

    res.json({
      success: true,
      message: "تم إعادة تهيئة قاعدة البيانات بنجاح",
      details: {
        totalRecordsDeleted: totalDeleted,
        tablesReset: tables.length,
      },
    });

  } catch (error) {
    console.error("❌ خطأ في إعادة تهيئة قاعدة البيانات:", error);

    // إعادة تفعيل foreign keys في حالة الخطأ
    try {
      db.pragma("foreign_keys = ON");
    } catch (pragmaError) {
      console.error("خطأ في إعادة تفعيل foreign keys:", pragmaError);
    }

    res.status(500).json({
      success: false,
      error: "خطأ في إعادة تهيئة قاعدة البيانات",
      details: error.message,
    });
  }
});

export default router;
