import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { registerServiceWorker } from "./utils/notifications";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import PatientDetails from "./pages/PatientDetails";
import Analytics from "./pages/Analytics";

import Layout from "./components/Layout";
import ProtectedRoute from "./routes/ProtectedRoute";
import { useStore } from "./store/useStore";

export default function App() {
  const user = useStore((s) => s.user);
  const initAuthListener = useStore((s) => s.initAuthListener);

  // 🔔 Register notifications
  useEffect(() => {
    registerServiceWorker();
  }, []);

  // 🔐 Initialize Firebase auth listener (IMPORTANT)
  useEffect(() => {
    initAuthListener();
  }, [initAuthListener]);

  return (
    <BrowserRouter>
      <Routes>
        {/* 🔐 Login */}
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <Login />}
        />

        {/* 🏠 Dashboard */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* 👨‍⚕️ Patients */}
        <Route
          path="/patients"
          element={
            <ProtectedRoute>
              <Layout>
                <Patients />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* 📄 Patient Details */}
        <Route
          path="/patients/:patientId"
          element={
            <ProtectedRoute>
              <Layout>
                <PatientDetails />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* 📊 Analytics */}
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Layout>
                <Analytics />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* 🔁 Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}