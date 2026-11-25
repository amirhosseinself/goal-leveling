"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { LayoutDashboard, Target, Sparkles, TrendingUp, User, CalendarCheck2, LogOut, LogIn } from "lucide-react";
import { ModeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard/daily", label: "امروز", icon: CalendarCheck2 },
  { href: "/dashboard", label: "داشبورد", icon: LayoutDashboard },
  { href: "/dashboard/goals", label: "اهداف", icon: Target },
  { href: "/dashboard/skills", label: "مهارت‌ها", icon: Sparkles },
  { href: "/dashboard/progress", label: "پیشرفت", icon: TrendingUp },
  { href: "/profile", label: "پروفایل", icon: User },
];

const Navbar = () => {
  const pathname = usePathname();
  const { status } = useSession();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const authed = mounted && status === "authenticated";

  return (
    <nav className="fixed top-0 inset-x-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-violet-500/30">GL</div>
            <span className="font-bold whitespace-nowrap hidden sm:inline">Goal Leveling</span>
          </Link>
          {authed && (
            <div className="flex items-center gap-1 overflow-x-auto py-1 no-scrollbar">
              {links.map((link) => {
                const Icon = link.icon;
                const active = link.href === "/dashboard" ? pathname === "/dashboard" : pathname === link.href || pathname.startsWith(link.href + "/");
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-label={link.label}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-1.5 text-sm whitespace-nowrap px-2.5 sm:px-3 py-2 rounded-xl transition-all",
                      active
                        ? "bg-primary/15 text-primary shadow-[inset_0_0_0_1px_rgba(139,92,246,0.2)]"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="hidden md:inline">{link.label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <ModeToggle />
          {mounted ? (
            authed ? (
              <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: "/login" })} className="gap-1.5">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">خروج</span>
              </Button>
            ) : (
              <Button asChild size="sm" className="gap-1.5">
                <Link href="/login"><LogIn className="h-4 w-4" /><span>ورود</span></Link>
              </Button>
            )
          ) : (
            <div className="h-10 w-[76px]" aria-hidden />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
