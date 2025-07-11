"use client";

import { IconAppsFilled, IconBarbellFilled, IconBowlSpoonFilled, IconDashboardFilled } from "@tabler/icons-react";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: IconDashboardFilled,
  },
  {
    title: "Meal Plans",
    url: "/meal-plans",
    icon: IconAppsFilled,
  },
  {
    title: "Recipes",
    url: "/recipes",
    icon: IconBowlSpoonFilled,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: IconBarbellFilled,
  },
];

export function NavMain() {
  const pathname = usePathname();
  const isActive = (path: string) => {
    return pathname === path || (path !== "/" && pathname.startsWith(`${path}/`));
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => {
            return (
              <SidebarMenuItem key={item.title}>
                <Link href={item.url}>
                  <SidebarMenuButton
                    className={clsx(
                      isActive(item.url) &&
                        "bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary active:bg-primary/10 active:text-primary"
                    )}
                    tooltip={item.title}
                  >
                    {item.icon && <item.icon className={clsx(isActive(item.url) && "text-primary")} />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
