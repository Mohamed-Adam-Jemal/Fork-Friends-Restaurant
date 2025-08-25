"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { supabase } from "@/lib/supabaseClient";
import Spinner from "@/components/ui/Spinner";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  // ✅ Check if user already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.replace("/admin"); // Redirect if logged in
      }
    };

    checkSession();

    // ✅ Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        router.replace("/admin");
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // ✅ Validate before sending
    if (email.length < 1) {
      setError("Please enter your email.");
      return;
    }
    
    // ✅ Validate before sending
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 1) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    // ✅ Supabase Auth login
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setError(loginError.message);
    } else {
      router.push("/admin");
    }

    setLoading(false);
  };

return (
  <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-[#F3EFE7]">
    {/* Logo */}
    <div className="mb-6 w-24 h-24 sm:w-28 sm:h-28 relative flex-shrink-0">
      <Image
        src="/logos/FnF_Logo.png"
        alt="Fork & Friends logo"
        fill
        className="drop-shadow-lg object-contain"
        priority
      />
    </div>

    {/* Card */}
    <div className="w-full max-w-sm sm:max-w-md bg-white backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-8 sm:p-10">
      {error && (
        <div
          role="alert"
          className="mb-5 sm:mb-6 text-sm text-red-700 bg-red-100 border border-red-300 rounded-md px-4 py-2 sm:px-5 sm:py-3 font-semibold drop-shadow-sm"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-6 sm:space-y-8" noValidate>
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-base font-semibold text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="w-full rounded-xl border border-gray-300 px-4 sm:px-5 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent shadow-sm transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!error}
            disabled={loading}
          />
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block mb-2 text-base font-semibold text-gray-700"
          >
            Password
          </label>
          <div className="relative flex items-center">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              minLength={6}
              placeholder="••••••••"
              className="w-full rounded-xl border border-gray-300 px-4 sm:px-5 py-3 pr-12 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent shadow-sm transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={!!error}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-burgundy transition"
            >
              {showPassword ? (
                <FiEyeOff className="h-5 w-5 sm:h-6 sm:w-6" />
              ) : (
                <FiEye className="h-5 w-5 sm:h-6 sm:w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          variant="secondary"
          className="w-full py-3 sm:py-4 text-base sm:text-lg rounded-xl font-semibold"
          type="submit"
          disabled={loading}
        >
          {loading ? "Logging In..." : "Login"}
        </Button>
      </form>
    </div>
  </div>
);
}