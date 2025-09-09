"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(true); // Default to true for new users
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams?.get("next") || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    console.log("[Frontend] SignInForm: Form submission with:", {
      originalUsername: username,
      originalPassword: password ? "[REDACTED]" : "EMPTY",
      trimmedUsername: trimmedUsername,
      trimmedPassword: trimmedPassword ? "[REDACTED]" : "EMPTY",
      usernameLength: trimmedUsername.length,
      passwordLength: trimmedPassword.length
    });

    if (!trimmedUsername || !trimmedPassword) {
      setError("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน");
      return;
    }

    // prevent double submit while already logging in
    if (isLoading) return;

    try {
      const success = await login(trimmedUsername, trimmedPassword, isChecked);
      if (success) {
        // Login successful - get the updated user from context
        // Note: user state should be updated by the login function
        const destination = nextParam && nextParam.startsWith("/") ? nextParam : "/";
        router.replace(destination);
      } else {
        setError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
      }
    } catch (error) {
      console.error("Login submission error:", error);
      setError("เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              ลงชื่อเข้าใช้
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              ลงชื่อเข้าใช้ด้วยบัญชีผู้ใช้ของคุณเพื่อเข้าถึงแดชบอร์ด
            </p>
          </div>

          <div>
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="mb-4 p-3 text-sm text-red-600 bg-red-100 border border-red-300 rounded-md dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                  {error}
                </div>
              )}
              <div className="space-y-6">
                <div>
                  <Label>
                    ชื่อผู้ใช้
                  </Label>
                  <Input
                    placeholder="info123fishstop"
                    type="text"
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label>
                    รหัสผ่าน
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="รหัสผ่าน"
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 
                      cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      จดจำฉันไว้ในระบบ
                    </span>
                  </div>
                  <Link
                    href="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    ลืมรหัสผ่าน?
                  </Link>
                </div>
                <div>
                  <button
                    className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "กำลังเข้าสู่ระบบ..." : "ลงชื่อเข้าใช้"}
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Don&apos;t have an account?&nbsp;
                <Link
                  href="/signup"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign Up
                </Link>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
