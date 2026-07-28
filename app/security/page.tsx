import { JsonLd } from "@/components/seo/JsonLd";
import { SecurityPageContent } from "@/components/marketing/company/SecurityPageContent";
import { ZolvStackPageShell } from "@/components/layout/ZolvStackPageShell";
import {
  buildJsonLdForRoute,
  buildMetadataForRoute,
  ROUTE_IDS,
} from "@/lib/seo";

export const metadata = buildMetadataForRoute(ROUTE_IDS.SECURITY);

export default function SecurityPage() {
  return (
    <>
      <JsonLd data={buildJsonLdForRoute(ROUTE_IDS.SECURITY)} />
      <ZolvStackPageShell>
        <SecurityPageContent />
      </ZolvStackPageShell>
    </>
  );
}
