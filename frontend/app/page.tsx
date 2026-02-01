"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getUser } from "@/lib/auth";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to appropriate dashboard if logged in
    if (isAuthenticated()) {
      const user = getUser();
      if (user?.role === "admin") {
        router.replace("/admin/surveys");
      } else if (user?.role === "officer") {
        router.replace("/officer/surveys");
      }
    } else {
      // Redirect to login if not authenticated
      router.replace("/login");
    }
  }, [router]);

  return null;
}
