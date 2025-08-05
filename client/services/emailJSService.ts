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
  private isInitialized: boolean = false;
  private pendingRequests: Set<Promise<any>> = new Set();

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

    // تهيئة EmailJS مرة واحدة فقط
    if (config.enabled && config.publicKey && !this.isInitialized) {
      try {
        emailjs.init(config.publicKey);
        this.isInitialized = true;
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

  // إعادة تعيين الخدمة
  reset(): void {
    this.config = null;
    this.connectionStatus = ConnectionStatus.NOT_CONFIGURED;
    this.isInitialized = false;
    this.pendingRequests.clear();
  }

  // الحصول على عدد الطلبات المعلقة
  getPendingRequestsCount(): number {
    return this.pendingRequests.size;
  }

  // التحقق من صحة التكوين
  isConfigured(): boolean {
    return this.config !== null && 
           this.config.enabled && 
           !!this.config.serviceId && 
           !!this.config.templateId && 
           !!this.config.publicKey;
  }

  // اختبار الاتصال مع منع التضارب
  async testConnection(): Promise<EmailResult> {
    if (!this.isConfigured() || !this.config) {
      return {
        success: false,
        error: 'خدمة البريد الإلكتروني غير مُعَدّة بشكل صحيح. يرجى إدخال Service ID و Template ID و Public Key'
      };
    }

    // التحقق من وجود طلبات معلقة
    if (this.pendingRequests.size > 0) {
      return {
        success: false,
        error: 'يوجد طلب آخر قيد التنفيذ - يرجى الانتظار'
      };
    }

    this.connectionStatus = ConnectionStatus.TESTING;

    const testData = {
      to_email: this.config.senderEmail,
      to_name: 'مدير النظام',
      from_name: this.config.senderName,
      clinic_name: this.config.senderName,
      test_time: new Date().toLocaleString('ar-EG'),
      message: 'هذا اختبار لصحة إعدادات EmailJS. إذا وص��تك هذه الرسالة، فالنظام يعمل بشكل صحيح!',
      subject: '🧪 اختبار نظام الإشعارات - EmailJS',
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

    try {
      const result = await this.performSend('test', {
        patientName: testData.to_name,
        patientEmail: testData.to_email,
        appointmentId: testData.appointment_id,
        appointmentDate: testData.appointment_date,
        appointmentTime: testData.appointment_time,
        doctorName: testData.doctor_name,
        clinicName: testData.clinic_name,
        clinicPhone: testData.clinic_phone,
        clinicAddress: testData.clinic_address,
        notes: testData.notes
      });

      if (result.success) {
        this.connectionStatus = ConnectionStatus.CONNECTED;
      } else {
        this.connectionStatus = ConnectionStatus.ERROR;
      }

      return result;
    } catch (error) {
      this.connectionStatus = ConnectionStatus.ERROR;
      console.error('Test connection error:', error);
      return {
        success: false,
        error: 'فشل في اختبار الاتصال'
      };
    }
  }

  // إرسال إشعار مع منع الطلبات المتزامنة
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

    // التأكد من تهيئة EmailJS
    if (!this.isInitialized && this.config.publicKey) {
      try {
        emailjs.init(this.config.publicKey);
        this.isInitialized = true;
      } catch (error) {
        console.error('Failed to reinitialize EmailJS:', error);
        return { success: false, error: 'فشل في تهيئة EmailJS' };
      }
    }

    const sendPromise = this.performSend(type, data);
    this.pendingRequests.add(sendPromise);

    try {
      const result = await sendPromise;
      return result;
    } finally {
      this.pendingRequests.delete(sendPromise);
    }
  }

  // إجراء الإرسال الفعلي
  private async performSend(
    type: NotificationType,
    data: NotificationData
  ): Promise<EmailResult> {
    try {
      const templateData = this.prepareTemplateData(type, data);

      console.log('Sending EmailJS request with data:', {
        serviceId: this.config?.serviceId,
        templateId: this.config?.templateId,
        dataKeys: Object.keys(templateData)
      });

      // إضافة تأخير صغير لتجنب تضارب الطلبات
      await new Promise(resolve => setTimeout(resolve, 100));

      const result = await emailjs.send(
        this.config!.serviceId,
        this.config!.templateId,
        templateData
      );

      console.log('EmailJS send result:', result);

      if (result.status === 200) {
        return {
          success: true,
          messageId: result.text
        };
      } else {
        return {
          success: false,
          error: `خطأ في الإرسال - كود الحالة: ${result.status}`
        };
      }
    } catch (error) {
      console.error('EmailJS send error:', error);

      let errorMessage = 'خطأ غير معروف في الإرسال';

      if (error instanceof Error) {
        if (error.message.includes('body stream already read')) {
          errorMessage = 'طلب مكرر - يرجى المحاولة مرة أخرى بعد قليل';
        } else if (error.message.includes('Unauthorized')) {
          errorMessage = 'خطأ في الصلاحية - تحقق من Public Key';
        } else if (error.message.includes('Not Found')) {
          errorMessage = 'Service ID أو Template ID غير صحيح';
        } else {
          errorMessage = error.message;
        }
      }

      return {
        success: false,
        error: errorMessage
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

    // التحقق من عدم وجود طلبات متزامنة
    if (this.pendingRequests.size > 0) {
      return {
        success: false,
        error: 'يوجد طلب آخر قيد التنفيذ - يرجى الانتظار'
      };
    }

    return this.sendNotification('test', {
      patientName: recipientName,
      patientEmail: toEmail,
      appointmentId: 'TEST-' + Date.now(),
      appointmentDate: new Date().toLocaleDateString('ar-EG'),
      appointmentTime: new Date().toLocaleTimeString('ar-EG'),
      doctorName: 'نظام الاختبار',
      clinicName: this.config.senderName,
      clinicPhone: this.config.senderEmail || 'غير محدد',
      clinicAddress: 'نظام الإشعارات الإلكترونية',
      notes: 'هذه رسالة اختبار لتأكيد عمل النظام'
    });
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

  // محاكاة حجز حقيقي للاختبار مع منع التضارب
  async sendTestBookingNotification(testEmail: string): Promise<EmailResult & { appointmentId?: string }> {
    // التحقق من عدم وجود طلبات متزامنة
    if (this.pendingRequests.size > 0) {
      return {
        success: false,
        error: 'يوجد طلب آخر قيد التنفيذ - يرجى الانتظار قبل إرسال طلب جديد'
      };
    }

    const appointmentId = `APT-${Date.now()}`;
    const mockData: NotificationData = {
      patientName: 'أحمد محمد علي',
      patientEmail: testEmail,
      appointmentId,
      appointmentDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString('ar-EG'),
      appointmentTime: '10:00 صباحاً',
      doctorName: 'الدكتور كمال الملصي',
      clinicName: 'عيادة الدكتور كمال الملصي لطب الأسنان',
      clinicPhone: '+966 11 234 5678',
      clinicAddress: 'شارع الملك فهد، الرياض، المملكة العربية السعودية',
      notes: 'فحص دوري وتنظيف الأسنان'
    };

    try {
      const result = await this.sendNotification('confirmation', mockData);

      if (result.success) {
        return {
          ...result,
          appointmentId: mockData.appointmentId
        };
      }

      return result;
    } catch (error) {
      console.error('Test booking notification error:', error);
      return {
        success: false,
        error: 'فشل في إرسال إشعار الحجز التجريبي'
      };
    }
  }
}

// إنشاء instance واحد للخدمة
export const emailJSService = new EmailJSService();
