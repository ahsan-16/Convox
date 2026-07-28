import { JsonLd } from "@/components/seo/JsonLd";
import { TermsPageContent } from "@/components/marketing/company/TermsPageContent";
import { ZolvStackPageShell } from "@/components/layout/ZolvStackPageShell";
import {
  buildJsonLdForRoute,
  buildMetadataForRoute,
  ROUTE_IDS,
} from "@/lib/seo";

export const metadata = buildMetadataForRoute(ROUTE_IDS.TERMS);

export default function TermsPage() {
  return (
    <>
      <JsonLd data={buildJsonLdForRoute(ROUTE_IDS.TERMS)} />
      <ZolvStackPageShell>
        <TermsPageContent />
      </ZolvStackPageShell>
    </>
  );
}
