import { useState, useEffect } from 'react';
import { emailJSService } from '../services/emailJSService';
import { EmailJSSettings, defaultEmailJSSettings, ConnectionStatus } from '../lib/emailConfig';

interface UseEmailJSReturn {
  settings: EmailJSSettings;
  updateSettings: (settings: EmailJSSettings) => void;
  saveSettings: () => Promise<boolean>;
  testConnection: () => Promise<boolean>;
  sendTestEmail: (email: string) => Promise<boolean>;
  sendTestBooking: (email: string) => Promise<{ success: boolean; appointmentId?: string }>;
  isLoading: boolean;
  isTesting: boolean;
  connectionStatus: ConnectionStatus;
  isConfigured: boolean;
}

export const useEmailJS = (): UseEmailJSReturn => {
  const [settings, setSettings] = useState<EmailJSSettings>(defaultEmailJSSettings);
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(ConnectionStatus.NOT_CONFIGURED);

  // تحديث الإعدادات
  const updateSettings = (newSettings: EmailJSSettings) => {
    setSettings(newSettings);
  };

  // حفظ الإعدادات
  const saveSettings = async (): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // تكوين الخدمة
      const configResult = emailJSService.configure(settings);
      
      if (!configResult.success) {
        console.error('EmailJS configuration errors:', configResult.errors);
        return false;
      }

      // حفظ في localStorage
      localStorage.setItem('emailjs_settings', JSON.stringify(settings));
      
      // تحديث حالة الاتصال
      setConnectionStatus(emailJSService.getConnectionStatus());
      
      return true;
    } catch (error) {
      console.error('Error saving EmailJS settings:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // اختبار الاتصال
  const testConnection = async (): Promise<boolean> => {
    setIsTesting(true);
    setConnectionStatus(ConnectionStatus.TESTING);
    
    try {
      const result = await emailJSService.testConnection();
      
      if (result.success) {
        setConnectionStatus(ConnectionStatus.CONNECTED);
        return true;
      } else {
        setConnectionStatus(ConnectionStatus.ERROR);
        return false;
      }
    } catch (error) {
      setConnectionStatus(ConnectionStatus.ERROR);
      return false;
    } finally {
      setIsTesting(false);
    }
  };

  // إرسال بريد اختبار
  const sendTestEmail = async (email: string): Promise<boolean> => {
    if (!emailJSService.isConfigured()) {
      return false;
    }

    setIsTesting(true);
    
    try {
      const result = await emailJSService.sendTestEmail(email);
      return result.success;
    } catch (error) {
      return false;
    } finally {
      setIsTesting(false);
    }
  };

  // إرسال اختبار حجز
  const sendTestBooking = async (email: string): Promise<{ success: boolean; appointmentId?: string }> => {
    if (!emailJSService.isConfigured()) {
      return { success: false };
    }

    setIsTesting(true);
    
    try {
      const result = await emailJSService.sendTestBookingNotification(email);
      return {
        success: result.success,
        appointmentId: result.appointmentId
      };
    } catch (error) {
      return { success: false };
    } finally {
      setIsTesting(false);
    }
  };

  // تحميل الإعدادات المحفوظة عند البدء
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('emailjs_settings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
        
        // تكوين الخدمة
        emailJSService.configure(parsedSettings);
        setConnectionStatus(emailJSService.getConnectionStatus());
      }
    } catch (error) {
      console.error('Error loading saved EmailJS settings:', error);
    }
  }, []);

  return {
    settings,
    updateSettings,
    saveSettings,
    testConnection,
    sendTestEmail,
    sendTestBooking,
    isLoading,
    isTesting,
    connectionStatus,
    isConfigured: emailJSService.isConfigured()
  };
};
