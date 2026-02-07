"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn } from "lucide-react";
import { login, isAuthenticated } from "@/lib/auth";
import { PasswordInput } from "@/components/ui/password-input";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated()) {
      const redirect = searchParams.get("redirect") || "/admin/dashboard";
      router.push(redirect);
    }
  }, [router, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Use auth utility
    const success = await login(email, password);

    if (success) {
      // Get redirect URL from query params or default to dashboard
      const redirectTo = searchParams.get("redirect") || "/admin/dashboard";

      // Redirect to intended destination or dashboard
      router.push(redirectTo);
      router.refresh();
    } else {
      setError("Invalid email or password");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full overflow-auto">
      <div
        className="min-h-full flex items-center justify-center bg-center bg-cover"
        style={{ backgroundImage: "url(/bar.jpg)" }}
      >
        <div className="fixed inset-0 bg-black/55" />
        <div className="relative bg-white/95 backdrop-blur border border-border rounded-lg p-8 w-full max-w-[500px] shadow-lg mx-4 my-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
          </div>
          <h1 className="font-serif text-3xl font-bold text-primary mb-2">
            Admin Login
          </h1>
          <p className="text-text-secondary">Sign in to access the dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-text-primary mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 text-black border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="admin@poolsandpool.com"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-text-primary mb-2"
            >
              Password
            </label>
            <PasswordInput
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-auto px-4 py-2 text-black rounded-lg focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer w-full py-2 bg-primary text-white rounded-lg font-medium hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                Sign In
              </>
            )}
          </button>
        </form>
      </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="fixed inset-0 flex items-center justify-center bg-background-alt">
        <div className="text-text-secondary">Loading...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
