import { PublicFooter } from "@/components/ui/public-footer";
import { PublicTopbar } from "@/components/ui/public-topbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <PublicTopbar />
      {children}
      <PublicFooter />
    </div>
  );
}
