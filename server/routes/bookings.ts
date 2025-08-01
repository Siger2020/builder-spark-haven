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
    
    // حفظ الحجز في قاعدة البيانات
    const stmt = db.prepare(`
      INSERT INTO appointments (
        patient_name, 
        phone, 
        email, 
        appointment_date, 
        appointment_time, 
        service_type, 
        notes, 
        booking_number,
        status,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', datetime('now'), datetime('now'))
    `);
    
    const result = stmt.run(
      name, 
      formattedPhone, 
      email, 
      date, 
      time, 
      service, 
      notes || '', 
      bookingNumber
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
