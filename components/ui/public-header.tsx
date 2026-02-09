"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { MenuIcon } from "@/components/ui/menu-icon";
import { cn } from "@/lib/utils";

export type DropdownLink = { href: string; label: string };

type PublicHeaderProps = {
  className?: string;
  textClassName?: string;
  menuHref?: string;
  menuText?: string;
  logoHref?: string;
  actions?: React.ReactNode;
  dropdownLinks?: DropdownLink[];
};

const defaultDropdownLinks: DropdownLink[] = [
  { href: "/", label: " Main Menu" },
];

export function PublicHeader({
  className,
  textClassName,
  menuHref,
  menuText = "MAIN MENU",
  logoHref = "/",
  actions,
  dropdownLinks = defaultDropdownLinks,
}: PublicHeaderProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between gap-3">
        <Link href={logoHref} className="inline-flex items-center hover:opacity-95 transition-opacity">
          <Image
            src="/logo/logo.png"
            alt="PS & P"
            width={110}
            height={44}
            className="w-30 xl:w-40 h-auto object-contain"
            priority
          />
        </Link>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Toggle menu"
            className={cn("md:hidden inline-flex items-center justify-center transition-colors outline-none focus:outline-none focus-visible:ring-0", textClassName)}
          >
            <MenuIcon />
          </button>
          {menuHref ? (
            <Link
              href={menuHref}
              aria-label="Main menu"
              className={cn("hidden md:inline text-sm font-medium tracking-[0.35em] underline-offset-8 hover:underline whitespace-nowrap outline-none focus:outline-none focus-visible:ring-0", textClassName)}
            >
              {menuText}
            </Link>
          ) : null}
          {actions}
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="menu-dropdown"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="md:hidden overflow-hidden"
          >
            <nav className="pt-2 pb-1 flex flex-col gap-0 border-t border-white/10  bg-[#1A1A1A]">
              {dropdownLinks.map((link) => (
                <Link
                  key={link.href + link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block py-3 text-center text-sm font-medium tracking-wide uppercase transition-colors",
                    textClassName ?? "text-white hover:text-[#C69C6D]"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
