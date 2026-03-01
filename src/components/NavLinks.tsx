"use client";

import clsx from "clsx";
import { Search, Truck, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLinks() {
  const pathname = usePathname();

  const links = [
    {
      label: "Consulta",
      href: "/",
      icon: Search,
      value: "consulta",
    },
    {
      label: "BDC",
      href: "/bdc",
      icon: Users,
      value: "bdc",
    },
    {
      label: "Logistica",
      href: "/logistica",
      icon: Truck,
      value: "logistica",
    },
  ];

  return (
    <div className="gap-6">
      <div className="w-full sm:w-auto grid grid-cols-3 sm:flex h-auto sm:h-9 bg-muted p-1 rounded-lg">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "flex items-center w-full justify-center gap-1.5 px-4 py-2 sm:py-1 rounded-md text-sm font-medium transition-all",
                isActive
                  ? "bg-[#f7f9fa] shadow-sm text-foreground"
                  : "text-muted-foreground hover:bg-background/50",
              )}
            >
              <Icon className="size-3.5" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
