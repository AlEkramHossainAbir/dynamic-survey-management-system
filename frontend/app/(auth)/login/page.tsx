"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { setAuth } from "@/lib/auth";
import axios from "axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const fillAdmin = () => {
    setEmail("admin@example.com");
    setPassword("admin");
    setError("");
  };

  const fillOfficer = () => {
    setEmail("officer@example.com");
    setPassword("officer");
    setError("");
  };

  const handleLogin = async () => {
    setError("");
    setIsLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      const data = res.data;

      if (res.status === 200) {
        // Store token and user info in localStorage
        setAuth(data.token, data.user);

        // Redirect based on role
        if (data.user.role === "admin") {
          router.push("/admin/dashboard");
        } else if (data.user.role === "officer") {
          router.push("/officer/dashboard");
        }
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? "Invalid credentials");
      } else {
        setError("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="flex gap-2 mb-4">
          <Button
            variant="outline"
            className="w-auto"
            onClick={fillAdmin}
            type="button"
          >
            Admin
          </Button>

          <Button
            variant="outline"
            className="w-auto"
            onClick={fillOfficer}
            type="button"
          >
            Officer
          </Button>
        </div>

        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4"
        />
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4"
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />
        <Button onClick={handleLogin} className="w-full" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </div>
    </div>
  );
}
