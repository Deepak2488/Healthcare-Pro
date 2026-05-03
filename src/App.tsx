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

// export default function App() {
//   const user = useStore((s) => s.user);

//   useEffect(() => {
//     registerServiceWorker();
//   }, []);

//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />

//         <Route
//           path="/"
//           element={
//             <ProtectedRoute>
//               <Layout>
//                 <Dashboard />
//               </Layout>
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/patients"
//           element={
//             <ProtectedRoute>
//               <Layout>
//                 <Patients />
//               </Layout>
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/patients/:patientId"
//           element={
//             <ProtectedRoute>
//               <Layout>
//                 <PatientDetails />
//               </Layout>
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/analytics"
//           element={
//             <ProtectedRoute>
//               <Layout>
//                 <Analytics />
//               </Layout>
//             </ProtectedRoute>
//           }
//         />

//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

export default function App() {
  const user = useStore((s) => s.user);

  useEffect(() => {
    registerServiceWorker();
  }, []);

  // ✅ ADD THIS BLOCK HERE
  useEffect(() => {
    const stored = localStorage.getItem("healthcare-user");
    if (stored) {
      useStore.getState().setUser(JSON.parse(stored));
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />

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

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
