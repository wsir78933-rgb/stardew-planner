import { BookOpenIcon, CalendarCheckIcon, ChevronRightIcon, LinkIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Item,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

export type BlogSourceItem = Readonly<{
  href: string;
  label: string;
  note?: string;
}>;

type BlogSourcesProperties = Readonly<{
  checkedLabel?: string;
  heading: string;
  items: readonly BlogSourceItem[];
}>;

export function BlogSources({
  checkedLabel,
  heading,
  items,
}: BlogSourcesProperties) {
  return (
    <section className="blog-sources">
      <Card className="blog-sources__card">
        <CardHeader className="blog-sources__header">
          <CardTitle className="blog-sources__title">
            <BookOpenIcon aria-hidden className="blog-sources__title-icon" />
            <h2>{heading}</h2>
          </CardTitle>
        </CardHeader>
        <CardContent className="blog-sources__content">
          <ItemGroup className="blog-sources__list">
            {items.map((item) => (
              <div className="blog-sources__item-wrapper" key={item.href} role="listitem">
                <Item asChild className="blog-sources__item" size="sm" variant="outline">
                  <a href={item.href}>
                    <ItemMedia variant="icon">
                      <LinkIcon aria-hidden className="blog-sources__item-icon" />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle className="blog-sources__item-title">
                        {item.label}
                        {item.note ? (
                          <span className="blog-sources__item-note">{item.note}</span>
                        ) : null}
                      </ItemTitle>
                    </ItemContent>
                    <ChevronRightIcon aria-hidden className="blog-sources__item-chevron" />
                  </a>
                </Item>
              </div>
            ))}
          </ItemGroup>
        </CardContent>
        {checkedLabel ? (
          <CardFooter className="blog-sources__footer">
            <CalendarCheckIcon aria-hidden className="blog-sources__footer-icon" />
            <p className="blog-sources__checked">{checkedLabel}</p>
          </CardFooter>
        ) : null}
      </Card>
    </section>
  );
}
