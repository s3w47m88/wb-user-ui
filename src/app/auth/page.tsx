"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseControl } from "@/lib/supabase-control";
import { useAuth } from "@/contexts/AuthContext";
import { formatSupabaseClientError } from "@/lib/supabase-errors";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { OrganizationSelector } from "@/components/auth/OrganizationSelector";

type AuthView =
  | "login"
  | "register"
  | "forgot-password"
  | "select-organization"
  | "confirm-email";

export default function AuthPage() {
  const router = useRouter();
  const { authError, selectOrganization } = useAuth();
  const [view, setView] = useState<AuthView>("login");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [pageError, setPageError] = useState("");

  const handleLoginSuccess = async () => {
    try {
      setPageError("");
      const supabaseControl = getSupabaseControl();

      // After login, check if email is confirmed before showing org selector
      const {
        data: { user },
      } = await supabaseControl.auth.getUser();

      if (!user?.email_confirmed_at) {
        // Email not confirmed, show confirmation message
        setRegisteredEmail(user?.email || "");
        setView("confirm-email");
      } else {
        // Email confirmed, show organization selector
        setView("select-organization");
      }
    } catch (error) {
      console.error("Failed to load authenticated user:", error);
      setPageError(
        formatSupabaseClientError(error, "Failed to load authenticated user."),
      );
    }
  };

  const handleRegisterSuccess = (email: string) => {
    // After registration, show email confirmation message
    setPageError("");
    setRegisteredEmail(email);
    setView("confirm-email");
  };

  const handleOrganizationSelect = (organizationId: string) => {
    // Sync selected organization into auth context before navigating
    selectOrganization(organizationId);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-100 flex items-center justify-center p-4">
      {(authError || pageError) && (
        <div className="fixed top-4 left-1/2 z-10 w-full max-w-md -translate-x-1/2 rounded-md border border-red-200 bg-white p-4 shadow-lg">
          <p className="text-sm font-semibold text-red-700">
            Authentication backend unavailable
          </p>
          <p className="mt-1 text-sm text-red-600">{pageError || authError}</p>
        </div>
      )}

      {view === "login" && (
        <LoginForm
          onSuccess={handleLoginSuccess}
          onSwitchToRegister={() => setView("register")}
          onForgotPassword={() => setView("forgot-password")}
        />
      )}

      {view === "register" && (
        <RegisterForm
          onSuccess={handleRegisterSuccess}
          onSwitchToLogin={() => setView("login")}
        />
      )}

      {view === "forgot-password" && (
        <ForgotPasswordForm onBack={() => setView("login")} />
      )}

      {view === "select-organization" && (
        <OrganizationSelector onSelect={handleOrganizationSelect} />
      )}

      {view === "confirm-email" && (
        <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Check Your Email
            </h2>
            <p className="text-gray-600 mb-6">
              We&apos;ve sent a confirmation email to{" "}
              <strong>{registeredEmail}</strong>
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Click the link in the email to verify your account, then return
              here to sign in.
            </p>

            <button
              onClick={() => setView("login")}
              className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition-colors"
            >
              Go to Sign In
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
