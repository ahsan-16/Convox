import { ComingSoonPageContent } from "@/components/marketing/zolvstack/ComingSoonPageContent";
import { ZolvStackPageShell } from "@/components/layout/ZolvStackPageShell";
import { buildMetadataForRoute, ROUTE_IDS } from "@/lib/seo";

export const metadata = buildMetadataForRoute(ROUTE_IDS.DOCS);

export default function DocsPage() {
  return (
    <ZolvStackPageShell>
      <ComingSoonPageContent
        title="Documentation"
        description="Product documentation and developer guides for the ZolvStack ecosystem are on the way. Fileora help content will live here as it expands."
      />
    </ZolvStackPageShell>
  );
}
