import { createBrowserRouter } from "react-router";
import LandingPage from "./pages/LandingPage";
import UploadPage from "./pages/UploadPage";
import ScanningPage from "./pages/ScanningPage";
import AuditPage from "./pages/AuditPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import SharedAuditPage from "./pages/SharedAuditPage";
import ProfilePage from "./pages/ProfilePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";

export const router = createBrowserRouter([
  { path: "/", Component: LandingPage },
  { path: "/signin", Component: SignInPage },
  { path: "/signup", Component: SignUpPage },
  { path: "/forgot-password", Component: ForgotPasswordPage },
  { path: "/reset-password", Component: ChangePasswordPage },
  { path: "/upload", Component: UploadPage },
  { path: "/scanning", Component: ScanningPage },
  { path: "/audit", Component: AuditPage },
  { path: "/audit/shared", Component: SharedAuditPage },
  { path: "/profile", Component: ProfilePage },
]);
