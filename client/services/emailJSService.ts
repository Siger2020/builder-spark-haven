import emailjs from '@emailjs/browser';
import { EmailJSSettings, validateEmailJSConfig, ConnectionStatus } from '../lib/emailConfig';

export interface NotificationData {
  patientName: string;
  patientEmail: string;
  appointmentId: string;
  appointmentDate: string;
  appointmentTime: string;
  doctorName: string;
  clinicName: string;
  clinicPhone: string;
  clinicAddress: string;
  notes?: string;
}

export type NotificationType = 'confirmation' | 'reminder' | 'cancellation' | 'test';

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export class EmailJSService {
  private config: EmailJSSettings | null = null;
  private connectionStatus: ConnectionStatus = ConnectionStatus.NOT_CONFIGURED;

  // تكوين خدمة EmailJS
  configure(config: EmailJSSettings): { success: boolean; errors?: string[] } {
    const errors = validateEmailJSConfig(config);

    if (errors.length > 0) {
      this.connectionStatus = ConnectionStatus.ERROR;
      console.error('EmailJS configuration errors:', errors);
      return { success: false, errors };
    }

    this.config = config;
    this.connectionStatus = config.enabled ? ConnectionStatus.CONFIGURED : ConnectionStatus.NOT_CONFIGURED;

    // تهيئة EmailJS
    if (config.enabled && config.publicKey) {
      try {
        emailjs.init(config.publicKey);
        console.log('EmailJS initialized successfully with publicKey:', config.publicKey);
      } catch (error) {
        console.error('Error initializing EmailJS:', error);
        this.connectionStatus = ConnectionStatus.ERROR;
        return { success: false, errors: ['خطأ في تهيئة EmailJS'] };
      }
    }

    return { success: true };
  }

  // الحصول على حالة الاتصال
  getConnectionStatus(): ConnectionStatus {
    return this.connectionStatus;
  }

  // التحقق من صحة التكوين
  isConfigured(): boolean {
    return this.config !== null && 
           this.config.enabled && 
           !!this.config.serviceId && 
           !!this.config.templateId && 
           !!this.config.publicKey;
  }

  // اختبار الاتصال
  async testConnection(): Promise<EmailResult> {
    if (!this.isConfigured() || !this.config) {
      return {
        success: false,
        error: 'خدمة البريد الإلكتروني غير مُعَدّة بشكل صحيح. يرجى إدخال Service ID و Template ID و Public Key'
      };
    }

    this.connectionStatus = ConnectionStatus.TESTING;

    try {
      // التحقق من إعداد EmailJS أولاً
      if (!this.config.publicKey || !this.config.serviceId || !this.config.templateId) {
        throw new Error('معلومات EmailJS غير مكتملة');
      }

      // إعادة تهيئة EmailJS للتأكد
      emailjs.init(this.config.publicKey);

      // إرسال بريد اختبار لنفس البريد المُرسِل
      const testData = {
        to_email: this.config.senderEmail,
        to_name: 'مدير النظام',
        from_name: this.config.senderName,
        clinic_name: this.config.senderName,
        test_time: new Date().toLocaleString('ar-EG'),
        message: 'هذا اختبار لصحة إعدادات EmailJS. إذا وصلتك هذه الرسالة، فالنظام يعمل بشكل صحيح!',
        subject: '🧪 اختبار نظام الإشعارات - EmailJS',
        // إضافة البيانات المطلوبة للقالب
        icon: '🧪',
        notification_type: 'اختبار النظام',
        instructions: 'إذا وصلتك هذه الرسالة، فالنظام يعمل بشكل صحيح!',
        appointment_id: 'TEST-' + Date.now(),
        appointment_date: new Date().toLocaleDateString('ar-EG'),
        appointment_time: new Date().toLocaleTimeString('ar-EG'),
        doctor_name: 'نظام الاختبار',
        clinic_phone: 'غير محدد',
        clinic_address: 'غير محدد',
        notes: 'هذه رسالة اختبار',
        current_time: new Date().toLocaleString('ar-EG')
      };

      console.log('Sending test email with data:', testData);
      console.log('EmailJS config:', {
        serviceId: this.config.serviceId,
        templateId: this.config.templateId,
        publicKey: this.config.publicKey ? 'SET' : 'NOT SET'
      });

      const result = await emailjs.send(
        this.config.serviceId,
        this.config.templateId,
        testData
      );

      console.log('EmailJS result:', result);

      if (result.status === 200) {
        this.connectionStatus = ConnectionStatus.CONNECTED;
        return {
          success: true,
          messageId: result.text
        };
      } else {
        this.connectionStatus = ConnectionStatus.ERROR;
        return {
          success: false,
          error: `خطأ في الإرسال - كود الحالة: ${result.status}. تحقق من صحة Service ID و Template ID`
        };
      }
    } catch (error) {
      this.connectionStatus = ConnectionStatus.ERROR;
      console.error('EmailJS test error:', error);

      let errorMessage = 'خطأ غير معروف في الاختبار';

      if (error instanceof Error) {
        if (error.message.includes('Unauthorized')) {
          errorMessage = 'خطأ في الصلاحية - تحقق من صحة Public Key';
        } else if (error.message.includes('Not Found')) {
          errorMessage = 'Service ID أو Template ID غير صحيح';
        } else if (error.message.includes('Bad Request')) {
          errorMessage = 'بيانات الطلب غير صحيحة - تحقق من قالب البريد الإلكتروني';
        } else {
          errorMessage = error.message;
        }
      }

      return {
        success: false,
        error: errorMessage + '. راجع console للمزيد من التفاصيل'
      };
    }
  }

  // إرسال إشعار
  async sendNotification(
    type: NotificationType,
    data: NotificationData
  ): Promise<EmailResult> {
    if (!this.isConfigured() || !this.config) {
      return { 
        success: false, 
        error: 'خدمة البريد الإلكتروني غير مُعَدّة بشكل صحيح' 
      };
    }

    try {
      const templateData = this.prepareTemplateData(type, data);
      
      const result = await emailjs.send(
        this.config.serviceId,
        this.config.templateId,
        templateData
      );

      if (result.status === 200) {
        return { 
          success: true, 
          messageId: result.text 
        };
      } else {
        return { 
          success: false, 
          error: `خطأ في الإرسال: ${result.status}` 
        };
      }
    } catch (error) {
      console.error('EmailJS send error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'خطأ غير معروف في الإرسال' 
      };
    }
  }

  // إرسال بريد اختبار مخصص
  async sendTestEmail(
    toEmail: string,
    recipientName: string = 'مستخدم النظام'
  ): Promise<EmailResult> {
    if (!this.isConfigured() || !this.config) {
      return {
        success: false,
        error: 'خدمة البريد الإلكتروني غير مُعَدّة بشكل صحيح'
      };
    }

    try {
      // إعادة تهيئة EmailJS للتأكد
      emailjs.init(this.config.publicKey);

      const testData = {
        to_email: toEmail,
        to_name: recipientName,
        from_name: this.config.senderName,
        clinic_name: this.config.senderName,
        test_time: new Date().toLocaleString('ar-EG'),
        message: 'تهانينا! تم إرسال هذا البريد بنجاح من نظام الإشعارات. النظام جاهز للاستخدام!',
        subject: '✅ اختبار نظام الإشعارات - تم بنجاح!',
        // إضافة البيانات المطلوبة للقالب
        icon: '✅',
        notification_type: 'رسالة اختبار',
        instructions: 'النظام يعمل بشكل ممتاز! يمكنك الآن استخدام الإشعارات الحقيقية.',
        appointment_id: 'TEST-' + Date.now(),
        appointment_date: new Date().toLocaleDateString('ar-EG'),
        appointment_time: new Date().toLocaleTimeString('ar-EG'),
        doctor_name: 'نظام الاختبار',
        clinic_phone: this.config.senderEmail || 'غير محدد',
        clinic_address: 'نظام الإشعارات الإلكترونية',
        notes: 'هذه رسالة اختبار لتأكيد عمل النظام',
        current_time: new Date().toLocaleString('ar-EG')
      };

      console.log('Sending custom test email to:', toEmail);

      const result = await emailjs.send(
        this.config.serviceId,
        this.config.templateId,
        testData
      );

      if (result.status === 200) {
        return {
          success: true,
          messageId: result.text
        };
      } else {
        return {
          success: false,
          error: `خطأ في الإرسال: ${result.status}`
        };
      }
    } catch (error) {
      console.error('EmailJS test email error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'خطأ غير معروف في إرسال بريد الاختبار'
      };
    }
  }

  // تحضير بيانات القالب حسب نوع الإشعار
  private prepareTemplateData(type: NotificationType, data: NotificationData): any {
    const baseData = {
      to_email: data.patientEmail,
      to_name: data.patientName,
      from_name: this.config?.senderName || 'عيادة الدكتور كمال الملصي',
      patient_name: data.patientName,
      appointment_id: data.appointmentId,
      appointment_date: data.appointmentDate,
      appointment_time: data.appointmentTime,
      doctor_name: data.doctorName,
      clinic_name: data.clinicName,
      clinic_phone: data.clinicPhone,
      clinic_address: data.clinicAddress,
      notes: data.notes || '',
      current_time: new Date().toLocaleString('ar-EG')
    };

    switch (type) {
      case 'confirmation':
        return {
          ...baseData,
          subject: `✅ تأكيد موعدك - ${data.appointmentId}`,
          notification_type: 'تأكيد موعد',
          icon: '✅',
          message: `تم تأكيد موعدك بنجاح في ${data.clinicName}. نتطلع لرؤيتك في الموعد المحدد.`,
          instructions: 'يرجى الحضور قبل 15 دقيقة من الموعد. أحضر معك بطاقة الهوية وأي وثائق طبية سابقة.'
        };

      case 'reminder':
        return {
          ...baseData,
          subject: `⏰ تذكير بموعدك غداً - ${data.appointmentId}`,
          notification_type: 'تذكير موعد',
          icon: '⏰',
          message: `نذكرك بموعدك المحجوز غداً في ${data.clinicName}. نتطلع لرؤيتك!`,
          instructions: 'لا تنس موعدك غداً. في حالة عدم القدرة على الحضور، يرجى الاتصال بنا.'
        };

      case 'cancellation':
        return {
          ...baseData,
          subject: `❌ إلغاء موعدك - ${data.appointmentId}`,
          notification_type: 'إلغاء موعد',
          icon: '❌',
          message: `تم إلغاء موعدك في ${data.clinicName}. يمكنك حجز موعد جديد في أي وقت.`,
          instructions: 'اتصل بنا لحجز موعد جديد أو لمناقشة مواعيد بديلة.'
        };

      case 'test':
        return {
          ...baseData,
          subject: '🧪 اختبار نظام الإشعارات',
          notification_type: 'رسالة اختبار',
          icon: '🧪',
          message: 'هذه رسالة اختبار للتأكد من صحة إعدادات نظام الإشعارات.',
          instructions: 'إذا وصلتك هذه الرسالة، فال��ظام يعمل بشكل صحيح!'
        };

      default:
        return baseData;
    }
  }

  // محاكاة حجز حقيقي للاختبار
  async sendTestBookingNotification(testEmail: string): Promise<EmailResult & { appointmentId?: string }> {
    const mockData: NotificationData = {
      patientName: 'أحمد محمد علي',
      patientEmail: testEmail,
      appointmentId: `APT-${Date.now()}`,
      appointmentDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString('ar-EG'),
      appointmentTime: '10:00 صباحاً',
      doctorName: 'الدكتور كمال الملصي',
      clinicName: 'عيادة الدكتور كمال الملصي لطب الأسنان',
      clinicPhone: '+966 11 234 5678',
      clinicAddress: 'شارع الملك فهد، الرياض، المملكة العربية السعودية',
      notes: 'فحص دوري وتنظيف الأسنان'
    };

    const result = await this.sendNotification('confirmation', mockData);
    
    if (result.success) {
      return {
        ...result,
        appointmentId: mockData.appointmentId
      };
    }
    
    return result;
  }
}

// إنشاء instance واحد للخدمة
export const emailJSService = new EmailJSService();
