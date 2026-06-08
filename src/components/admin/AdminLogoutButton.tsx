"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="font-outfit text-xs uppercase tracking-[0.2em]"
      onClick={handleLogout}
    >
      <LogOut className="mr-1.5 h-4 w-4" />
      Logout
    </Button>
  );
}
