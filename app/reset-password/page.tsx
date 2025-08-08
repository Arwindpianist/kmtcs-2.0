"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import { AdminAuthService } from "@/app/lib/adminAuth";

function ResetPasswordClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isVerifyingLink, setIsVerifyingLink] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const handleRecoveryLink = async () => {
      setErrorMessage(null);
      try {
        // 1) If Supabase appended a `code` param, exchange it for a session
        const code = searchParams.get("code");
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            setErrorMessage(error.message || "Invalid or expired recovery link.");
            setIsVerifyingLink(false);
            return;
          }
        }

        // 2) Confirm we now have a session (recovery session)
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          setErrorMessage("Invalid or expired recovery session. Please request a new password reset email.");
          setIsVerifyingLink(false);
          return;
        }

        setIsVerifyingLink(false);
      } catch (e: any) {
        setErrorMessage(e?.message || "Failed to verify recovery link.");
        setIsVerifyingLink(false);
      }
    };

    handleRecoveryLink();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (newPassword.length < 8) {
      setErrorMessage("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsProcessing(true);
    try {
      const { data: { user }, error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        setErrorMessage(error.message || "Failed to update password.");
        setIsProcessing(false);
        return;
      }

      // Optionally ensure only admins proceed to /admin
      let redirectPath = "/login";
      try {
        const isAdmin = await AdminAuthService.isAdmin();
        redirectPath = isAdmin ? "/admin" : "/login";
      } catch (_) {
        redirectPath = "/login";
      }

      setSuccessMessage("Password updated successfully. Redirecting...");
      // Small delay so the user can see the success message
      setTimeout(() => router.replace(redirectPath), 1200);
    } catch (e: any) {
      setErrorMessage(e?.message || "Unexpected error while updating password.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Suspense>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Reset your password</h1>
          <p className="text-sm text-gray-600 mb-6">Set a new password for your administrator account.</p>

          {isVerifyingLink ? (
            <div className="text-gray-700">Verifying recovery link…</div>
          ) : (
            <>
              {errorMessage && (
                <div className="mb-4 rounded-md bg-red-50 p-3 text-red-700 text-sm">
                  {errorMessage}
                </div>
              )}
              {successMessage && (
                <div className="mb-4 rounded-md bg-green-50 p-3 text-green-700 text-sm">
                  {successMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">New password</label>
                  <input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter new password"
                    required
                    autoComplete="new-password"
                    minLength={8}
                  />
                </div>

                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Confirm password</label>
                  <input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Re-enter new password"
                    required
                    autoComplete="new-password"
                    minLength={8}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full inline-flex justify-center items-center rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isProcessing ? "Updating…" : "Update password"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </Suspense>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordClient />
    </Suspense>
  );
} 