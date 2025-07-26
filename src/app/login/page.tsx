"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      console.log("Logging in:", { email, password });
      await new Promise((r) => setTimeout(r, 1500));
      // TODO: handle success (redirect / set auth state)
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="md:mt-6 min-h-screen flex flex-col md:flex-row md:gap-x-50 items-center justify-center bg-[#B3905E]/15">
      <div className="mb-8 w-20 h-20 md:w-70 md:h-70 relative md:block hidden">
        <Image
            src="/FnF_Logo.png"
            alt="Fork & Friends logo"
            fill
            className="drop-shadow-lg object-contain"
            priority
        />
        </div>


      <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-10 sm:p-12">
        <h1 className="text-3xl font-extrabold text-center text-burgundy mb-8 tracking-wide drop-shadow-md">
          Sign In
        </h1>

        {error && (
          <div
            role="alert"
            className="mb-6 text-sm text-red-700 bg-red-100 border border-red-300 rounded-md px-5 py-3 font-semibold drop-shadow-sm"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-8" noValidate>
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full rounded-xl border border-gray-300 px-5 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-3 focus:ring-gold focus:border-transparent shadow-sm transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!error}
              disabled={loading}
            />
          </div>

        <div className="relative">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-700"
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
                className="w-full rounded-xl border border-gray-300 px-5 py-3 pr-12 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-3 focus:ring-gold focus:border-transparent shadow-sm transition"
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
                className="absolute top-1/2 right-3 -translate-y-1/2 flex items-center justify-center text-gray-400 hover:text-burgundy transition"
                >
                {showPassword ? (
                    <FiEyeOff className="h-6 w-6" />
                ) : (
                    <FiEye className="h-6 w-6" />
                )}
                </button>
            </div>
        </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-burgundy to-gold py-3 text-gray-900 text-lg font-semibold shadow-lg hover:from-burgundy/90 hover:to-gold/90 transition disabled:opacity-60 disabled:cursor-not-allowed active:scale-95"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

        </form>

        <p className="mt-8 text-center text-gray-600">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-burgundy hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
