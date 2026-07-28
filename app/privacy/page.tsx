import { JsonLd } from "@/components/seo/JsonLd";
import { PrivacyPageContent } from "@/components/marketing/company/PrivacyPageContent";
import { ZolvStackPageShell } from "@/components/layout/ZolvStackPageShell";
import {
  buildJsonLdForRoute,
  buildMetadataForRoute,
  ROUTE_IDS,
} from "@/lib/seo";

export const metadata = buildMetadataForRoute(ROUTE_IDS.PRIVACY);

export default function PrivacyPage() {
  return (
    <>
      <JsonLd data={buildJsonLdForRoute(ROUTE_IDS.PRIVACY)} />
      <ZolvStackPageShell>
        <PrivacyPageContent />
      </ZolvStackPageShell>
    </>
  );
}
