import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AuditProvider } from "./context/AuditContext";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <AuditProvider>
        <RouterProvider router={router} />
      </AuditProvider>
    </AuthProvider>
  );
}
