-- قاعدة بيانات عيادة الدكتور كمال
-- إنشاء جميع الجداول المطلوبة للنظام

-- جدول المستخدمين
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone TEXT,
    role TEXT CHECK(role IN ('patient', 'doctor', 'admin', 'receptionist')) NOT NULL DEFAULT 'patient',
    is_active BOOLEAN DEFAULT TRUE,
    profile_image TEXT,
    date_of_birth DATE,
    gender TEXT CHECK(gender IN ('male', 'female')),
    address TEXT,
    emergency_contact TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- جدول المرضى (معلومات إضافية للمرضى)
CREATE TABLE IF NOT EXISTS patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    patient_number TEXT UNIQUE NOT NULL,
    insurance_company TEXT,
    insurance_number TEXT,
    medical_history TEXT,
    allergies TEXT,
    current_medications TEXT,
    blood_type TEXT,
    weight REAL,
    height REAL,
    occupation TEXT,
    marital_status TEXT,
    preferred_language TEXT DEFAULT 'arabic',
    preferred_doctor_id INTEGER,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (preferred_doctor_id) REFERENCES doctors(id)
);

-- جدول الأطباء
CREATE TABLE IF NOT EXISTS doctors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    doctor_number TEXT UNIQUE NOT NULL,
    specialization TEXT NOT NULL,
    license_number TEXT UNIQUE NOT NULL,
    qualification TEXT,
    experience_years INTEGER DEFAULT 0,
    working_hours TEXT, -- JSON format
    consultation_fee REAL DEFAULT 0,
    is_available BOOLEAN DEFAULT TRUE,
    bio TEXT,
    rating REAL DEFAULT 0,
    total_patients INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- جدول الخدمات
CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    name_en TEXT,
    description TEXT,
    category TEXT,
    duration_minutes INTEGER DEFAULT 30,
    price REAL DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    icon TEXT,
    requires_appointment BOOLEAN DEFAULT TRUE,
    preparation_instructions TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- جدول المواعيد
CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    appointment_number TEXT UNIQUE NOT NULL,
    patient_id INTEGER NOT NULL,
    doctor_id INTEGER NOT NULL,
    service_id INTEGER,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    duration_minutes INTEGER DEFAULT 30,
    status TEXT CHECK(status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show')) DEFAULT 'scheduled',
    urgency_level TEXT CHECK(urgency_level IN ('low', 'medium', 'high', 'emergency')) DEFAULT 'medium',
    chief_complaint TEXT,
    notes TEXT,
    reminder_sent BOOLEAN DEFAULT FALSE,
    follow_up_required BOOLEAN DEFAULT FALSE,
    follow_up_date DATE,
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id),
    FOREIGN KEY (service_id) REFERENCES services(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- جدول الكشوفات الطبية
CREATE TABLE IF NOT EXISTS medical_reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    report_number TEXT UNIQUE NOT NULL,
    patient_id INTEGER NOT NULL,
    doctor_id INTEGER NOT NULL,
    appointment_id INTEGER,
    visit_date DATE NOT NULL,
    chief_complaint TEXT,
    clinical_examination TEXT,
    diagnosis TEXT,
    treatment_plan TEXT,
    medications TEXT, -- JSON format
    recommendations TEXT,
    next_visit_date DATE,
    follow_up_instructions TEXT,
    vital_signs TEXT, -- JSON format (blood pressure, pulse, etc.)
    attachments TEXT, -- JSON format for file paths
    status TEXT CHECK(status IN ('draft', 'completed', 'reviewed')) DEFAULT 'draft',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id),
    FOREIGN KEY (appointment_id) REFERENCES appointments(id)
);

-- جدول خطط العلاج
CREATE TABLE IF NOT EXISTS treatment_plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    plan_number TEXT UNIQUE NOT NULL,
    patient_id INTEGER NOT NULL,
    doctor_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    estimated_end_date DATE,
    total_sessions INTEGER DEFAULT 1,
    completed_sessions INTEGER DEFAULT 0,
    total_cost REAL DEFAULT 0,
    status TEXT CHECK(status IN ('active', 'completed', 'paused', 'cancelled')) DEFAULT 'active',
    success_criteria TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id)
);

-- جدول جلسات العلاج
CREATE TABLE IF NOT EXISTS treatment_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_number TEXT UNIQUE NOT NULL,
    treatment_plan_id INTEGER NOT NULL,
    appointment_id INTEGER,
    session_date DATE NOT NULL,
    session_number_in_plan INTEGER NOT NULL,
    procedures_performed TEXT, -- JSON format
    session_notes TEXT,
    patient_response TEXT,
    complications TEXT,
    next_session_plan TEXT,
    pain_level INTEGER CHECK(pain_level BETWEEN 0 AND 10),
    session_duration_minutes INTEGER,
    materials_used TEXT, -- JSON format
    cost REAL DEFAULT 0,
    status TEXT CHECK(status IN ('scheduled', 'completed', 'cancelled')) DEFAULT 'scheduled',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (treatment_plan_id) REFERENCES treatment_plans(id) ON DELETE CASCADE,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id)
);

-- جدول المعاملات المالية
CREATE TABLE IF NOT EXISTS financial_transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    transaction_number TEXT UNIQUE NOT NULL,
    patient_id INTEGER NOT NULL,
    appointment_id INTEGER,
    treatment_session_id INTEGER,
    transaction_type TEXT CHECK(transaction_type IN ('payment', 'refund', 'charge', 'adjustment')) NOT NULL,
    amount REAL NOT NULL,
    currency TEXT DEFAULT 'YER',
    payment_method TEXT CHECK(payment_method IN ('cash', 'card', 'bank_transfer', 'insurance', 'installment')),
    payment_status TEXT CHECK(payment_status IN ('pending', 'completed', 'failed', 'refunded')) DEFAULT 'pending',
    description TEXT,
    reference_number TEXT,
    due_date DATE,
    paid_date DATE,
    discount_amount REAL DEFAULT 0,
    tax_amount REAL DEFAULT 0,
    insurance_covered REAL DEFAULT 0,
    notes TEXT,
    processed_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id),
    FOREIGN KEY (treatment_session_id) REFERENCES treatment_sessions(id),
    FOREIGN KEY (processed_by) REFERENCES users(id)
);

-- جدول الفواتير
CREATE TABLE IF NOT EXISTS invoices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_number TEXT UNIQUE NOT NULL,
    patient_id INTEGER NOT NULL,
    total_amount REAL NOT NULL,
    paid_amount REAL DEFAULT 0,
    remaining_amount REAL NOT NULL,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    status TEXT CHECK(status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')) DEFAULT 'draft',
    items TEXT, -- JSON format for invoice items
    tax_amount REAL DEFAULT 0,
    discount_amount REAL DEFAULT 0,
    notes TEXT,
    payment_terms TEXT,
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- جدول الإشعارات
CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    recipient_id INTEGER NOT NULL,
    sender_id INTEGER,
    type TEXT CHECK(type IN ('appointment_reminder', 'payment_due', 'appointment_confirmation', 'treatment_update', 'system_alert')) NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    channels TEXT, -- JSON format (sms, email, whatsapp, push)
    send_date DATETIME NOT NULL,
    sent_via TEXT, -- JSON format showing which channels were successful
    status TEXT CHECK(status IN ('pending', 'sent', 'delivered', 'failed', 'read')) DEFAULT 'pending',
    priority TEXT CHECK(priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
    template_id INTEGER,
    metadata TEXT, -- JSON format for additional data
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id)
);

-- جدول قوالب الإشعارات
CREATE TABLE IF NOT EXISTS notification_templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    subject TEXT,
    body_template TEXT NOT NULL,
    variables TEXT, -- JSON format for template variables
    channels TEXT, -- JSON format for supported channels
    is_active BOOLEAN DEFAULT TRUE,
    language TEXT DEFAULT 'arabic',
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- جدول إعدادات النظام
CREATE TABLE IF NOT EXISTS system_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    setting_key TEXT NOT NULL,
    setting_value TEXT,
    description TEXT,
    data_type TEXT CHECK(data_type IN ('string', 'number', 'boolean', 'json')) DEFAULT 'string',
    is_public BOOLEAN DEFAULT FALSE,
    updated_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(category, setting_key),
    FOREIGN KEY (updated_by) REFERENCES users(id)
);

-- جدول المخزون والمواد
CREATE TABLE IF NOT EXISTS inventory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_name TEXT NOT NULL,
    item_code TEXT UNIQUE,
    category TEXT,
    description TEXT,
    unit_of_measure TEXT,
    current_stock INTEGER DEFAULT 0,
    minimum_stock INTEGER DEFAULT 0,
    maximum_stock INTEGER,
    unit_cost REAL DEFAULT 0,
    supplier TEXT,
    expiry_date DATE,
    location TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- جدول حركات المخزون
CREATE TABLE IF NOT EXISTS inventory_movements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    inventory_id INTEGER NOT NULL,
    movement_type TEXT CHECK(movement_type IN ('in', 'out', 'adjustment')) NOT NULL,
    quantity INTEGER NOT NULL,
    unit_cost REAL,
    total_cost REAL,
    reference_type TEXT, -- appointment, treatment_session, purchase, etc.
    reference_id INTEGER,
    notes TEXT,
    performed_by INTEGER,
    movement_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (inventory_id) REFERENCES inventory(id) ON DELETE CASCADE,
    FOREIGN KEY (performed_by) REFERENCES users(id)
);

-- جدول سجل النشاطات
CREATE TABLE IF NOT EXISTS activity_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    action TEXT NOT NULL,
    entity_type TEXT, -- patients, appointments, etc.
    entity_id INTEGER,
    old_values TEXT, -- JSON format
    new_values TEXT, -- JSON format
    ip_address TEXT,
    user_agent TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- جدول النسخ الاحتياطية
CREATE TABLE IF NOT EXISTS backups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    backup_name TEXT NOT NULL,
    backup_type TEXT CHECK(backup_type IN ('full', 'incremental')) DEFAULT 'full',
    file_path TEXT NOT NULL,
    file_size INTEGER,
    status TEXT CHECK(status IN ('in_progress', 'completed', 'failed')) DEFAULT 'in_progress',
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- الفهارس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_patients_user_id ON patients(user_id);
CREATE INDEX IF NOT EXISTS idx_patients_patient_number ON patients(patient_number);
CREATE INDEX IF NOT EXISTS idx_doctors_user_id ON doctors(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_medical_reports_patient_id ON medical_reports(patient_id);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_patient_id ON financial_transactions(patient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient_id ON notifications(recipient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_timestamp ON activity_logs(timestamp);

-- إدراج البيانات الأولية
INSERT OR IGNORE INTO system_settings (category, setting_key, setting_value, description) VALUES
('clinic', 'name', 'عيادة الدكتور كمال', 'اسم العيادة'),
('clinic', 'address', 'شارع المقالح -حي الاصبحي امام سيتي ماكس', 'عنوان العيادة'),
('clinic', 'phone', '00967 777775545', 'رقم هاتف العيادة'),
('clinic', 'email', 'info@dkalmoli.com', 'البريد الإلكتروني للعيادة'),
('clinic', 'working_hours', '{"saturday_to_thursday": "09:00-21:00", "friday": "14:00-21:00"}', 'ساعات العمل'),
('clinic', 'currency', 'YER', 'العملة المستخد��ة'),
('clinic', 'timezone', 'Asia/Aden', 'المنطقة الزمنية'),
('system', 'language', 'arabic', 'لغة النظام الافتراضية'),
('notifications', 'sms_enabled', 'false', 'تفعيل الرسائل النصية'),
('notifications', 'email_enabled', 'true', 'تفعيل البريد الإلكتروني'),
('notifications', 'whatsapp_enabled', 'false', 'تفعيل الواتس آب');

-- إدراج الخدمات الأساسية
INSERT OR IGNORE INTO services (name, name_en, description, duration_minutes, category, is_active) VALUES
('تنظيف الأسنان', 'Teeth Cleaning', 'تنظيف شامل ومهني لأسنانك مع أحدث التقنيات', 45, 'general', TRUE),
('حشوات الأسنان', 'Dental Fillings', 'حشوات تجميلية بأحدث المواد الطبية المعتمدة', 60, 'restorative', TRUE),
('تقويم الأسنان', 'Orthodontics', 'تقويم شامل بأحدث التقنيات الطبية المتقدمة', 90, 'orthodontics', TRUE),
('زراعة الأسنان', 'Dental Implants', 'زراعة متطورة مع ضمان طويل المدى', 120, 'surgery', TRUE),
('تبييض الأسنان', 'Teeth Whitening', 'تبييض آمن وفعال لابتسامة مشرقة', 60, 'cosmetic', TRUE),
('علاج الجذور', 'Root Canal Treatment', 'علاج متخصص للجذور بأحدث التقنيات', 90, 'endodontics', TRUE),
('فحص دوري', 'Regular Checkup', 'فحص شامل لصحة الفم والأسنان', 30, 'general', TRUE);

-- تفعيل القيود الخارجية
PRAGMA foreign_keys = ON;
