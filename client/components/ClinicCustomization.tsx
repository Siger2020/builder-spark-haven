import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Palette, 
  Upload, 
  Eye, 
  Save, 
  RotateCcw, 
  Brush,
  Type,
  Image as ImageIcon,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react';

interface ClinicTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  logoUrl: string;
  clinicName: string;
  tagline: string;
  fontFamily: string;
  borderRadius: string;
}

const defaultTheme: ClinicTheme = {
  primaryColor: '#0ea5e9',
  secondaryColor: '#64748b',
  accentColor: '#06b6d4',
  backgroundColor: '#ffffff',
  textColor: '#1e293b',
  logoUrl: '',
  clinicName: 'عيادة الدكتور كمال الملصي',
  tagline: 'أفضل رعاية لأسنانك',
  fontFamily: 'Tajawal',
  borderRadius: '8px'
};

const presetThemes = [
  {
    name: 'Classic Blue',
    nameAr: 'الأزرق الكلاسيكي',
    theme: {
      ...defaultTheme,
      primaryColor: '#0ea5e9',
      secondaryColor: '#64748b',
      accentColor: '#06b6d4'
    }
  },
  {
    name: 'Medical Green',
    nameAr: 'الأخضر الطبي',
    theme: {
      ...defaultTheme,
      primaryColor: '#10b981',
      secondaryColor: '#6b7280',
      accentColor: '#059669'
    }
  },
  {
    name: 'Dental White',
    nameAr: 'الأبيض السني',
    theme: {
      ...defaultTheme,
      primaryColor: '#374151',
      secondaryColor: '#9ca3af',
      accentColor: '#6b7280',
      backgroundColor: '#f8fafc'
    }
  },
  {
    name: 'Warm Orange',
    nameAr: 'البرتقالي الدافئ',
    theme: {
      ...defaultTheme,
      primaryColor: '#f97316',
      secondaryColor: '#78716c',
      accentColor: '#ea580c'
    }
  }
];

const fontOptions = [
  { value: 'Tajawal', label: 'تجوال', preview: 'مرحبا بكم في عيادتنا' },
  { value: 'Cairo', label: 'القاهرة', preview: 'مرحبا بكم في عيادتنا' },
  { value: 'Amiri', label: 'أميري', preview: 'مرحبا بكم في عيادتنا' },
  { value: 'Noto Sans Arabic', label: 'نوتو ساند', preview: 'مرحبا بكم في عيادتنا' }
];

export const ClinicCustomization: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<ClinicTheme>(defaultTheme);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('clinicTheme');
    if (savedTheme) {
      try {
        setCurrentTheme(JSON.parse(savedTheme));
      } catch (error) {
        console.error('Error loading saved theme:', error);
      }
    }
  }, []);

  const applyTheme = (theme: ClinicTheme) => {
    // Apply CSS custom properties
    const root = document.documentElement;
    root.style.setProperty('--dental-primary', theme.primaryColor);
    root.style.setProperty('--dental-secondary', theme.secondaryColor);
    root.style.setProperty('--dental-accent', theme.accentColor);
    root.style.setProperty('--dental-background', theme.backgroundColor);
    root.style.setProperty('--dental-text', theme.textColor);
    root.style.setProperty('--dental-radius', theme.borderRadius);
    root.style.setProperty('--dental-font', theme.fontFamily);
  };

  const handleThemeChange = (newTheme: Partial<ClinicTheme>) => {
    const updatedTheme = { ...currentTheme, ...newTheme };
    setCurrentTheme(updatedTheme);
    applyTheme(updatedTheme);
  };

  const handlePresetSelect = (preset: typeof presetThemes[0]) => {
    setCurrentTheme(preset.theme);
    applyTheme(preset.theme);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Save to localStorage
      localStorage.setItem('clinicTheme', JSON.stringify(currentTheme));
      
      // Here you would also save to your backend API
      const response = await fetch('/api/clinic/theme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentTheme),
      });

      if (response.ok) {
        alert('تم حفظ إعدادات التخصيص بنجاح!');
      } else {
        throw new Error('Failed to save theme');
      }
    } catch (error) {
      console.error('Error saving theme:', error);
      alert('حدث خطأ أثناء حفظ الإعدادات');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (confirm('هل أنت متأكد من إعادة تعيين جميع الإعدادات إلى الافتراضية؟')) {
      setCurrentTheme(defaultTheme);
      applyTheme(defaultTheme);
      localStorage.removeItem('clinicTheme');
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('حجم الملف كبير جداً. يرجى اختيار صورة أصغر من 2 ميجابايت.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const logoUrl = e.target?.result as string;
        handleThemeChange({ logoUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  const getPreviewClasses = () => {
    switch (previewMode) {
      case 'mobile':
        return 'w-80 h-96';
      case 'tablet':
        return 'w-96 h-80';
      default:
        return 'w-full h-80';
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-arabic">تخصيص العيادة</h2>
          <p className="text-gray-600 font-arabic">
            قم بتخصيص مظهر العيادة وهويتها البصرية
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleReset} variant="outline" className="font-arabic">
            <RotateCcw className="h-4 w-4 mr-2" />
            إعادة تعيين
          </Button>
          <Button onClick={handleSave} disabled={isLoading} className="font-arabic">
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="colors" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full font-arabic">
          <TabsTrigger value="colors" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            الألوان
          </TabsTrigger>
          <TabsTrigger value="branding" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            الهوية
          </TabsTrigger>
          <TabsTrigger value="typography" className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            الخطوط
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            المعاينة
          </TabsTrigger>
        </TabsList>

        <TabsContent value="colors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-arabic">القوالب الجاهزة</CardTitle>
              <CardDescription className="font-arabic">
                اختر من القوالب الجاهزة للبدء السريع
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {presetThemes.map((preset, index) => (
                  <Card
                    key={index}
                    className="cursor-pointer hover:shadow-lg transition-shadow duration-300"
                    onClick={() => handlePresetSelect(preset)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="flex gap-1 justify-center mb-3">
                        <div
                          className="w-6 h-6 rounded-full"
                          style={{ backgroundColor: preset.theme.primaryColor }}
                        />
                        <div
                          className="w-6 h-6 rounded-full"
                          style={{ backgroundColor: preset.theme.secondaryColor }}
                        />
                        <div
                          className="w-6 h-6 rounded-full"
                          style={{ backgroundColor: preset.theme.accentColor }}
                        />
                      </div>
                      <h4 className="font-semibold font-arabic text-sm">
                        {preset.nameAr}
                      </h4>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-arabic">تخصيص الألوان</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="font-arabic">اللون الأساسي</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={currentTheme.primaryColor}
                      onChange={(e) => handleThemeChange({ primaryColor: e.target.value })}
                      className="w-16 h-10 p-1 rounded"
                    />
                    <Input
                      type="text"
                      value={currentTheme.primaryColor}
                      onChange={(e) => handleThemeChange({ primaryColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-arabic">اللون الثانوي</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={currentTheme.secondaryColor}
                      onChange={(e) => handleThemeChange({ secondaryColor: e.target.value })}
                      className="w-16 h-10 p-1 rounded"
                    />
                    <Input
                      type="text"
                      value={currentTheme.secondaryColor}
                      onChange={(e) => handleThemeChange({ secondaryColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-arabic">اللون المميز</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={currentTheme.accentColor}
                      onChange={(e) => handleThemeChange({ accentColor: e.target.value })}
                      className="w-16 h-10 p-1 rounded"
                    />
                    <Input
                      type="text"
                      value={currentTheme.accentColor}
                      onChange={(e) => handleThemeChange({ accentColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-arabic">لون الخلفية</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={currentTheme.backgroundColor}
                      onChange={(e) => handleThemeChange({ backgroundColor: e.target.value })}
                      className="w-16 h-10 p-1 rounded"
                    />
                    <Input
                      type="text"
                      value={currentTheme.backgroundColor}
                      onChange={(e) => handleThemeChange({ backgroundColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-arabic">لون النص</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={currentTheme.textColor}
                      onChange={(e) => handleThemeChange({ textColor: e.target.value })}
                      className="w-16 h-10 p-1 rounded"
                    />
                    <Input
                      type="text"
                      value={currentTheme.textColor}
                      onChange={(e) => handleThemeChange({ textColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-arabic">شعار العيادة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                {currentTheme.logoUrl && (
                  <div className="w-20 h-20 border-2 border-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={currentTheme.logoUrl}
                      alt="شعار العيادة"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <Label htmlFor="logo-upload" className="font-arabic cursor-pointer">
                    <Button variant="outline" className="font-arabic" asChild>
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        رفع شعار جديد
                      </span>
                    </Button>
                  </Label>
                  <Input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <p className="text-xs text-gray-500 mt-2 font-arabic">
                    حجم أقصى: 2 ميجابايت • أفضل أبعاد: 200x200 بكسل
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-arabic">معلومات العيادة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="font-arabic">اسم العيادة</Label>
                <Input
                  value={currentTheme.clinicName}
                  onChange={(e) => handleThemeChange({ clinicName: e.target.value })}
                  placeholder="اسم العيادة"
                  className="font-arabic"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-arabic">الشعار النصي</Label>
                <Input
                  value={currentTheme.tagline}
                  onChange={(e) => handleThemeChange({ tagline: e.target.value })}
                  placeholder="الشعار النصي للعيادة"
                  className="font-arabic"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="typography" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-arabic">نوع الخط</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fontOptions.map((font) => (
                  <Card
                    key={font.value}
                    className={`cursor-pointer transition-all duration-300 ${
                      currentTheme.fontFamily === font.value
                        ? 'ring-2 ring-dental-primary bg-blue-50'
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => handleThemeChange({ fontFamily: font.value })}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-bold font-arabic">{font.label}</h4>
                        {currentTheme.fontFamily === font.value && (
                          <Badge className="bg-dental-primary">محدد</Badge>
                        )}
                      </div>
                      <p
                        className="text-lg"
                        style={{ fontFamily: font.value }}
                      >
                        {font.preview}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="font-arabic">معاينة التصميم</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant={previewMode === 'desktop' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPreviewMode('desktop')}
                  >
                    <Monitor className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={previewMode === 'tablet' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPreviewMode('tablet')}
                  >
                    <Tablet className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={previewMode === 'mobile' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPreviewMode('mobile')}
                  >
                    <Smartphone className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className={`mx-auto border-2 border-gray-200 rounded-lg overflow-hidden ${getPreviewClasses()}`}>
                <div
                  className="w-full h-full p-6 text-center"
                  style={{
                    backgroundColor: currentTheme.backgroundColor,
                    color: currentTheme.textColor,
                    fontFamily: currentTheme.fontFamily
                  }}
                >
                  {currentTheme.logoUrl && (
                    <img
                      src={currentTheme.logoUrl}
                      alt="شعار العيادة"
                      className="w-16 h-16 mx-auto mb-4 object-contain"
                    />
                  )}
                  <h1
                    className="text-2xl font-bold mb-2 font-arabic"
                    style={{ color: currentTheme.primaryColor }}
                  >
                    {currentTheme.clinicName}
                  </h1>
                  <p
                    className="text-lg mb-4 font-arabic"
                    style={{ color: currentTheme.secondaryColor }}
                  >
                    {currentTheme.tagline}
                  </p>
                  <Button
                    className="font-arabic"
                    style={{
                      backgroundColor: currentTheme.primaryColor,
                      borderRadius: currentTheme.borderRadius
                    }}
                  >
                    احجز موعداً الآن
                  </Button>
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <div
                      className="p-2 rounded"
                      style={{
                        backgroundColor: currentTheme.primaryColor + '20',
                        borderRadius: currentTheme.borderRadius
                      }}
                    >
                      <p className="text-sm font-arabic">اللون الأساسي</p>
                    </div>
                    <div
                      className="p-2 rounded"
                      style={{
                        backgroundColor: currentTheme.secondaryColor + '20',
                        borderRadius: currentTheme.borderRadius
                      }}
                    >
                      <p className="text-sm font-arabic">اللون الثانوي</p>
                    </div>
                    <div
                      className="p-2 rounded"
                      style={{
                        backgroundColor: currentTheme.accentColor + '20',
                        borderRadius: currentTheme.borderRadius
                      }}
                    >
                      <p className="text-sm font-arabic">اللون المميز</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClinicCustomization;
