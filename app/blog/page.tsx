import { ComingSoonPageContent } from "@/components/marketing/zolvstack/ComingSoonPageContent";
import { ZolvStackPageShell } from "@/components/layout/ZolvStackPageShell";
import { buildMetadataForRoute, ROUTE_IDS } from "@/lib/seo";

export const metadata = buildMetadataForRoute(ROUTE_IDS.BLOG);

export default function BlogPage() {
  return (
    <ZolvStackPageShell>
      <ComingSoonPageContent
        title="Blog"
        description="We are preparing a space for product updates, launch notes, and practical guides from the ZolvStack team. Check back soon."
      />
    </ZolvStackPageShell>
  );
}
