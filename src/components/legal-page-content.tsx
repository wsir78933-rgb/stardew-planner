import type { LegalDocument } from "../reference/legal-pages";

type LegalPageContentProperties = Readonly<{
  document: LegalDocument;
}>;

export function LegalPageContent({ document }: LegalPageContentProperties) {
  return (
    <article className="legal-page-content">
      <header className="public-page-header">
        <h1>{document.title}</h1>
        <p>{document.lastUpdated}</p>
      </header>
      {document.sections.map((legalSection) => (
        <section className="legal-page-section" key={legalSection.heading}>
          <h2>{legalSection.heading}</h2>
          {legalSection.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>
      ))}
    </article>
  );
}
