// خدمة الإشعارات للـ SMS والواتس آب
interface NotificationData {
  phone: string;
  message: string;
  type: 'sms' | 'whatsapp';
  scheduledFor?: Date;
}

interface BookingNotificationData {
  patientName: string;
  phone: string;
  appointmentDate: string;
  appointmentTime: string;
  doctorName: string;
  service: string;
  bookingNumber: string;
}

// محاكاة إرسال SMS
async function sendSMS(phone: string, message: string): Promise<boolean> {
  try {
    console.log(`📱 إرسال SMS إلى ${phone}:`);
    console.log(`📄 النص: ${message}`);
    
    // هنا يتم دمج مع خدمة SMS فعلية مثل Twilio
    // في الوقت الحالي سنحاكي الإرسال
    
    // محاكاة تأخير الشبكة
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // محاكاة نجاح الإرسال 90% من الوقت
    const success = Math.random() > 0.1;
    
    if (success) {
      console.log(`✅ تم إرسال SMS بنجاح إلى ${phone}`);
      return true;
    } else {
      console.log(`❌ فشل إرسال SMS إلى ${phone}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ خطأ في إرسال SMS إلى ${phone}:`, error);
    return false;
  }
}

// محاكاة إرسال رسالة واتس آب
async function sendWhatsApp(phone: string, message: string): Promise<boolean> {
  try {
    console.log(`📱 إرسال رسالة واتس آب إلى ${phone}:`);
    console.log(`📄 النص: ${message}`);
    
    // هنا يتم دمج مع WhatsApp Business API
    // في الوقت الحالي سنحاكي الإرسال
    
    // محاكاة تأخير الشبكة
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // محاكاة نجاح الإرسال 95% من الوقت
    const success = Math.random() > 0.05;
    
    if (success) {
      console.log(`✅ تم إرسال رسالة واتس آب بنجاح إلى ${phone}`);
      return true;
    } else {
      console.log(`❌ فشل إرسال رسالة واتس آب إلى ${phone}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ خطأ في إرسال رسالة واتس آب إلى ${phone}:`, error);
    return false;
  }
}

// إرسال إشعار تأكيد الحجز
export async function sendBookingConfirmation(data: BookingNotificationData): Promise<{sms: boolean, whatsapp: boolean}> {
  const message = `
🦷 عيادة الدكتور كمال الملصي

عزيزي/عزيزتي ${data.patientName}،

تم تأكيد حجزك بنجاح!

📅 التاريخ: ${data.appointmentDate}
🕐 الوقت: ${data.appointmentTime}
👨‍⚕️ الطبيب: ${data.doctorName}
🔬 الخدمة: ${data.service}
📋 رقم الحجز: ${data.bookingNumber}

📍 العنوان: شارع المقالح -حي الاصبحي امام سيتي ماكس
📞 للاستفسار: 967777775545

نتطلع لرؤيتك! 😊
  `.trim();

  // إرسال الإشعارات بالتوازي
  const [smsResult, whatsappResult] = await Promise.all([
    sendSMS(data.phone, message),
    sendWhatsApp(data.phone, message)
  ]);

  return {
    sms: smsResult,
    whatsapp: whatsappResult
  };
}

// إرسال تذكير قبل الموعد بيوم واحد
export async function sendAppointmentReminder(data: BookingNotificationData): Promise<{sms: boolean, whatsapp: boolean}> {
  const message = `
🔔 تذكير موعد - عيادة الدكتور كمال الملصي

عزيزي/عزيزتي ${data.patientName}،

نذكرك بموعدك غداً:

📅 التاريخ: ${data.appointmentDate}
🕐 الوقت: ${data.appointmentTime}
👨‍⚕️ الطبيب: ${data.doctorName}
🔬 الخدمة: ${data.service}

💡 نصائح مهمة:
- يرجى الحضور قبل 15 دقيقة من الموعد
- إحضار بطاقة الهوية
- إذا كان لديك أشعة سابقة، يرجى إحضارها

📞 للطوارئ أو التأجيل: 967777775545

نتطلع لرؤيتك! 🦷
  `.trim();

  // إرسال التذكيرات بالتوازي
  const [smsResult, whatsappResult] = await Promise.all([
    sendSMS(data.phone, message),
    sendWhatsApp(data.phone, message)
  ]);

  return {
    sms: smsResult,
    whatsapp: whatsappResult
  };
}

// جدولة إرسال التذكيرات
export function scheduleReminder(data: BookingNotificationData): void {
  const appointmentDate = new Date(data.appointmentDate);
  const reminderDate = new Date(appointmentDate);
  reminderDate.setDate(reminderDate.getDate() - 1); // ق��ل يوم واحد
  reminderDate.setHours(10, 0, 0, 0); // في الساعة 10 صباحاً

  const now = new Date();
  const timeUntilReminder = reminderDate.getTime() - now.getTime();

  if (timeUntilReminder > 0) {
    console.log(`⏰ تم جدولة تذكير للمريض ${data.patientName} في ${reminderDate.toLocaleString('ar')}`);
    
    setTimeout(async () => {
      console.log(`🔔 إرسال تذكير للمريض ${data.patientName}`);
      const result = await sendAppointmentReminder(data);
      console.log(`📊 نتيجة التذكير - SMS: ${result.sms ? '✅' : '❌'}, WhatsApp: ${result.whatsapp ? '✅' : '❌'}`);
    }, timeUntilReminder);
  } else {
    console.log(`⚠️ الموعد قريب جداً - لن يتم إرسال تذكير للمريض ${data.patientName}`);
  }
}

// دالة شاملة للتعامل مع إشعارات الحجز
export async function handleBookingNotifications(data: BookingNotificationData): Promise<void> {
  try {
    console.log(`🚀 بدء إرسال إشعارات الحجز للمريض ${data.patientName}`);
    
    // إرسال تأكيد فوري
    const confirmationResult = await sendBookingConfirmation(data);
    console.log(`📊 نتيجة التأكيد - SMS: ${confirmationResult.sms ? '✅' : '❌'}, WhatsApp: ${confirmationResult.whatsapp ? '✅' : '❌'}`);
    
    // جدولة التذكير
    scheduleReminder(data);
    
    console.log(`✅ تم إعداد جميع إشعارات الحجز للمريض ${data.patientName}`);
  } catch (error) {
    console.error(`❌ خطأ في التعامل مع إشعارات الحجز:`, error);
  }
}

// تصدير الدوال
export {
  sendSMS,
  sendWhatsApp,
  NotificationData,
  BookingNotificationData
};
