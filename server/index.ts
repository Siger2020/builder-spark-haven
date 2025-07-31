import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { initializeDatabase } from "./database/index.js";
import {
  getDatabaseStatsHandler,
  getTablesHandler,
  getTableDataHandler,
  insertRecordHandler,
  updateRecordHandler,
  deleteRecordHandler,
  globalSearchHandler,
  createBackupHandler,
  getBackupsHandler,
  executeQueryHandler
} from "./routes/database.js";

export function createServer() {
  const app = express();

  // تهيئة قاعدة البيانات
  try {
    initializeDatabase();
    console.log("✅ تم تهيئة قاعدة البيانات بنجاح");
  } catch (error) {
    console.error("❌ فشل في تهيئة قاعدة البيانات:", error);
  }

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Database API routes
  app.get("/api/database/stats", getDatabaseStatsHandler);
  app.get("/api/database/tables", getTablesHandler);
  app.get("/api/database/tables/:tableName", getTableDataHandler);
  app.post("/api/database/tables/:tableName", insertRecordHandler);
  app.put("/api/database/tables/:tableName/:id", updateRecordHandler);
  app.delete("/api/database/tables/:tableName/:id", deleteRecordHandler);
  app.get("/api/database/search", globalSearchHandler);
  app.post("/api/database/backup", createBackupHandler);
  app.get("/api/database/backups", getBackupsHandler);
  app.post("/api/database/query", executeQueryHandler);

  return app;
}
