import express from "express";
import { db } from "../database/index.js";

const router = express.Router();

// تسجيل مستخدم جديد
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // التحقق من وجود البيانات المطلوبة
    if (!name || !email || !password || !phone || !role) {
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

    // التحقق من وجود البيانات المطلوبة
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "البر��د الإلكتروني وكلمة المرور مطلوبان",
      });
    }

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

export default router;
