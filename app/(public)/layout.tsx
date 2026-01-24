import Link from "next/link";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2">
                <h1 className="font-serif text-2xl font-bold text-primary">
                  Pools & Pool
                </h1>
                <span className="text-sm text-text-secondary">LUXURIOUS LOUNGE & BAR</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/admin/dashboard"
                className="text-sm text-primary hover:text-secondary transition-colors font-medium"
              >
                Admin
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background-alt mt-auto py-6">
        <div className="container mx-auto px-4 text-center text-sm text-text-secondary">
          <p>© {new Date().getFullYear()} Pools & Pool. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
