import Placeholder from "./Placeholder";

const features = [
  "إدارة ملفات المرضى الشاملة",
  "تاريخ العلاج والزيارات السابقة", 
  "الحالة الطبية والأدوية",
  "تصوير الأشعة والتقارير الطبية",
  "تذكيرات المواعيد التلقائية",
  "نظام البحث والتصفية المتقدم"
];

export default function Patients() {
  return (
    <Placeholder
      title="ملفات المرضى"
      description="نظام شامل لإدارة ملفات وبيانات المرضى بطريقة آمنة ومنظمة"
      features={features}
    />
  );
}
