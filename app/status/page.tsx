import { ComingSoonPageContent } from "@/components/marketing/zolvstack/ComingSoonPageContent";
import { ZolvStackPageShell } from "@/components/layout/ZolvStackPageShell";
import { buildMetadataForRoute, ROUTE_IDS } from "@/lib/seo";

export const metadata = buildMetadataForRoute(ROUTE_IDS.STATUS);

export default function StatusPage() {
  return (
    <ZolvStackPageShell>
      <ComingSoonPageContent
        title="Status"
        description="A public status page for ZolvStack services is coming soon. Until then, reach out via Contact if you notice an issue with any product."
      />
    </ZolvStackPageShell>
  );
}
