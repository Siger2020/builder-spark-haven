import express from 'express';
import { db } from '../database/index.js';
import { handleBookingNotifications } from '../services/notifications.js';

const router = express.Router();

// إنشاء حجز جديد
router.post('/', async (req, res) => {
  try {
    const { 
      name, 
      phone, 
      email, 
      date, 
      time, 
      service, 
      notes, 
      bookingNumber,
      doctorName 
    } = req.body;
    
    // التحقق من وجود البيانات المطلوبة
    if (!name || !phone || !date || !time || !service) {
      return res.status(400).json({ 
        success: false, 
        error: 'جميع الحقول المطلوبة يجب أن تكون مملوءة' 
      });
    }

    // تنسيق رقم الهاتف
    const formattedPhone = phone.startsWith('967') ? phone : `967${phone.replace(/^0+/, '')}`;
    
    // التحقق من وجود مريض أو إنشاء مريض جديد
    let patientId;
    let doctorId = null; // سيتم تحديده لاحقاً
    let serviceId = 1; // افتراضي للخدمة الأولى

    try {
      // البحث عن مريض موجود بالهاتف أو البريد أو الاسم
      const existingPatient = db.prepare(`
        SELECT p.id, u.name FROM patients p
        JOIN users u ON p.user_id = u.id
        WHERE u.phone = ? OR (u.email = ? AND u.email != '') OR (u.name = ? AND u.phone = ?)
        ORDER BY u.created_at DESC
        LIMIT 1
      `).get(formattedPhone, email || '', name, formattedPhone);

      if (existingPatient) {
        patientId = existingPatient.id;
        console.log(`📋 استخدام مريض موجود: ${existingPatient.name} (ID: ${patientId})`);
      } else {
        // التحقق من وجود مستخدم بنفس البريد الإلكتروني
        let finalEmail = email;
        if (email) {
          const existingEmailUser = db.prepare(`
            SELECT id FROM users WHERE email = ?
          `).get(email);

          // إذا كان البريد موجود، نستخدم بريد فارغ أو نضيف رقم عشوائي
          if (existingEmailUser) {
            finalEmail = `${email.split('@')[0]}_${Date.now()}@${email.split('@')[1]}`;
            console.log(`📧 البريد الإلكتروني موجود، سيتم استخدام: ${finalEmail}`);
          }
        }

        // إنشاء مستخدم جديد فقط إذا لم يوجد
        const insertUser = db.prepare(`
          INSERT INTO users (name, phone, email, password, role, created_at, updated_at)
          VALUES (?, ?, ?, ?, 'patient', datetime('now'), datetime('now'))
        `);
        const userResult = insertUser.run(name, formattedPhone, finalEmail || '', 'temp_password');

        // إنشاء مريض جديد
        const insertPatient = db.prepare(`
          INSERT INTO patients (user_id, patient_number, created_at, updated_at)
          VALUES (?, ?, datetime('now'), datetime('now'))
        `);
        const patientNumber = `PAT${Date.now().toString().slice(-6)}`;
        const patientResult = insertPatient.run(userResult.lastInsertRowid, patientNumber);
        patientId = patientResult.lastInsertRowid;
        console.log(`👤 إنشاء مريض جديد: ${name} (ID: ${patientId})`);
      }

      // البحث عن معرف الخدمة بناءً على الاسم
      const serviceRecord = db.prepare(`
        SELECT id FROM services WHERE name LIKE ? LIMIT 1
      `).get(`%${service}%`);

      if (serviceRecord) {
        serviceId = serviceRecord.id;
      }

    } catch (error) {
      console.error('خطأ في إنشاء المريض:', error);
      // في حالة فشل إنشاء المريض، نحاول إنشاء مستخدم ومريض بشكل منفصل
      try {
        // التحقق من وجود مستخدم بنفس البريد الإلكتروني
        let finalEmail = email;
        if (email) {
          const existingEmailUser = db.prepare(`
            SELECT id FROM users WHERE email = ?
          `).get(email);

          if (existingEmailUser) {
            finalEmail = `${email.split('@')[0]}_${Date.now()}@${email.split('@')[1]}`;
            console.log(`📧 البريد الإلكتروني موجود (المحاولة الثانية), سيتم استخدام: ${finalEmail}`);
          }
        }

        const insertUser = db.prepare(`
          INSERT INTO users (name, phone, email, password, role, created_at, updated_at)
          VALUES (?, ?, ?, ?, 'patient', datetime('now'), datetime('now'))
        `);
        const userResult = insertUser.run(name, formattedPhone, finalEmail || '', 'temp_password');

        const insertPatient = db.prepare(`
          INSERT INTO patients (user_id, patient_number, created_at, updated_at)
          VALUES (?, ?, datetime('now'), datetime('now'))
        `);
        const patientNumber = `PAT${Date.now().toString().slice(-6)}`;
        const patientResult = insertPatient.run(userResult.lastInsertRowid, patientNumber);
        patientId = patientResult.lastInsertRowid;
        console.log(`👤 إنشاء مريض جديد (المحاولة الثانية): ${name} (ID: ${patientId})`);
      } catch (secondError) {
        console.error('فشل في إنشاء المريض في المحاولة الثانية:', secondError);

        // تحديد نوع الخطأ وإرسال رسالة مناسبة
        let errorMessage = 'خطأ في إنشاء بيانات المريض.';
        if (secondError.code === 'SQLITE_CONSTRAINT_UNIQUE') {
          errorMessage = 'يبدو أن هناك حساب موجود بنفس البيانات. يرجى المحاولة مرة أخرى.';
        }

        return res.status(500).json({
          success: false,
          error: errorMessage
        });
      }
    }

    console.log(`📝 إنشاء موعد جديد:`, {
      bookingNumber,
      patientId,
      doctorId,
      serviceId,
      date,
      time,
      service
    });

    // حفظ الحجز في قاعدة البيانات
    const stmt = db.prepare(`
      INSERT INTO appointments (
        appointment_number,
        patient_id,
        doctor_id,
        service_id,
        appointment_date,
        appointment_time,
        chief_complaint,
        notes,
        status,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'scheduled', datetime('now'), datetime('now'))
    `);

    const result = stmt.run(
      bookingNumber,
      patientId,
      doctorId,
      serviceId,
      date,
      time,
      service,
      notes || ''
    );

    console.log(`✅ تم إنشاء الموعد بنجاح:`, {
      appointmentId: result.lastInsertRowid,
      bookingNumber,
      patientId
    });
    
    // إعداد بيانات الإشعارات
    const notificationData = {
      patientName: name,
      phone: formattedPhone,
      appointmentDate: date,
      appointmentTime: time,
      doctorName: doctorName || 'د. كمال الملصي',
      service: service,
      bookingNumber: bookingNumber
    };
    
    // إرسال الإشعارات في الخلفية (لا ننتظر النتيجة)
    handleBookingNotifications(notificationData).catch(error => {
      console.error('خطأ في إرسال الإشعارات:', error);
    });
    
    res.json({ 
      success: true, 
      data: {
        id: result.lastInsertRowid,
        bookingNumber: bookingNumber,
        message: 'تم إنشاء الحجز بنجاح وسيتم إرسال إشعارات التأكيد'
      }
    });
    
  } catch (error) {
    console.error('Error creating booking:', error);

    // تحديد نوع الخطأ وإرسال رسالة مناسبة
    let errorMessage = 'خطأ في إنشاء الحجز';
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      errorMessage = 'يوجد حجز مماثل في النظام. يرجى التحقق من البيانات المدخلة.';
    } else if (error.code === 'SQLITE_CONSTRAINT_NOTNULL') {
      errorMessage = 'يرجى التأكد من ملء جميع الحقول المطلوبة.';
    }

    res.status(500).json({
      success: false,
      error: errorMessage
    });
  }
});

// الحصول على جميع الحجوزات
router.get('/', async (req, res) => {
  try {
    const bookings = db.prepare(`
      SELECT
        a.*,
        u.name as patient_name,
        u.phone,
        u.email,
        s.name as service_name,
        d_user.name as doctor_name
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN users u ON p.user_id = u.id
      LEFT JOIN services s ON a.service_id = s.id
      LEFT JOIN doctors d ON a.doctor_id = d.id
      LEFT JOIN users d_user ON d.user_id = d_user.id
      ORDER BY a.appointment_date DESC, a.appointment_time DESC
    `).all();
    
    res.json({ 
      success: true, 
      data: bookings 
    });
    
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ 
      success: false, 
      error: 'خطأ في جلب الحجوزات' 
    });
  }
});

// الحصول على حجز محدد
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const booking = db.prepare(`
      SELECT
        a.*,
        u.name as patient_name,
        u.phone,
        u.email,
        s.name as service_name,
        d_user.name as doctor_name
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN users u ON p.user_id = u.id
      LEFT JOIN services s ON a.service_id = s.id
      LEFT JOIN doctors d ON a.doctor_id = d.id
      LEFT JOIN users d_user ON d.user_id = d_user.id
      WHERE a.id = ?
    `).get(id);
    
    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        error: 'الحجز غير موجو��' 
      });
    }
    
    res.json({ 
      success: true, 
      data: booking 
    });
    
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ 
      success: false, 
      error: 'خطأ ��ي جلب الحجز' 
    });
  }
});

// تحديث حالة الحجز
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        error: 'حالة الحجز غير صالحة' 
      });
    }
    
    const stmt = db.prepare(`
      UPDATE appointments 
      SET status = ?, updated_at = datetime('now')
      WHERE id = ?
    `);
    
    const result = stmt.run(status, id);
    
    if (result.changes === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'الحجز غير موجود' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'تم تحديث حالة الحجز بنجاح' 
    });
    
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ 
      success: false, 
      error: 'خطأ في تحديث حالة الحجز' 
    });
  }
});

export default router;
