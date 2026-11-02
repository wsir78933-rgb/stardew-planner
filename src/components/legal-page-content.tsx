import type {
  LegalPageCopy,
  LegalPageParagraph,
} from "../legal/legal-page-copy";

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
          {section.paragraphs.map((paragraph, paragraphIndex) => (
            <p key={`${section.heading}-${paragraphIndex}`}>
              {renderLegalParagraphContent(paragraph)}
            </p>
          ))}
        </section>
      ))}
    </article>
  );
}

function renderLegalParagraphContent(paragraph: LegalPageParagraph) {
  if (typeof paragraph === "string") {
    return paragraph;
  }

  return paragraph.map((segment, segmentIndex) => {
    if (typeof segment === "string") {
      return segment;
    }

    return (
      <a key={`${segment.href}-${segmentIndex}`} href={segment.href}>
        {segment.label}
      </a>
    );
  });
}
