"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  // Check if already logged in
  useEffect(() => {
    let isMounted = true;

    const checkAdmin = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        });
        const data = await res.json();
        if (isMounted && data.admin) {
          router.replace("/admin");
        }
      } catch (err) {
        console.error(err);
      }
    };

    checkAdmin();

    return () => {
      isMounted = false;
    };
  }, []); // ✅ Empty dependency array - runs only once on mount

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) return setError("Please enter your email.");
    if (!validateEmail(email)) return setError("Please enter a valid email.");
    if (!password) return setError("Please enter your password.");

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // ✅ ensure cookie is set
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
      } else {
        router.push("/admin"); // redirect after successful login
      }
    } catch (err) {
      setError("Login failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 sm:px-6 lg:px-8 bg-[#F3EFE7]">
      <div className="mb-6 w-24 h-24 sm:w-28 sm:h-28 relative flex-shrink-0">
        <Image src="/logos/FnF_Logo.png" alt="Logo" fill className="object-contain" priority />
      </div>

      <div className="w-full max-w-sm sm:max-w-md bg-white backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-8 sm:p-10">
        {error && (
          <div className="mb-5 text-sm text-red-700 bg-red-100 border border-red-300 rounded-md px-4 py-2 font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6 sm:space-y-8" noValidate>
          <div>
            <label htmlFor="email" className="block mb-2 text-base font-semibold text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              placeholder="you@example.com"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold shadow-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-2 text-base font-semibold text-gray-700">
              Password
            </label>
            <div className="relative flex items-center">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold shadow-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-burgundy"
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="flex justify-center">
            <Button type="submit" variant="secondary" className="w-30 py-4 rounded-xl font-semibold" disabled={loading}>
              {loading ? (
                <span className="flex justify-center items-center gap-2">
                  Logging in <span className="w-4 h-4 border-2 border-t-white rounded-full animate-spin inline-block"></span>
                </span>
              ) : (
                "Login"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}