import { RequestHandler } from "express";
import { db, getDatabaseStats, createBackup, globalSearch } from "../database/index.js";

// الحصول على إحصائيات قاعدة البيانات
export const getDatabaseStatsHandler: RequestHandler = (req, res) => {
  try {
    const stats = getDatabaseStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'خطأ في الحصول على إحصائيات قاعدة البيانات'
    });
  }
};

// عرض جميع الجداول
export const getTablesHandler: RequestHandler = (req, res) => {
  try {
    const tables = db.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
      ORDER BY name
    `).all();
    
    res.json({
      success: true,
      data: tables
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'خطأ في الحصول على قائمة الجداول'
    });
  }
};

// عرض محتويات جدول محدد
export const getTableDataHandler: RequestHandler = (req, res) => {
  try {
    const { tableName } = req.params;
    const { page = 1, limit = 20, search = '' } = req.query;
    
    // التحقق من صحة اسم الجدول
    const validTables = db.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
    `).all().map((t: any) => t.name);
    
    if (!validTables.includes(tableName)) {
      return res.status(400).json({
        success: false,
        error: 'اسم الجدول غير صالح'
      });
    }
    
    // الحصول على معلومات الأعمدة
    const columns = db.prepare(`PRAGMA table_info(${tableName})`).all();
    
    // إعداد البحث
    let whereClause = '';
    let searchValues: any[] = [];
    
    if (search) {
      const searchableColumns = columns
        .filter((col: any) => col.type.includes('TEXT') || col.type.includes('VARCHAR'))
        .map((col: any) => `${col.name} LIKE ?`);
      
      if (searchableColumns.length > 0) {
        whereClause = `WHERE ${searchableColumns.join(' OR ')}`;
        searchValues = new Array(searchableColumns.length).fill(`%${search}%`);
      }
    }
    
    // حساب إجمالي الصفوف
    const countQuery = `SELECT COUNT(*) as total FROM ${tableName} ${whereClause}`;
    const totalRows = db.prepare(countQuery).get(...searchValues) as { total: number };
    
    // الحصول على البيانات مع التصفح
    const offset = (Number(page) - 1) * Number(limit);
    const dataQuery = `
      SELECT * FROM ${tableName} 
      ${whereClause}
      ORDER BY id DESC 
      LIMIT ? OFFSET ?
    `;
    
    const rows = db.prepare(dataQuery).all(...searchValues, Number(limit), offset);
    
    res.json({
      success: true,
      data: {
        tableName,
        columns,
        rows,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(totalRows.total / Number(limit)),
          totalRows: totalRows.total,
          limit: Number(limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'خطأ في الحصول على بيانات الجدول'
    });
  }
};

// إضافة سجل جديد
export const insertRecordHandler: RequestHandler = (req, res) => {
  try {
    const { tableName } = req.params;
    const data = req.body;
    
    // التحقق من صحة اسم الجدول
    const validTables = db.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
    `).all().map((t: any) => t.name);
    
    if (!validTables.includes(tableName)) {
      return res.status(400).json({
        success: false,
        error: 'اسم الجدول غير صالح'
      });
    }
    
    // الحصول على معلومات الأعمدة
    const columns = db.prepare(`PRAGMA table_info(${tableName})`).all();
    
    // تصفية البيانات المرسلة لتشمل الأعمدة الموجودة فقط
    const validColumns = columns
      .filter((col: any) => col.name !== 'id' && col.name !== 'created_at' && col.name !== 'updated_at')
      .map((col: any) => col.name);
    
    const filteredData: any = {};
    validColumns.forEach(col => {
      if (data[col] !== undefined) {
        filteredData[col] = data[col];
      }
    });
    
    // إنشاء استعلام الإدراج
    const columnNames = Object.keys(filteredData);
    const placeholders = columnNames.map(() => '?').join(', ');
    const values = Object.values(filteredData);
    
    const insertQuery = `
      INSERT INTO ${tableName} (${columnNames.join(', ')}) 
      VALUES (${placeholders})
    `;
    
    const result = db.prepare(insertQuery).run(...values);
    
    res.json({
      success: true,
      data: {
        id: result.lastInsertRowid,
        insertedData: filteredData
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'خطأ في إضافة السجل'
    });
  }
};

// تحديث سجل
export const updateRecordHandler: RequestHandler = (req, res) => {
  try {
    const { tableName, id } = req.params;
    const data = req.body;
    
    // التحقق من صحة اسم الجدول
    const validTables = db.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
    `).all().map((t: any) => t.name);
    
    if (!validTables.includes(tableName)) {
      return res.status(400).json({
        success: false,
        error: 'اسم الجدول غير صالح'
      });
    }
    
    // الحصول على معلومات الأعمدة
    const columns = db.prepare(`PRAGMA table_info(${tableName})`).all();
    
    // تصفية البيانات المرسلة
    const validColumns = columns
      .filter((col: any) => col.name !== 'id' && col.name !== 'created_at')
      .map((col: any) => col.name);
    
    const filteredData: any = {};
    validColumns.forEach(col => {
      if (data[col] !== undefined) {
        filteredData[col] = data[col];
      }
    });
    
    // إضافة updated_at إذا كان العمود موجوداً
    if (columns.some((col: any) => col.name === 'updated_at')) {
      filteredData.updated_at = new Date().toISOString();
    }
    
    // إنشاء استعلام التحديث
    const columnNames = Object.keys(filteredData);
    const setClause = columnNames.map(col => `${col} = ?`).join(', ');
    const values = Object.values(filteredData);
    
    const updateQuery = `
      UPDATE ${tableName} 
      SET ${setClause} 
      WHERE id = ?
    `;
    
    const result = db.prepare(updateQuery).run(...values, id);
    
    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        error: 'السجل غير موجود'
      });
    }
    
    res.json({
      success: true,
      data: {
        id: Number(id),
        updatedData: filteredData,
        changes: result.changes
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'خطأ في تحديث السجل'
    });
  }
};

// حذف سجل
export const deleteRecordHandler: RequestHandler = (req, res) => {
  try {
    const { tableName, id } = req.params;
    
    // التحقق من صحة اسم الجدول
    const validTables = db.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
    `).all().map((t: any) => t.name);
    
    if (!validTables.includes(tableName)) {
      return res.status(400).json({
        success: false,
        error: 'اسم الجدول غير صالح'
      });
    }
    
    const deleteQuery = `DELETE FROM ${tableName} WHERE id = ?`;
    const result = db.prepare(deleteQuery).run(id);
    
    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        error: 'السجل غير موجود'
      });
    }
    
    res.json({
      success: true,
      data: {
        id: Number(id),
        changes: result.changes
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'خطأ في حذف السجل'
    });
  }
};

// البحث الشامل
export const globalSearchHandler: RequestHandler = (req, res) => {
  try {
    const { q: query, limit = 50 } = req.query;
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'نص البحث مطلوب'
      });
    }
    
    const results = globalSearch(query, Number(limit));
    
    res.json({
      success: true,
      data: {
        query,
        results,
        total: results.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'خطأ في البحث'
    });
  }
};

// إنشاء نسخة احتياطية
export const createBackupHandler: RequestHandler = async (req, res) => {
  try {
    const { name } = req.body;
    const result = await createBackup(name);
    
    if (result.success) {
      res.json({
        success: true,
        data: result
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'خطأ في إنشاء النسخة الاحتياطية'
    });
  }
};

// الحصول على قائمة النسخ الاحتياطية
export const getBackupsHandler: RequestHandler = (req, res) => {
  try {
    const backups = db.prepare(`
      SELECT id, backup_name, backup_type, file_size, status, created_at, completed_at
      FROM backups 
      ORDER BY created_at DESC
    `).all();
    
    res.json({
      success: true,
      data: backups
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'خطأ في الحصول على قائمة النسخ الاحتياطية'
    });
  }
};

// تنفيذ استعلام SQL مخصص (للمطورين فقط)
export const executeQueryHandler: RequestHandler = (req, res) => {
  try {
    const { query, params = [] } = req.body;
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'الاستعلام مطلوب'
      });
    }
    
    // منع استعلامات خطيرة
    const dangerousKeywords = ['DROP', 'DELETE', 'TRUNCATE', 'ALTER', 'CREATE', 'INSERT', 'UPDATE'];
    const upperQuery = query.toUpperCase();
    
    // السماح فقط بـ SELECT
    if (!upperQuery.trim().startsWith('SELECT')) {
      return res.status(403).json({
        success: false,
        error: 'مسموح فقط باستعلامات SELECT'
      });
    }
    
    const stmt = db.prepare(query);
    const result = stmt.all(...params);
    
    res.json({
      success: true,
      data: {
        query,
        results: result,
        count: result.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `خطأ في تنفيذ الاستعلام: ${error.message}`
    });
  }
};
