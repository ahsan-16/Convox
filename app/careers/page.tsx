import { ContributePageContent } from "@/components/marketing/zolvstack/ContributePageContent";
import { ZolvStackPageShell } from "@/components/layout/ZolvStackPageShell";
import { buildMetadataForRoute, ROUTE_IDS } from "@/lib/seo";

export const metadata = buildMetadataForRoute(ROUTE_IDS.CAREERS);

export default function CareersPage() {
  return (
    <ZolvStackPageShell>
      <ContributePageContent />
    </ZolvStackPageShell>
  );
}
