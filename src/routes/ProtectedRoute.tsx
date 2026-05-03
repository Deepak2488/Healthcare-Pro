// import type { ReactNode } from "react";
// import { Navigate } from "react-router-dom";
// import { useStore } from "../store/useStore";

// type ProtectedRouteProps = {
//   children: ReactNode;
// };

// export default function ProtectedRoute({ children }: ProtectedRouteProps) {
//   const user = useStore((s) => s.user);
//   const authLoading = useStore((s) => s.authLoading);

//   if (authLoading) {
//     return (
//       <div className="route-loader">
//         Checking secure session...
//       </div>
//     );
//   }

//   return user ? children : <Navigate to="/login" replace />;
// }
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useStore } from "../store/useStore";

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const user = useStore((s) => s.user);
  const authLoading = useStore((s) => s.authLoading);

  // 🔄 Show loader while checking session
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Checking secure session...
      </div>
    );
  }

  // 🔐 If not logged in → redirect
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ✅ If logged in → allow access
  return <>{children}</>;
}