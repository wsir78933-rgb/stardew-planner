import { JsonLdScript } from "../../src/components/json-ld-script";
import { ModMapCardGrid } from "../../src/components/mod-map-card-grid";
import { PublicPageShell } from "../../src/components/public-page-shell";
import { createPublicPageMetadata } from "../../src/seo/page-metadata";
import { createCollectionPageStructuredData } from "../../src/seo/page-structured-data";

const modsDescription =
  "Browse local planning maps for community-made Stardew Valley farms and interiors.";

export const modsMetadata = createPublicPageMetadata({
  pathname: "/mods",
  title: "Modded Stardew Valley Farms",
  description: modsDescription,
});

export const metadata = modsMetadata;

export default function ModsPage() {
  return (
    <PublicPageShell>
      <article className="public-page-content">
        <header className="public-page-header">
          <h1>Modded Stardew Valley Farms</h1>
          <p>{modsDescription}</p>
        </header>
        <ModMapCardGrid />
      </article>
      <JsonLdScript
        structuredData={createCollectionPageStructuredData({
          name: "Modded Stardew Valley Farms",
          description: modsDescription,
          pathname: "/mods",
        })}
      />
    </PublicPageShell>
  );
}
