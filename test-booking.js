// Test script to verify booking API functionality
const fetch = require('node-fetch');

const testBooking = {
  name: "أحمد محمد",
  phone: "777123456",
  email: "ahmed@test.com",
  date: "2024-12-30",
  time: "10:00 ص",
  service: "فحص عام",
  notes: "موعد تجريبي",
  bookingNumber: `BK${Date.now().toString().slice(-6)}`,
  doctorName: "د. كمال الملصي"
};

async function testBookingAPI() {
  try {
    console.log('🧪 اختبار API الحجز...');
    
    const response = await fetch('http://localhost:8080/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testBooking),
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ نجح اختبار الحجز:', result);
    } else {
      console.log('❌ فشل اختبار الحجز:', result);
    }
    
  } catch (error) {
    console.error('❌ خطأ في الاختبار:', error.message);
  }
}

testBookingAPI();
