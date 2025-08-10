#!/usr/bin/env node

// حذف فوري للبيانات التجريبية
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'clinic_database.sqlite');

console.log('🗑️ بدء حذف البيانات التجريبية...');

if (!fs.existsSync(dbPath)) {
  console.log('❌ ملف قاعدة البيانات غير موجود');
  process.exit(1);
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ خطأ في فتح قاعدة البيانات:', err.message);
    process.exit(1);
  }
  console.log('✅ تم الاتصال بقاعدة البيانات');
});

// تعطيل foreign keys
db.run('PRAGMA foreign_keys = OFF', (err) => {
  if (err) {
    console.error('❌ خطأ في تعطيل foreign keys:', err.message);
    return;
  }

  // حذف البيانات
  const deleteTables = [
    'DELETE FROM financial_transactions',
    'DELETE FROM appointments',
    'DELETE FROM patients', 
    'DELETE FROM doctors',
    'DELETE FROM users',
    'DELETE FROM activity_logs',
    'DELETE FROM notifications'
  ];

  let completed = 0;
  let totalDeleted = 0;

  deleteTables.forEach((sql, index) => {
    db.run(sql, function(err) {
      if (err) {
        console.log(`⚠️ تعذر تنفيذ: ${sql} - ${err.message}`);
      } else {
        totalDeleted += this.changes;
        if (this.changes > 0) {
          console.log(`🗑️ حذف ${this.changes} سجل من ${sql.split(' ')[2]}`);
        }
      }
      
      completed++;
      if (completed === deleteTables.length) {
        // إعادة تعيين تسلسل الجداول
        const resetSequences = [
          "DELETE FROM sqlite_sequence WHERE name = 'users'",
          "DELETE FROM sqlite_sequence WHERE name = 'patients'",
          "DELETE FROM sqlite_sequence WHERE name = 'doctors'",
          "DELETE FROM sqlite_sequence WHERE name = 'appointments'"
        ];

        let seqCompleted = 0;
        resetSequences.forEach(sql => {
          db.run(sql, (err) => {
            seqCompleted++;
            if (seqCompleted === resetSequences.length) {
              // إعادة تفعيل foreign keys
              db.run('PRAGMA foreign_keys = ON', (err) => {
                console.log(`✅ تم حذف ${totalDeleted} سجل بنجاح`);
                console.log('🎉 النظام الآن نظيف وجاهز للاستخدام!');
                
                // إغلاق قاعدة البيانات
                db.close((err) => {
                  if (err) {
                    console.error('❌ خطأ في إغلاق قاعدة البيانات:', err.message);
                  }
                  process.exit(0);
                });
              });
            }
          });
        });
      }
    });
  });
});
