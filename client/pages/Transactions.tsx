import Placeholder from "./Placeholder";

const features = [
  "تتبع المدفوعات والمبالغ المستحقة",
  "فواتير مفصلة لكل علاج",
  "تقارير مالية شاملة",
  "إدارة التأمين الطبي",
  "خطط الدفع بالتقسيط",
  "تصدير التقارير المالية"
];

export default function Transactions() {
  return (
    <Placeholder
      title="المعاملات المالية"
      description="نظام شامل لإدارة المدفوعات والمبالغ المستحقة لجميع المرضى"
      features={features}
    />
  );
}
