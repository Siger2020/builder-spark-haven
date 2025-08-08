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
    console.log("Testing EmailJS connection...");
    console.log("Configuration status:", {
      isConfigured: this.isConfigured(),
      hasConfig: !!this.config,
      isInitialized: this.isInitialized,
      connectionStatus: this.connectionStatus
    });

    if (!this.isConfigured() || !this.config) {
      return {
        success: false,
        error:
          "خدمة البريد الإلكتروني غير مُ���َدّة بشكل صحيح. يرجى إدخال Service ID و Template ID و Public Key",
      };
    }

    // Check EmailJS library availability
    try {
      if (typeof emailjs === 'undefined') {
        return {
          success: false,
          error: "مكتبة EmailJS غير محملة. يرجى إعادة تحميل الصفحة."
        };
      }

      if (typeof emailjs.send !== 'function') {
        return {
          success: false,
          error: "وظيفة الإرسال في EmailJS غير متاحة."
        };
      }

      console.log("EmailJS library check passed");
    } catch (checkError) {
      return {
        success: false,
        error: "خطأ في فحص مكتبة EmailJS: " + (checkError instanceof Error ? checkError.message : 'خطأ غير معروف')
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
          patientName: testEmail ? "مستخد�� الاختبار" : "مدير النظام",
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
    // التأكد من مرور وقت كافي م��ذ آخر طلب
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

      // Enhanced EmailJS library check with better error reporting
      let emailjsToUse;
      try {
        // Check if emailjs is imported correctly
        if (typeof emailjs === 'undefined') {
          throw new Error("EmailJS library is undefined - import failed");
        }

        // Handle different import structures
        if (emailjs && typeof emailjs === 'object') {
          if (typeof emailjs.send === 'function') {
            emailjsToUse = emailjs;
          } else if (emailjs.default && typeof emailjs.default.send === 'function') {
            emailjsToUse = emailjs.default;
          } else {
            throw new Error("EmailJS send function not found in library structure");
          }
        } else {
          throw new Error("EmailJS is not an object as expected");
        }

        console.log("EmailJS library validation passed:", {
          hasEmailJS: !!emailjs,
          hasDefaultSend: !!(emailjs as any)?.default?.send,
          hasDirectSend: !!(emailjs as any)?.send,
          selectedStructure: emailjsToUse === emailjs ? 'direct' : 'default'
        });

      } catch (libraryError) {
        console.error("EmailJS library validation failed:", libraryError);
        throw new Error(`EmailJS library error: ${libraryError instanceof Error ? libraryError.message : 'Unknown library error'}`);
      }

      const templateData = this.prepareTemplateData(type, data);

      console.log("Sending EmailJS request with data:", {
        serviceId: this.config.serviceId.substring(0, 8) + "...", // Hide sensitive data
        templateId: this.config.templateId.substring(0, 8) + "...",
        dataKeys: Object.keys(templateData),
        timestamp: new Date().toISOString(),
      });

      // استخدام محاولة واحدة فقط بدون retry مع timeout
      const sendPromise = emailjsToUse.send(
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
      // Enhanced error logging with comprehensive TypeError details
      console.error("=== EmailJS Send Error Analysis ===");
      console.error("Error type:", typeof error);
      console.error("Error constructor:", error?.constructor?.name);
      console.error("Error instanceof Error:", error instanceof Error);
      console.error("Error instanceof TypeError:", error instanceof TypeError);

      // Safe error object inspection
      try {
        if (error && typeof error === 'object') {
          // Get basic properties
          const errorInfo = {
            hasMessage: 'message' in error,
            hasStatus: 'status' in error,
            hasText: 'text' in error,
            hasName: 'name' in error,
            hasStack: 'stack' in error,
            keys: Object.keys(error),
            prototype: Object.getPrototypeOf(error)?.constructor?.name
          };
          console.error("Error object analysis:", errorInfo);

          // Try to extract message safely
          if ('message' in error) {
            console.error("Error message:", error.message);
          }

          // Try to extract name safely
          if ('name' in error) {
            console.error("Error name:", error.name);
          }

          // For TypeError specifically, try to get more details
          if (error instanceof TypeError) {
            console.error("TypeError details:", {
              message: error.message,
              name: error.name,
              stack: error.stack?.split('\n').slice(0, 3) // First 3 lines of stack
            });
          }

          // Try JSON.stringify as fallback
          try {
            const jsonStr = JSON.stringify(error, Object.getOwnPropertyNames(error));
            if (jsonStr && jsonStr !== '{}') {
              console.error("Error JSON representation:", jsonStr);
            }
          } catch (jsonError) {
            console.error("Could not stringify error object");
          }
        }
      } catch (inspectionError) {
        console.error("Error during error inspection:", inspectionError);
      }

      let errorMessage = "خطأ غير معروف في الإرسال";
      let technicalDetails = "";

      if (error instanceof TypeError) {
        errorMessage = "خطأ في نوع البيانات (TypeError)";
        technicalDetails = error.message || "TypeError without message";

        // Common TypeError scenarios in EmailJS
        if (error.message?.includes("Cannot read property")) {
          errorMessage = "خطأ في قراءة خصائص البيانات - تحقق من التكوين";
        } else if (error.message?.includes("is not a function")) {
          errorMessage = "دالة EmailJS غير متاحة - تحقق من تحميل المكتبة";
        } else if (error.message?.includes("null") || error.message?.includes("undefined")) {
          errorMessage = "قيم مفقودة في التكوين - تحقق من Service ID والـ Template ID";
        }
      } else if (error instanceof Error) {
        technicalDetails = error.message || "Error without message";

        if (error.message && error.message.includes("body stream already read")) {
          // إعادة تعيين EmailJS وإعادة المحاولة مرة واحدة
          this.reset();
          errorMessage = "تم إعادة تعيين النظام - يرجى المحاولة مرة أخرى";
        } else if (error.message && error.message.includes("Unauthorized")) {
          errorMessage = "خطأ في الصلاحية - تحقق من Public Key";
        } else if (error.message && error.message.includes("Not Found")) {
          errorMessage = "Service ID أو Template ID غير صحيح";
        } else if (error.message && error.message.includes("Network")) {
          errorMessage = "خطأ في الشبكة - تحقق من الاتصال بالإنترنت";
        } else if (error.message && typeof error.message === 'string') {
          errorMessage = error.message;
        } else {
          errorMessage = "خطأ في الاتصال بخدمة البريد الإلكتروني";
        }
      } else if (typeof error === 'string') {
        errorMessage = error;
        technicalDetails = error;
      } else {
        // Handle non-Error objects safely
        technicalDetails = Object.prototype.toString.call(error);
        errorMessage = "خطأ في الاتصال بخدمة EmailJS";
        console.error("Non-Error object caught:", technicalDetails);

        // Try to extract any useful information from the object
        try {
          if (error && typeof error === 'object') {
            const errorKeys = Object.keys(error);
            if (errorKeys.length > 0) {
              technicalDetails = `Object with keys: ${errorKeys.join(', ')}`;
            }
          }
        } catch (e) {
          // Ignore extraction errors
        }
      }

      // Log final error analysis
      console.error("Final error analysis:", {
        errorMessage,
        technicalDetails,
        errorType: typeof error,
        errorConstructor: error?.constructor?.name
      });

      return {
        success: false,
        error: errorMessage + (technicalDetails ? ` (التفاصيل: ${technicalDetails})` : ""),
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
      from_name: this.config?.senderName || "عيادة الدكتور كمال الملص��",
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
            "يرجى الحضور قبل 15 دقيقة ��ن الموعد. أحضر معك بطاقة الهوية وأي وثائق طبية سابقة.",
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

  // تشخيص شامل لحالة EmailJS
  getDiagnosticInfo(): object {
    return {
      serviceInfo: {
        isConfigured: this.isConfigured(),
        hasConfig: !!this.config,
        isInitialized: this.isInitialized,
        connectionStatus: this.connectionStatus,
        pendingRequests: this.pendingRequests.size,
        queueLength: this.requestQueue.length,
        isProcessingQueue: this.isProcessingQueue
      },
      configInfo: this.config ? {
        hasServiceId: !!this.config.serviceId,
        hasTemplateId: !!this.config.templateId,
        hasPublicKey: !!this.config.publicKey,
        hasSenderEmail: !!this.config.senderEmail,
        enabled: this.config.enabled
      } : null,
      libraryInfo: {
        emailjsAvailable: typeof emailjs !== 'undefined',
        emailjsType: typeof emailjs,
        hasSendFunction: typeof emailjs !== 'undefined' && typeof emailjs.send === 'function',
        hasInitFunction: typeof emailjs !== 'undefined' && typeof emailjs.init === 'function'
      },
      environmentInfo: {
        isBrowser: typeof window !== 'undefined',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A',
        timestamp: new Date().toISOString()
      }
    };
  }

  // اختبار متقدم للكشف عن أخطاء TypeError المحتملة
  async runTypeErrorDiagnosis(): Promise<{ success: boolean; issues: string[]; recommendations: string[] }> {
    const issues: string[] = [];
    const recommendations: string[] = [];

    console.log("=== Running TypeError Diagnosis ===");

    // 1. Check EmailJS library structure
    try {
      if (typeof emailjs === 'undefined') {
        issues.push("مكتبة EmailJS غير محملة");
        recommendations.push("تحقق من تحميل مكتبة EmailJS في index.html");
      } else {
        console.log("EmailJS object structure:", Object.getOwnPropertyNames(emailjs));

        if (typeof emailjs.send !== 'function') {
          issues.push("دالة emailjs.send غير متاحة");
          recommendations.push("تحقق من إصدار مكتبة EmailJS");
        }

        if (typeof emailjs.init !== 'function') {
          issues.push("دالة emailjs.init غير متاحة");
          recommendations.push("تحقق من إصدار مكتبة EmailJS");
        }
      }
    } catch (error) {
      issues.push("خطأ في فحص مكتبة EmailJS");
      recommendations.push("إعادة تحميل الصفحة قد يحل المشكلة");
    }

    // 2. Check configuration validity
    if (!this.config) {
      issues.push("لا توجد إعدادات محفوظة");
      recommendations.push("قم بإعداد EmailJS من صفحة الإشعارات");
    } else {
      // Check for null/undefined values that might cause TypeError
      const configChecks = [
        { key: 'serviceId', value: this.config.serviceId },
        { key: 'templateId', value: this.config.templateId },
        { key: 'publicKey', value: this.config.publicKey }
      ];

      configChecks.forEach(check => {
        if (!check.value || check.value === 'undefined' || check.value === 'null') {
          issues.push(`${check.key} فارغ أو غير صالح`);
          recommendations.push(`تحقق من صحة ${check.key} في إعدادات EmailJS`);
        }
      });
    }

    // 3. Test template data preparation
    try {
      const testData: NotificationData = {
        patientName: "test",
        patientEmail: "test@example.com",
        appointmentId: "TEST",
        appointmentDate: "2024-01-01",
        appointmentTime: "10:00",
        doctorName: "test",
        clinicName: "test",
        clinicPhone: "test",
        clinicAddress: "test"
      };

      const templateData = this.prepareTemplateData("test", testData);

      if (!templateData || typeof templateData !== 'object') {
        issues.push("إعداد بيانات القالب فاشل");
        recommendations.push("تحقق من دالة prepareTemplateData");
      }
    } catch (error) {
      issues.push("خطأ في إعداد بيانات القالب");
      recommendations.push("تحقق من صحة بيانات القالب");
    }

    // 4. Check promise handling
    try {
      // Test Promise.race setup
      const testPromise = new Promise(resolve => resolve("test"));
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), 100)
      );

      await Promise.race([testPromise, timeoutPromise]);
    } catch (error) {
      if (error instanceof Error && error.message !== "timeout") {
        issues.push("خطأ في معالجة Promise");
        recommendations.push("مشكلة في بيئة JavaScript");
      }
    }

    console.log("TypeError Diagnosis Results:", { issues, recommendations });

    return {
      success: issues.length === 0,
      issues,
      recommendations
    };
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
