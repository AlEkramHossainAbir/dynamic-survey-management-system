"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { hasRole } from "@/lib/auth";

export default function OfficerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    // Auth is already checked by parent (protected) layout
    // Only need to verify officer role here
    if (!hasRole("officer")) {
      router.replace("/admin/dashboard");
    }
  }, [router]);

  // Show nothing while checking role (prevents flash of wrong content)
  if (!hasRole("officer")) {
    return null;
  }

  return <>{children}</>;
}
