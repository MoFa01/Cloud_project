"use client";

import Image from "next/image";
import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Logo from "../../../assets/logo.svg";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<"admin" | "worker">("worker");
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const url =
      role === "admin"
        ? "http://localhost:3001/admin/login"
        : "http://localhost:3001/worker/login";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        toast.success("Login successful");
        localStorage.setItem("role", role);
        router.push("/home"); // Change path based on your routing
      } else {
        const err = await response.json();
        toast.error(err.message || "Login failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1E3A8A] via-[#3B82F6] to-[#93C5FD] p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2"
      >
        {/* Branding */}
        <div className="flex flex-col items-center justify-center p-10 bg-[#1E3A8A] text-white">
          <div className="bg-white rounded-[20px] p-4 shadow-lg">
            <Image src={Logo} alt="Healthcare Logo" width={200} height={200} />
          </div>
          <h1 className="text-3xl font-bold mt-6 text-center">
            Limitless Care
          </h1>
          <p className="text-lg mt-2 text-center px-6 opacity-90">
            with Infinite Possibilities
          </p>
        </div>

        {/* Login Form */}
        <div className="p-10">
          <CardHeader className="space-y-2 mb-4 text-center">
            <CardTitle className="text-2xl text-[#1E3A8A] font-bold">
              Welcome Back
            </CardTitle>
            <p className="text-gray-500">Login to access your dashboard</p>
          </CardHeader>

          <CardContent className="space-y-5">
            <form onSubmit={handleLogin} className="space-y-5">
              <FormField
                label="Email Address"
                id="email"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="you@example.com"
              />
              <FormField
                label="Password"
                id="password"
                type="password"
                value={password}
                onChange={setPassword}
                placeholder="••••••••"
              />

              {/* Role Selection */}
              <div className="space-y-2">
                <Label htmlFor="role" className="text-[#1E3A8A] font-medium">
                  Role
                </Label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) =>
                    setRole(e.target.value as "admin" | "worker")
                  }
                  className="bg-gray-100 text-[#1E3A8A] rounded-md w-full px-4 py-2"
                >
                  <option value="worker">Worker</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <Button
                type="submit"
                variant="outline"
                size="default"
                disabled={loading}
                className="w-full bg-[#1E3A8A] hover:bg-[#2563EB] text-white hover:text-white font-bold"
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </CardContent>
        </div>
      </motion.div>
    </div>
  );
}

interface FormFieldProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

function FormField({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-[#1E3A8A] font-medium">
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.value)
        }
        required
        placeholder={placeholder}
        className="bg-gray-100 text-[#1E3A8A] placeholder:text-gray-400"
      />
    </div>
  );
}
