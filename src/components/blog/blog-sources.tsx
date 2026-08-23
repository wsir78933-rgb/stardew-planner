import {
  Item,
  ItemContent,
  ItemGroup,
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
      <h2>{heading}</h2>
      <ItemGroup className="blog-sources__list">
        {items.map((item) => (
          <Item
            key={item.href}
            className="blog-sources__item"
            role="listitem"
            size="xs"
          >
            <ItemContent>
              <ItemTitle>
                <a href={item.href}>{item.label}</a>
                {item.note ? (
                  <span className="blog-sources__note">{item.note}</span>
                ) : null}
              </ItemTitle>
            </ItemContent>
          </Item>
        ))}
      </ItemGroup>
      {checkedLabel ? <p className="blog-sources__checked">{checkedLabel}</p> : null}
    </section>
  );
}
