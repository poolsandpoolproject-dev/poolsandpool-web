"use client";

import { usePathname } from "next/navigation";
import { Container } from "@/components/ui/container";
import { PublicHeader } from "@/components/ui/public-header";

export function PublicTopbar() {
  const pathname = usePathname();
  const isHeroPage = pathname === "/" || pathname.startsWith("/menu/");

  if (isHeroPage) {
    return (
      <header className="absolute inset-x-0 top-0 z-50 bg-transparent">
        <Container className="py-4">
          <PublicHeader
            className="px-0 pt-0"
            menuHref="/"
            textClassName="text-white hover:text-white"
          />
        </Container>
      </header>
    );
  }

  return (
    <header className="bg-white">
      <Container className="py-4">
        <PublicHeader
          className="px-0 pt-0"
          menuHref="/"
          menuText="Main Menu"
          textClassName="text-primary hover:text-secondary font-medium"
        />
      </Container>
    </header>
  );
}

