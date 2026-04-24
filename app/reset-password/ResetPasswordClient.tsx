"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ResetPasswordClient() {
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isVerifying, setIsVerifying] = useState(Boolean(token));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean>(!token);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) return;
      setIsVerifying(true);
      setErrorMessage(null);
      try {
        const response = await fetch(`/api/auth/verify-reset-token?token=${encodeURIComponent(token)}`);
        const payload = await response.json();
        if (!response.ok || !payload.valid) {
          setTokenValid(false);
          setErrorMessage(payload.error || "Invalid reset link.");
          return;
        }
        setTokenValid(true);
      } catch {
        setTokenValid(false);
        setErrorMessage("Failed to verify reset link.");
      } finally {
        setIsVerifying(false);
      }
    };
    verifyToken();
  }, [token]);

  const requestResetLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/request-password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const payload = await response.json();
      if (!response.ok) {
        setErrorMessage(payload.error || "Failed to send reset link.");
        return;
      }
      setSuccessMessage("If your email exists in our system, a password reset link has been sent.");
    } catch {
      setErrorMessage("Unexpected error while sending reset link.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetPassword = async (e: React.FormEvent) => {
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

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });
      const payload = await response.json();
      if (!response.ok) {
        setErrorMessage(payload.error || "Failed to reset password.");
        return;
      }
      setSuccessMessage("Password updated successfully. You can now sign in with your new password.");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setErrorMessage("Unexpected error while resetting password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          {token ? "Set a new password" : "Forgot password"}
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          {token
            ? "Create a new password for your account."
            : "Enter your account email and we will send you a reset link."}
        </p>

        {isVerifying ? (
          <div className="text-gray-700">Verifying reset link...</div>
        ) : (
          <>
            {errorMessage && (
              <div className="mb-4 rounded-md bg-red-50 p-3 text-red-700 text-sm">{errorMessage}</div>
            )}
            {successMessage && (
              <div className="mb-4 rounded-md bg-green-50 p-3 text-green-700 text-sm">{successMessage}</div>
            )}

            {!token ? (
              <form onSubmit={requestResetLink} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter your email"
                    required
                    autoComplete="email"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex justify-center items-center rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? "Sending..." : "Send reset link"}
                </button>
              </form>
            ) : tokenValid ? (
              <form onSubmit={resetPassword} className="space-y-4">
                <div>
                  <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">New password</label>
                  <input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
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
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Re-enter new password"
                    required
                    autoComplete="new-password"
                    minLength={8}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex justify-center items-center rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? "Updating..." : "Update password"}
                </button>
              </form>
            ) : (
              <p className="text-sm text-gray-700">Please request a new password reset link.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
