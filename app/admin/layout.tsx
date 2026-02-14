"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  ChevronLeft,
  LayoutDashboard,
  FolderTree,
  Folder,
  FileText,
  Calendar,
  ChevronDown,
  ChevronRight,
  User,
  Settings,
  LogOut,
  ExternalLink,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { logout } from "@/lib/auth";
import { authHooks } from "@/lib/api";
import { LogoutConfirmationDialog } from "@/components/admin/logout-confirmation-dialog";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [menuManagementOpen, setMenuManagementOpen] = useState(true);
  const [eventsManagementOpen, setEventsManagementOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const pathname = usePathname();
  const meQuery = authHooks.useMe({ enabled: pathname !== "/admin/login" && pathname !== "/login" });
  const userName =
    meQuery.data?.name ||
    [meQuery.data?.firstName, meQuery.data?.lastName].filter(Boolean).join(" ") ||
    meQuery.data?.email ||
    "Account";

  useEffect(() => {
    if (pathname === "/admin/login" || pathname === "/login") return;
    if (meQuery.isError) void logout();
    if (meQuery.data && meQuery.data.role !== "admin") void logout();
  }, [pathname, meQuery.isError, meQuery.data]);

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
      setLogoutDialogOpen(false);
    }
  };

  // Handle mobile detection and sidebar state
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false); // Hide sidebar on mobile
      } else {
        setSidebarOpen(true); // Show sidebar on desktop
      }
    };

    checkMobile(); // Initial check
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Don't render layout for login page - must be after all hooks
  if (pathname === "/admin/login" || pathname === "/login") {
    return <>{children}</>;
  }

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileSidebarOpen(!mobileSidebarOpen);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };
  const toggleMenuManagement = () => setMenuManagementOpen(!menuManagementOpen);
  const toggleEventsManagement = () => setEventsManagementOpen(!eventsManagementOpen);

  // Sidebar content component (reusable)
  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className="h-full flex flex-col">
      {/* Logo Area */}
      <div className="h-16 border-b border-border flex items-center px-4">
        {(!isMobile && sidebarOpen) || isMobile ? (
          <h2 className="font-serif text-xl font-bold text-primary">
            Pools & Pool
          </h2>
        ) : (
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">P</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
        {/* Overview */}
        <Link
          href="/admin/dashboard"
          onClick={() => isMobile && setMobileSidebarOpen(false)}
          className={`flex items-center rounded-lg transition-colors ${
            (!isMobile && sidebarOpen) || isMobile
              ? "gap-3 px-3 py-2"
              : "justify-center px-2 py-2 mx-auto w-10"
          } ${
            pathname === "/admin/dashboard"
              ? "bg-primary text-white"
              : "text-text-primary hover:bg-background-alt"
          }`}
        >
          <LayoutDashboard className="h-5 w-5 shrink-0" />
          {((!isMobile && sidebarOpen) || isMobile) && <span>Overview</span>}
        </Link>

        {/* Menu Management */}
        <div className="pt-2">
          {((!isMobile && sidebarOpen) || isMobile) && (
            <button
              onClick={toggleMenuManagement}
              className="w-full flex items-center justify-between px-3 py-2 text-text-secondary uppercase text-xs tracking-wide hover:text-text-primary transition-colors"
            >
              <span>Menu Management</span>
              {menuManagementOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          )}
          {(!isMobile && !sidebarOpen) || menuManagementOpen ? (
            <div className="space-y-1 mt-1">
              <Link
                href="/admin/menu/categories"
                onClick={() => isMobile && setMobileSidebarOpen(false)}
                className={`flex items-center rounded-lg transition-colors ${
                  (!isMobile && sidebarOpen) || isMobile
                    ? "gap-3 px-3 py-2"
                    : "justify-center px-2 py-2 mx-auto w-10"
                } ${
                  pathname === "/admin/menu/categories"
                    ? "bg-primary text-white"
                    : "text-text-primary hover:bg-background-alt"
                }`}
              >
                <FolderTree className="h-5 w-5 shrink-0" />
                {((!isMobile && sidebarOpen) || isMobile) && (
                  <span>Categories</span>
                )}
              </Link>
              <Link
                href="/admin/menu/sections"
                onClick={() => isMobile && setMobileSidebarOpen(false)}
                className={`flex items-center rounded-lg transition-colors ${
                  (!isMobile && sidebarOpen) || isMobile
                    ? "gap-3 px-3 py-2"
                    : "justify-center px-2 py-2 mx-auto w-10"
                } ${
                  pathname === "/admin/menu/sections"
                    ? "bg-primary text-white"
                    : "text-text-primary hover:bg-background-alt"
                }`}
              >
                <Folder className="h-5 w-5 shrink-0" />
                {((!isMobile && sidebarOpen) || isMobile) && <span>Sections</span>}
              </Link>
              <Link
                href="/admin/menu/items"
                onClick={() => isMobile && setMobileSidebarOpen(false)}
                className={`flex items-center rounded-lg transition-colors ${
                  (!isMobile && sidebarOpen) || isMobile
                    ? "gap-3 px-3 py-2"
                    : "justify-center px-2 py-2 mx-auto w-10"
                } ${
                  pathname.startsWith("/admin/menu/items")
                    ? "bg-primary text-white"
                    : "text-text-primary hover:bg-background-alt"
                }`}
              >
                <FileText className="h-5 w-5 shrink-0" />
                {((!isMobile && sidebarOpen) || isMobile) && (
                  <span>Menu Items</span>
                )}
              </Link>
            </div>
          ) : null}
        </div>

        {/* Events Management */}
        <div className="pt-2">
          {((!isMobile && sidebarOpen) || isMobile) && (
            <button
              onClick={toggleEventsManagement}
              className="w-full flex items-center justify-between px-3 py-2 text-text-secondary uppercase text-xs tracking-wide hover:text-text-primary transition-colors"
            >
              <span>Events Management</span>
              {eventsManagementOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          )}
          {(!isMobile && !sidebarOpen) || eventsManagementOpen ? (
            <div className="space-y-1 mt-1">
              <Link
                href="/admin/events"
                onClick={() => isMobile && setMobileSidebarOpen(false)}
                className={`flex items-center rounded-lg transition-colors ${
                  (!isMobile && sidebarOpen) || isMobile
                    ? "gap-3 px-3 py-2"
                    : "justify-center px-2 py-2 mx-auto w-10"
                } ${
                  pathname.startsWith("/admin/events") &&
                  pathname !== "/admin/events/create"
                    ? "bg-primary text-white"
                    : "text-text-primary hover:bg-background-alt"
                }`}
              >
                <Calendar className="h-5 w-5 shrink-0" />
                {((!isMobile && sidebarOpen) || isMobile) && <span>Events</span>}
              </Link>
            </div>
          ) : null}
        </div>
      </nav>

      <div className="border-t border-border p-4">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => isMobile && setMobileSidebarOpen(false)}
          className={`flex items-center rounded-lg transition-colors ${
            (!isMobile && sidebarOpen) || isMobile
              ? "gap-3 px-3 py-2"
              : "justify-center px-2 py-2 mx-auto w-10"
          } text-text-secondary hover:bg-background-alt hover:text-primary`}
        >
          <ExternalLink className="h-5 w-5 shrink-0" />
          {((!isMobile && sidebarOpen) || isMobile) && <span>Go to website</span>}
        </Link>
      </div>
    </div>
  );

  return (
    <div className="h-screen overflow-hidden bg-background-alt flex flex-col">
      <div className="flex flex-1 min-h-0">
        {/* Desktop Sidebar */}
        <aside
          className={`hidden md:block shrink-0 ${
            sidebarOpen ? "w-64" : "w-16"
          } bg-white border-r border-border h-full transition-all duration-300`}
        >
          <SidebarContent isMobile={false} />
        </aside>

        {/* Mobile Sidebar Sheet */}
        <Sheet open={isMobile && mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
          <SheetContent side="left" className="w-64 p-0">
            <SidebarContent isMobile={true} />
          </SheetContent>
        </Sheet>
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          {/* Header Bar */}
          <header className="h-16 bg-white border-b border-border sticky top-0 z-10 flex items-center">
            <div className="px-4 md:px-6 w-full flex items-center justify-between">
              <div className="flex items-center gap-2 md:gap-4">
                <button
                  onClick={toggleSidebar}
                  className="p-2 hover:bg-background-alt rounded-lg transition-colors border-0 outline-none focus:outline-none focus:ring-0 shadow-none"
                  aria-label="Toggle sidebar"
                >
                  {isMobile ? (
                    <Menu className="h-5 w-5 text-text-primary" />
                  ) : sidebarOpen ? (
                    <ChevronLeft className="h-5 w-5 text-text-primary" />
                  ) : (
                    <Menu className="h-5 w-5 text-text-primary" />
                  )}
                </button>
                <h1 className="text-lg md:text-xl font-semibold text-text-primary truncate">
                  Dashboard
                </h1>
              </div>
              <div className="flex items-center gap-2 md:gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-background-alt transition-colors text-text-secondary hover:text-text-primary focus:outline-none focus:ring-0 focus:ring-offset-0">
                      <User className="h-5 w-5" />
                      <span className="hidden md:inline">{userName}</span>
                      <ChevronDown className="h-4 w-4 hidden md:inline" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link href="/admin/settings" className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/profile" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      variant="destructive"
                      className="cursor-pointer"
                      onClick={() => setLogoutDialogOpen(true)}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 p-4 md:p-6 bg-background-alt overflow-auto">
            {children}
          </main>
        </div>
      </div>

      <LogoutConfirmationDialog
        open={logoutDialogOpen}
        onOpenChange={(open) => {
          if (isLoggingOut) return;
          setLogoutDialogOpen(open);
        }}
        onConfirm={handleLogoutConfirm}
        isLoading={isLoggingOut}
      />
    </div>
  );
}
