// إعدادات EmailJS للإشعارات الحقيقية

export interface EmailJSConfig {
  serviceId: string;
  templateId: string;
  publicKey: string;
  isConfigured: boolean;
}

export interface EmailJSSettings {
  enabled: boolean;
  serviceId: string;
  templateId: string;
  publicKey: string;
  senderName: string;
  senderEmail: string;
}

// إعدادات افتراضية
export const defaultEmailJSSettings: EmailJSSettings = {
  enabled: false,
  serviceId: "",
  templateId: "",
  publicKey: "",
  senderName: "عيادة الدكتور كمال الملصي",
  senderEmail: "",
};

// بيانات القوالب المختلفة للإشعارات
export const EMAIL_TEMPLATES = {
  confirmation: {
    id: "confirmation_template",
    name: "قالب تأكيد الموعد",
    description: "يُرسل عند تأكيد حجز موعد جديد",
    variables: [
      "patient_name",
      "appointment_id",
      "appointment_date",
      "appointment_time",
      "doctor_name",
      "clinic_name",
      "clinic_phone",
      "clinic_address",
      "notes",
    ],
  },
  reminder: {
    id: "reminder_template",
    name: "قالب تذكير الموعد",
    description: "يُرسل قبل موعد المريض بيوم واحد",
    variables: [
      "patient_name",
      "appointment_id",
      "appointment_date",
      "appointment_time",
      "doctor_name",
      "clinic_name",
      "clinic_phone",
      "clinic_address",
    ],
  },
  cancellation: {
    id: "cancellation_template",
    name: "قالب إلغاء الموعد",
    description: "يُرسل عند إلغاء موعد المريض",
    variables: [
      "patient_name",
      "appointment_id",
      "appointment_date",
      "appointment_time",
      "doctor_name",
      "clinic_name",
      "clinic_phone",
    ],
  },
  test: {
    id: "test_template",
    name: "قالب رسالة الاختبار",
    description: "لاختبار صحة إعدادات البريد الإلكتروني",
    variables: ["recipient_name", "clinic_name", "test_time"],
  },
};

// دليل الإعداد والتكوين
export const SETUP_GUIDE = {
  steps: [
    {
      title: "1. إنشاء ح��اب EmailJS",
      description: "قم بزيارة https://www.emailjs.com وأنشئ حساب مجاني",
      details: [
        "التسجيل مجاني حتى 200 بريد شهرياً",
        "لا يتطلب كارت ائتمان للبدء",
        "سهل الإعداد والاستخدام",
      ],
    },
    {
      title: "2. إضافة خدمة البريد الإلكتروني",
      description: "في لوحة تحكم EmailJS، أضف خدمة بريد إلكتروني جديدة",
      details: [
        "اختر Gmail, Outlook, Yahoo أو أي خدمة أخرى",
        "اتبع التعليمات لربط حسابك",
        "احفظ Service ID الخاص بك",
      ],
    },
    {
      title: "3. إنشاء القوالب",
      description: "قم بإنشاء قوالب البريد الإلكتروني للإشعارات المختلفة",
      details: [
        "استخدم المتغيرات المطلوبة لكل قالب",
        "صمم القوالب باللغة العربية",
        "احفظ Template ID لكل قالب",
      ],
    },
    {
      title: "4. الحصول على Public Key",
      description: "من إعدادات EmailJS، احصل على Public Key",
      details: [
        "اذهب إلى Account > API Keys",
        "انسخ Public Key",
        "هذا المفتاح يُستخدم في الكود",
      ],
    },
    {
      title: "5. إدخال الإعدادات هنا",
      description: "أدخل جميع المعرفات في صفحة الإعدادات",
      details: [
        "Service ID من الخطوة 2",
        "Template ID من الخطوة 3",
        "Public Key من الخطوة 4",
        "اختبر الإعدادات قبل التفعيل",
      ],
    },
  ],
  troubleshooting: [
    {
      issue: "فشل في إرسال البريد",
      solutions: [
        "تأكد من صحة Service ID و Template ID",
        "تحقق من أن خدمة البريد الإلكتروني مفعلة في EmailJS",
        "تأكد من صحة Public Key",
        "راجع console للأخطاء التفصيلية",
      ],
    },
    {
      issue: "البريد لا يصل للمستلم",
      solutions: [
        "تحقق من مجلد الرسائل المهملة (Spam)",
        "تأكد من صحة عنوان البريد الإلكتروني",
        "تحقق من إعدادات الخدمة في EmailJS",
        "راجع سجل الإرسال في لوحة تحكم EmailJS",
      ],
    },
    {
      issue: "متغيرات القالب لا تظهر",
      solutions: [
        "تأكد من كتابة أسماء المتغيرات بنفس الشكل",
        "استخدم الأقواس المجعدة {{variable_name}}",
        "تحقق من القالب في لوحة تحكم EmailJS",
        "اختبر القالب من EmailJS مباشرة",
      ],
    },
  ],
};

// تحقق من صحة الإعدادات
export const validateEmailJSConfig = (config: EmailJSSettings): string[] => {
  const errors: string[] = [];

  if (!config.serviceId) {
    errors.push("Service ID مطلوب");
  }

  if (!config.templateId) {
    errors.push("Template ID مطلوب");
  }

  if (!config.publicKey) {
    errors.push("Public Key مطلوب");
  }

  if (!config.senderName) {
    errors.push("اسم المرسل مطلوب");
  }

  if (!config.senderEmail) {
    errors.push("بريد المرسل مطلوب");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.senderEmail)) {
    errors.push("بريد المرسل غير صحيح");
  }

  return errors;
};

// حالة الاتصال
export enum ConnectionStatus {
  NOT_CONFIGURED = "not_configured",
  CONFIGURED = "configured",
  TESTING = "testing",
  CONNECTED = "connected",
  ERROR = "error",
}

export const getConnectionStatusText = (status: ConnectionStatus): string => {
  switch (status) {
    case ConnectionStatus.NOT_CONFIGURED:
      return "غير مُعَدّ";
    case ConnectionStatus.CONFIGURED:
      return "مُعَدّ ولكن غير مختبر";
    case ConnectionStatus.TESTING:
      return "جاري الاختبار...";
    case ConnectionStatus.CONNECTED:
      return "متصل ويعمل";
    case ConnectionStatus.ERROR:
      return "خطأ في الاتصال";
    default:
      return "حالة غير معروفة";
  }
};

export const getConnectionStatusColor = (status: ConnectionStatus): string => {
  switch (status) {
    case ConnectionStatus.NOT_CONFIGURED:
      return "text-gray-500";
    case ConnectionStatus.CONFIGURED:
      return "text-yellow-600";
    case ConnectionStatus.TESTING:
      return "text-blue-600";
    case ConnectionStatus.CONNECTED:
      return "text-green-600";
    case ConnectionStatus.ERROR:
      return "text-red-600";
    default:
      return "text-gray-500";
  }
};
