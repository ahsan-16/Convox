import { JsonLd } from "@/components/seo/JsonLd";
import { ZolvStackAboutPageContent } from "@/components/marketing/zolvstack/ZolvStackAboutPageContent";
import { ZolvStackPageShell } from "@/components/layout/ZolvStackPageShell";
import {
  buildJsonLdForRoute,
  buildMetadataForRoute,
  ROUTE_IDS,
} from "@/lib/seo";

export const metadata = buildMetadataForRoute(ROUTE_IDS.ABOUT);

export default function AboutPage() {
  return (
    <>
      <JsonLd data={buildJsonLdForRoute(ROUTE_IDS.ABOUT)} />
      <ZolvStackPageShell>
        <ZolvStackAboutPageContent />
      </ZolvStackPageShell>
    </>
  );
}
