import Link from "next/link";
import { Container } from "@/components/ui/container";
import { MenuIcon } from "@/components/ui/menu-icon";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-white">
        <Container className="py-4">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="flex items-baseline gap-3 min-w-0">
              <h1 className="font-serif text-2xl font-bold text-primary truncate">Pools & Pool</h1>
              <span className="hidden sm:inline text-sm text-text-secondary">LUXURIOUS LOUNGE & BAR</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/#about-us"
                aria-label="Main menu"
                className="inline-flex items-center justify-center text-primary hover:text-secondary transition-colors font-medium"
              >
                <MenuIcon className="sm:hidden" />
                <span className="hidden sm:inline">Main Menu</span>
              </Link>
              <Link
                href="/admin/dashboard"
                className="text-sm text-primary hover:text-secondary transition-colors font-medium"
              >
                Admin
              </Link>
            </div>
          </div>
        </Container>
      </header>

      <main className="flex-1">
        <Container className="py-8">{children}</Container>
      </main>

      <footer className="border-t border-border bg-background-alt py-6">
        <Container className="text-center text-sm text-text-secondary">
          <p>© {new Date().getFullYear()} Pools & Pool. All rights reserved.</p>
        </Container>
      </footer>
    </div>
  );
}

