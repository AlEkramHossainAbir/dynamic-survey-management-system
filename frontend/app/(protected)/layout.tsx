"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    // Single authentication check for all protected routes
    if (!isAuthenticated()) {
      router.replace("/login");
    }
  }, [router]);

  // Show nothing while checking auth (prevents flash of protected content)
  if (!isAuthenticated()) {
    return null;
  }

  return <>{children}</>;
}
