import type { LegalPageCopy } from "../legal/legal-page-copy";

type LegalPageContentProperties = Readonly<{
  legalPageCopy: LegalPageCopy;
}>;

export function LegalPageContent({
  legalPageCopy,
}: LegalPageContentProperties) {
  return (
    <article className="public-page-content">
      <header className="public-page-header">
        <h1>{legalPageCopy.title}</h1>
        <p>{legalPageCopy.description}</p>
      </header>
      {legalPageCopy.sections.map((section) => (
        <section key={section.heading}>
          <h2>{section.heading}</h2>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>
      ))}
    </article>
  );
}
