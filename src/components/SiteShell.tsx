import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { AiAssistant } from "@/components/AiAssistant";
import { PortalProvider } from "@/lib/portal-store";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <PortalProvider>
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <AiAssistant />
      </div>
    </PortalProvider>
  );
}
