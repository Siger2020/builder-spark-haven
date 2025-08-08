import emailjs from "@emailjs/browser";
import {
  EmailJSSettings,
  validateEmailJSConfig,
  ConnectionStatus,
} from "../lib/emailConfig";

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

export type NotificationType =
  | "confirmation"
  | "reminder"
  | "cancellation"
  | "test";

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
  private requestQueue: Array<() => Promise<any>> = [];
  private isProcessingQueue: boolean = false;
  private lastRequestTime: number = 0;

  // تكوين خدمة EmailJS
  configure(config: EmailJSSettings): { success: boolean; errors?: string[] } {
    const errors = validateEmailJSConfig(config);

    if (errors.length > 0) {
      this.connectionStatus = ConnectionStatus.ERROR;
      console.error("EmailJS configuration errors:", errors);
      return { success: false, errors };
    }

    this.config = config;
    this.connectionStatus = config.enabled
      ? ConnectionStatus.CONFIGURED
      : ConnectionStatus.NOT_CONFIGURED;

    // تهيئة EmailJS مرة واحدة فقط
    if (config.enabled && config.publicKey && !this.isInitialized) {
      try {
        emailjs.init(config.publicKey);
        this.isInitialized = true;
        console.log(
          "EmailJS initialized successfully with publicKey:",
          config.publicKey,
        );
      } catch (error) {
        console.error("Error initializing EmailJS:", error);
        this.connectionStatus = ConnectionStatus.ERROR;
        return { success: false, errors: ["خطأ في تهيئة EmailJS"] };
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
    this.requestQueue = [];
    this.isProcessingQueue = false;
    this.lastRequestTime = 0;
    console.log("EmailJS service reset");
  }

  // الحصول على عدد الطلبات المعلقة
  getPendingRequestsCount(): number {
    return this.requestQueue.length;
  }

  // الحصول على حالة الطابور
  getQueueStatus(): { processing: boolean; queued: number; pending: number } {
    return {
      processing: this.isProcessingQueue,
      queued: this.requestQueue.length,
      pending: this.pendingRequests.size,
    };
  }

  // التحقق من صحة التكوين
  isConfigured(): boolean {
    return (
      this.config !== null &&
      this.config.enabled &&
      !!this.config.serviceId &&
      !!this.config.templateId &&
      !!this.config.publicKey
    );
  }

  // اختبار الاتصال مع منع التضارب
  async testConnection(testEmail?: string): Promise<EmailResult> {
    if (!this.isConfigured() || !this.config) {
      return {
        success: false,
        error:
          "خدمة البريد الإلكتروني غير مُعَدّة بشكل صحيح. يرجى إدخال Service ID و Template ID و Public Key",
      };
    }

    // التحقق من وجود طلبات معلقة في الطابور
    if (this.isProcessingQueue || this.requestQueue.length > 0) {
      return {
        success: false,
        error: "يوجد طلب آخر قيد التنفيذ - يرجى الانتظار",
      };
    }

    this.connectionStatus = ConnectionStatus.TESTING;

    try {
      const result = await this.queueRequest(() =>
        this.performSendWithDelay("test", {
          patientName: testEmail ? "مستخدم الاختبار" : "مدير النظام",
          patientEmail: testEmail || this.config!.senderEmail,
          appointmentId: "TEST-" + Date.now(),
          appointmentDate: new Date().toLocaleDateString("ar-EG"),
          appointmentTime: new Date().toLocaleTimeString("ar-EG"),
          doctorName: "نظام الاختبار",
          clinicName: this.config!.senderName,
          clinicPhone: "غير محدد",
          clinicAddress: "غير محدد",
          notes: "هذه رسالة اختبار لتأكيد عمل النظام",
        }),
      );

      if (result.success) {
        this.connectionStatus = ConnectionStatus.CONNECTED;
      } else {
        this.connectionStatus = ConnectionStatus.ERROR;
      }

      return result;
    } catch (error) {
      this.connectionStatus = ConnectionStatus.ERROR;
      console.error("Test connection error:", error);
      return {
        success: false,
        error: "فشل في اختبار الاتصال",
      };
    }
  }

  // إرسال إشعار مع منع الطلبات المتزامنة والطابور
  async sendNotification(
    type: NotificationType,
    data: NotificationData,
  ): Promise<EmailResult> {
    if (!this.isConfigured() || !this.config) {
      return {
        success: false,
        error: "خدمة البريد الإلكتروني غير مُعَدّة بشكل صحيح",
      };
    }

    // إضافة الطلب للطابور
    return this.queueRequest(() => this.performSendWithDelay(type, data));
  }

  // إضافة طلب للطابور
  private async queueRequest<T>(requestFn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          const result = await requestFn();
          resolve(result);
          return result;
        } catch (error) {
          reject(error);
          throw error;
        }
      });

      this.processQueue();
    });
  }

  // معالجة طابور الطلبات
  private async processQueue(): Promise<void> {
    if (this.isProcessingQueue || this.requestQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;

    while (this.requestQueue.length > 0) {
      const request = this.requestQueue.shift();
      if (request) {
        try {
          await request();
          // إضافة تأخير بين الطلبات
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (error) {
          console.error("Queue request failed:", error);
        }
      }
    }

    this.isProcessingQueue = false;
  }

  // إجراء الإرسال مع التأخير المطلوب
  private async performSendWithDelay(
    type: NotificationType,
    data: NotificationData,
  ): Promise<EmailResult> {
    // التأكد من مرور وقت كافي منذ آخر طلب
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    const minDelay = 2000; // 2 ثانية بين الطلبات

    if (timeSinceLastRequest < minDelay) {
      await new Promise((resolve) =>
        setTimeout(resolve, minDelay - timeSinceLastRequest),
      );
    }

    this.lastRequestTime = Date.now();

    // التأكد من تهيئة EmailJS
    if (!this.isInitialized && this.config?.publicKey) {
      try {
        emailjs.init(this.config.publicKey);
        this.isInitialized = true;
        console.log("EmailJS initialized for request");
      } catch (error) {
        console.error("Failed to initialize EmailJS:", error);
        return { success: false, error: "فشل في تهيئة EmailJS" };
      }
    }

    return this.performSend(type, data);
  }

  // إجراء الإرسال الفعلي
  private async performSend(
    type: NotificationType,
    data: NotificationData,
  ): Promise<EmailResult> {
    try {
      // Enhanced validation
      if (!this.config || !this.config.serviceId || !this.config.templateId) {
        throw new Error("EmailJS configuration is incomplete");
      }

      // Check if running in browser environment
      if (typeof window === 'undefined') {
        throw new Error("EmailJS only works in browser environment");
      }

      // Ensure EmailJS library is loaded
      if (typeof emailjs !== 'object' || typeof emailjs.send !== 'function') {
        throw new Error("EmailJS library not properly loaded");
      }

      const templateData = this.prepareTemplateData(type, data);

      console.log("Sending EmailJS request with data:", {
        serviceId: this.config.serviceId.substring(0, 8) + "...", // Hide sensitive data
        templateId: this.config.templateId.substring(0, 8) + "...",
        dataKeys: Object.keys(templateData),
        timestamp: new Date().toISOString(),
      });

      // استخدام محاولة واحدة فقط بدون retry مع timeout
      const sendPromise = emailjs.send(
        this.config.serviceId,
        this.config.templateId,
        templateData,
      );

      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("EmailJS request timeout")), 30000);
      });

      const result = await Promise.race([sendPromise, timeoutPromise]) as any;

      console.log("EmailJS send result:", result);

      if (result.status === 200) {
        return {
          success: true,
          messageId: result.text,
        };
      } else {
        return {
          success: false,
          error: `خطأ في الإرسال - كود الحالة: ${result.status}`,
        };
      }
    } catch (error) {
      // Safe error logging to prevent text@[native code] issues
      console.error("EmailJS send error occurred");

      let errorMessage = "خطأ غير معروف في الإرسال";

      if (error instanceof Error) {
        if (error.message && error.message.includes("body stream already read")) {
          // إعادة تعيين EmailJS وإعادة المحاولة مرة واحدة
          this.reset();
          errorMessage = "تم إعادة تعيين النظام - يرجى المحاولة مرة أخرى";
        } else if (error.message && error.message.includes("Unauthorized")) {
          errorMessage = "خطأ في الصلاحية - تحقق من Public Key";
        } else if (error.message && error.message.includes("Not Found")) {
          errorMessage = "Service ID أو Template ID غير صحيح";
        } else if (error.message && typeof error.message === 'string') {
          errorMessage = error.message;
        } else {
          errorMessage = "خطأ في الاتصال بخدمة البريد الإلكتروني";
        }
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else {
        // Handle non-Error objects safely
        errorMessage = "خطأ في الاتصال بخدمة EmailJS";
        console.error("Non-Error object caught:", Object.prototype.toString.call(error));
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  // إرسال بريد اختبار ����خصص
  async sendTestEmail(
    toEmail: string,
    recipientName: string = "مستخدم النظام",
  ): Promise<EmailResult> {
    if (!this.isConfigured() || !this.config) {
      return {
        success: false,
        error: "خدمة البريد الإلكتروني غير مُعَدّة بشكل صحيح",
      };
    }

    return this.sendNotification("test", {
      patientName: recipientName,
      patientEmail: toEmail,
      appointmentId: "TEST-" + Date.now(),
      appointmentDate: new Date().toLocaleDateString("ar-EG"),
      appointmentTime: new Date().toLocaleTimeString("ar-EG"),
      doctorName: "نظام الاختبار",
      clinicName: this.config.senderName,
      clinicPhone: this.config.senderEmail || "غير محدد",
      clinicAddress: "نظام الإشعارات الإلكترونية",
      notes: "هذه رسالة اختبار لتأكيد عمل النظام",
    });
  }

  // تحضير بيانات القالب حسب نوع الإشعار
  private prepareTemplateData(
    type: NotificationType,
    data: NotificationData,
  ): any {
    const baseData = {
      to_email: data.patientEmail,
      to_name: data.patientName,
      from_name: this.config?.senderName || "عيادة الدكتور كمال الملصي",
      patient_name: data.patientName,
      appointment_id: data.appointmentId,
      appointment_date: data.appointmentDate,
      appointment_time: data.appointmentTime,
      doctor_name: data.doctorName,
      clinic_name: data.clinicName,
      clinic_phone: data.clinicPhone,
      clinic_address: data.clinicAddress,
      notes: data.notes || "",
      current_time: new Date().toLocaleString("ar-EG"),
    };

    switch (type) {
      case "confirmation":
        return {
          ...baseData,
          subject: `✅ تأكيد موعدك - ${data.appointmentId}`,
          notification_type: "تأكيد موعد",
          icon: "✅",
          message: `تم تأكيد موعدك بنجاح في ${data.clinicName}. نتطلع لرؤيتك في الموعد المحدد.`,
          instructions:
            "يرجى الحضور قبل 15 دقيقة من الموعد. أحضر معك بطاقة الهوية وأي وثائق طبية سابقة.",
        };

      case "reminder":
        return {
          ...baseData,
          subject: `⏰ تذكير بموعدك غداً - ${data.appointmentId}`,
          notification_type: "تذكير موعد",
          icon: "⏰",
          message: `نذكرك بموعدك المحجوز غداً في ${data.clinicName}. نتطلع لرؤيتك!`,
          instructions:
            "لا تنس موعدك غداً. في حالة عدم القدرة على الحضور، يرجى الاتصال بنا.",
        };

      case "cancellation":
        return {
          ...baseData,
          subject: `❌ إلغاء موعدك - ${data.appointmentId}`,
          notification_type: "إلغاء موعد",
          icon: "❌",
          message: `تم إلغاء موعدك في ${data.clinicName}. يمكنك حجز موعد جديد في أي وقت.`,
          instructions: "اتصل بنا لحجز موعد جديد أو لمناقشة مواعيد بديلة.",
        };

      case "test":
        return {
          ...baseData,
          subject: "🧪 اختبار نظام الإشعارات",
          notification_type: "رسالة اختبار",
          icon: "🧪",
          message: "هذه رسالة اختبار للتأكد من صحة إعدادات نظام الإشعارات.",
          instructions: "إذا وصلتك هذه الرسالة، فال��ظام يعمل بشكل صحيح!",
        };

      default:
        return baseData;
    }
  }

  // محاكاة حجز حقيقي للاختبار مع منع التضارب
  async sendTestBookingNotification(
    testEmail: string,
  ): Promise<EmailResult & { appointmentId?: string }> {
    const appointmentId = `APT-${Date.now()}`;
    const mockData: NotificationData = {
      patientName: "أحمد محمد علي",
      patientEmail: testEmail,
      appointmentId,
      appointmentDate: new Date(
        Date.now() + 24 * 60 * 60 * 1000,
      ).toLocaleDateString("ar-EG"),
      appointmentTime: "10:00 صباحاً",
      doctorName: "الدكتور كمال الملصي",
      clinicName: "عيادة الدكتور كمال الملصي لطب الأسنان",
      clinicPhone: "+966 11 234 5678",
      clinicAddress: "شارع الملك فهد، الرياض، المملكة العربية السعودية",
      notes: "فحص دوري وتنظيف الأسنان",
    };

    try {
      const result = await this.sendNotification("confirmation", mockData);

      if (result.success) {
        return {
          ...result,
          appointmentId: mockData.appointmentId,
        };
      }

      return result;
    } catch (error) {
      console.error("Test booking notification error:", error);
      return {
        success: false,
        error: "فشل في إرسال إشعار الحجز التجريبي",
      };
    }
  }
}

// إنشاء instance واحد للخدمة
export const emailJSService = new EmailJSService();
