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
    let doctorId = 1; // افتراضي للدكتور الأول
    let serviceId = 1; // افتراضي للخدمة الأولى

    try {
      // البحث عن مريض موجود
      const existingPatient = db.prepare(`
        SELECT p.id FROM patients p
        JOIN users u ON p.user_id = u.id
        WHERE u.phone = ? OR u.email = ?
      `).get(formattedPhone, email);

      if (existingPatient) {
        patientId = existingPatient.id;
      } else {
        // إنشاء مستخدم جديد
        const insertUser = db.prepare(`
          INSERT INTO users (name, phone, email, role, created_at, updated_at)
          VALUES (?, ?, ?, 'patient', datetime('now'), datetime('now'))
        `);
        const userResult = insertUser.run(name, formattedPhone, email);

        // إنشاء مريض جديد
        const insertPatient = db.prepare(`
          INSERT INTO patients (user_id, patient_number, created_at, updated_at)
          VALUES (?, ?, datetime('now'), datetime('now'))
        `);
        const patientNumber = `PAT${Date.now().toString().slice(-6)}`;
        const patientResult = insertPatient.run(userResult.lastInsertRowid, patientNumber);
        patientId = patientResult.lastInsertRowid;
      }

      // البحث عن معرف الخدمة بناءً على الاسم
      const serviceRecord = db.prepare(`
        SELECT id FROM services WHERE name LIKE ? LIMIT 1
      `).get(`%${service}%`);

      if (serviceRecord) {
        serviceId = serviceRecord.id;
      }

    } catch (error) {
      console.log('خطأ في إنشاء المريض، سيتم استخدام معرف افتراضي');
      patientId = 1;
    }

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
      console.error('خط�� في إرسال الإشعارات:', error);
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
    res.status(500).json({ 
      success: false, 
      error: 'خطأ في إنشاء الحجز' 
    });
  }
});

// الحصول على جميع الحجوزات
router.get('/', async (req, res) => {
  try {
    const bookings = db.prepare(`
      SELECT * FROM appointments 
      ORDER BY appointment_date DESC, appointment_time DESC
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
      SELECT * FROM appointments WHERE id = ?
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
      error: 'خطأ في جلب الحجز' 
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
