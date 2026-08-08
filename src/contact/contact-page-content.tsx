import { ContactForm } from "./contact-form";
import type { ContactPageCopy } from "./contact-page-copy";

type ContactPageContentProperties = Readonly<{
  contactCopy: ContactPageCopy;
}>;

export function ContactPageContent({
  contactCopy,
}: ContactPageContentProperties) {
  return (
    <article className="contact-page-content">
      <header className="contact-page-header">
        <p className="contact-page-eyebrow">{contactCopy.eyebrow}</p>
        <h1 className="contact-page-title">{contactCopy.title}</h1>
        <p className="contact-page-description">{contactCopy.description}</p>
      </header>
      <ContactForm contactCopy={contactCopy} />
    </article>
  );
}
