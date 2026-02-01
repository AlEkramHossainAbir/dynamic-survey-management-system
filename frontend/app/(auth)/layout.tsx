"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getUser } from "@/lib/auth";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    // If user is already logged in, redirect to their dashboard
    if (isAuthenticated()) {
      const user = getUser();
      if (user?.role === "admin") {
        router.replace("/admin/surveys");
      } else if (user?.role === "officer") {
        router.replace("/officer/surveys");
      }
    }
  }, [router]);

  return <>{children}</>;
}
