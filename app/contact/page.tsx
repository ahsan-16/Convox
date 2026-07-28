import { JsonLd } from "@/components/seo/JsonLd";
import { ContactPageContent } from "@/components/marketing/company/ContactPageContent";
import { ZolvStackPageShell } from "@/components/layout/ZolvStackPageShell";
import {
  buildJsonLdForRoute,
  buildMetadataForRoute,
  ROUTE_IDS,
} from "@/lib/seo";

export const metadata = buildMetadataForRoute(ROUTE_IDS.CONTACT);

export default function ContactPage() {
  return (
    <>
      <JsonLd data={buildJsonLdForRoute(ROUTE_IDS.CONTACT)} />
      <ZolvStackPageShell>
        <ContactPageContent />
      </ZolvStackPageShell>
    </>
  );
}
