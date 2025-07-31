import Placeholder from "./Placeholder";

const features = [
  "كشوفات طبية مفصلة لكل مريض",
  "تقارير الفحص والتشخيص",
  "خطط العلاج المقترحة",
  "متابعة تطور الحالة",
  "تقارير الأشعة والفحوصات",
  "تصدير التقارير بصيغة PDF"
];

export default function Reports() {
  return (
    <Placeholder
      title="الكشوفات والتقارير"
      description="نظام شامل لإنشاء وإدارة الكشوفات الطبية والتقارير التفصيلية"
      features={features}
    />
  );
}
