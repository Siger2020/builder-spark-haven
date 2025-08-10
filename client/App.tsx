import "./global.css";

import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ErrorBoundary from "./components/ErrorBoundary";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Booking from "./pages/Booking";
import Patients from "./pages/Patients";
import Transactions from "./pages/TransactionsSimple";
import TransactionsFallback from "./components/TransactionsFallback";
import Reports from "./pages/Reports";
import Sessions from "./pages/Sessions";
import Admin from "./pages/Admin";
import DatabaseManager from "./pages/DatabaseManager";
import PatientDashboard from "./pages/PatientDashboard";
import Doctors from "./pages/Doctors";
import Services from "./pages/Services";
import SystemCheck from "./pages/SystemCheck";
import AppointmentManagement from "./pages/AppointmentManagement";
import AdminDashboard from "./pages/AdminDashboard";
import NotificationSettings from "./pages/NotificationSettings";
import UserInfo from "./pages/UserInfo";
import AIAnalysis from "./pages/AIAnalysis";
import EmailJSDebugTest from "./pages/EmailJSDebugTest";
import SystemReset from "./pages/SystemReset";
import Welcome from "./pages/Welcome";
import NetlifyDiagnostics from "./pages/NetlifyDiagnostics";
import SystemDiagnostics from "./pages/SystemDiagnostics";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen">
            <Routes>
              {/* Public routes */}
              <Route
                path="/"
                element={
                  <>
                    <Navigation />
                    <Index />
                  </>
                }
              />
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/netlify-diagnostics" element={<NetlifyDiagnostics />} />
              <Route path="/diagnostics" element={<SystemDiagnostics />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected routes */}
              <Route
                path="/booking"
                element={
                  <ProtectedRoute>
                    <Navigation />
                    <Booking />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patients"
                element={
                  <ProtectedRoute requiredRole="doctor">
                    <Navigation />
                    <Patients />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/transactions"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Navigation />
                    <ErrorBoundary fallback={TransactionsFallback}>
                      <Transactions />
                    </ErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <ProtectedRoute requiredRole="doctor">
                    <Navigation />
                    <Reports />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/sessions"
                element={
                  <ProtectedRoute requiredRole="doctor">
                    <Navigation />
                    <Sessions />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Navigation />
                    <Admin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/database"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Navigation />
                    <DatabaseManager />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patient-dashboard"
                element={
                  <ProtectedRoute requiredRole="patient">
                    <Navigation />
                    <PatientDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/doctors"
                element={
                  <>
                    <Navigation />
                    <Doctors />
                  </>
                }
              />
              <Route
                path="/services"
                element={
                  <>
                    <Navigation />
                    <Services />
                  </>
                }
              />
              <Route
                path="/system-check"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Navigation />
                    <SystemCheck />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/appointment-management"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Navigation />
                    <AppointmentManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin-dashboard"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Navigation />
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Navigation />
                    <NotificationSettings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user-info"
                element={
                  <ProtectedRoute>
                    <Navigation />
                    <UserInfo />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ai-analysis"
                element={
                  <ProtectedRoute requiredRole="doctor">
                    <Navigation />
                    <AIAnalysis />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/emailjs-debug"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Navigation />
                    <EmailJSDebugTest />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/system-reset"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Navigation />
                    <SystemReset />
                  </ProtectedRoute>
                }
              />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route
                path="*"
                element={
                  <>
                    <Navigation />
                    <NotFound />
                  </>
                }
              />
            </Routes>
          </div>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </ErrorBoundary>
);

createRoot(document.getElementById("root")!).render(<App />);
