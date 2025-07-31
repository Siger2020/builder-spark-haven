import Placeholder from "./Placeholder";

const features = [
  "جدولة جلسات العلاج المتعددة",
  "تتبع تقدم العلاج لكل مريض",
  "تذكيرات الجلسات القادمة",
  "توثيق تفاصيل كل جلسة",
  "خطط العلاج طويلة المدى",
  "إحصائيات فعالية العلاج"
];

export default function Sessions() {
  return (
    <Placeholder
      title="جلسات العلاج"
      description="إدارة شاملة لجلسات العلاج المتعددة ومتابعة تطور حالة المرضى"
      features={features}
    />
  );
}
