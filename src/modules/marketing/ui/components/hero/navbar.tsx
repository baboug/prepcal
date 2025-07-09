import Link from "next/link";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  links: { label: string; href: string }[];
}

export function Navbar({ links }: NavbarProps) {
  return (
    <nav className="mb-12 flex w-full flex-1 flex-wrap items-center justify-between gap-4">
      <Logo />
      <div className="flex items-center gap-4">
        {links?.map((link) => (
          <Button asChild key={link.href} type="button" variant="outline">
            <Link href={link.href}>{link.label}</Link>
          </Button>
        ))}
      </div>
    </nav>
  );
}
