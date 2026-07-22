"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Route, BarChart3, Fuel, Car } from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/reports", label: "รายงาน", icon: BarChart3 },
  { href: "/fuel", label: "บันทึกค่าน้ำมัน", icon: Fuel },
];

const ADMIN_NAV_ITEM: NavItem = { href: "/vehicles", label: "จัดการรถ", icon: Car };

export function Sidebar({
  isAdmin,
  signOutSlot,
}: {
  isAdmin: boolean;
  signOutSlot: React.ReactNode;
}) {
  const pathname = usePathname();
  const items = isAdmin ? [...NAV_ITEMS, ADMIN_NAV_ITEM] : NAV_ITEMS;

  return (
    <nav className="flex w-56 shrink-0 flex-col gap-1 border-r border-border p-4">
      <Link href="/" className="mb-4 flex items-center gap-2 px-2">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Route className="size-4.5" />
        </div>
        <span className="font-semibold">Car Tracker Niti</span>
      </Link>

      {items.map((item) => {
        const isActive = pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
              isActive && "bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Icon className="size-4.5 shrink-0" />
            {item.label}
          </Link>
        );
      })}

      <div className="flex-1" />
      {signOutSlot}
    </nav>
  );
}
