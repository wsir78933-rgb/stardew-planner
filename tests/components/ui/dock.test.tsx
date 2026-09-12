import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Home } from "lucide-react";
import { describe, expect, it } from "vitest";
import { Dock, DockIconButton } from "@/components/ui/dock";

describe("Dock", () => {
  it("renders links when href is set", () => {
    const dockMarkup = renderToStaticMarkup(
      createElement(Dock, {
        items: [{ href: "/planner", icon: Home, label: "Home" }],
      }),
    );

    expect(dockMarkup).toContain("<a");
    expect(dockMarkup).toContain('href="/planner"');
    expect(dockMarkup).toMatch(/<a[^>]*href="\/planner"/);
    expect(dockMarkup).toContain('data-slot="dock"');
    expect(dockMarkup).toContain('data-slot="dock-icon-button"');
    expect(dockMarkup).toContain('aria-label="Home"');
    expect(dockMarkup).not.toContain("h-64");
  });

  it("renders a button when only onClick is set", () => {
    const dockMarkup = renderToStaticMarkup(
      createElement(Dock, {
        items: [{ icon: Home, label: "Home", onClick: () => undefined }],
      }),
    );

    expect(dockMarkup).toContain("<button");
    expect(dockMarkup).toContain('type="button"');
    expect(dockMarkup).toContain('aria-label="Home"');
    expect(dockMarkup).not.toContain("<a");
  });

  it("renders tooltip label text", () => {
    const dockMarkup = renderToStaticMarkup(
      createElement(Dock, {
        items: [{ href: "/#planner", icon: Home, label: "Open planner" }],
      }),
    );

    expect(dockMarkup).toContain("Open planner");
    expect(dockMarkup).toContain("bg-popover");
    expect(dockMarkup).toContain("text-popover-foreground");
    expect(dockMarkup).toContain("opacity-0");
    expect(dockMarkup).toContain("group-hover:opacity-100");
    expect(dockMarkup).toContain("pointer-events-none");
  });

  it("throws on empty items and no children, with the received value", () => {
    expect(() => renderToStaticMarkup(createElement(Dock))).toThrow(TypeError);
    expect(() => renderToStaticMarkup(createElement(Dock))).toThrow(
      "items is empty (length=0, received=undefined)",
    );
    expect(() =>
      renderToStaticMarkup(createElement(Dock, { items: [] })),
    ).toThrow("items is empty (length=0, received=[])");
  });

  it("throws on empty label", () => {
    expect(() =>
      renderToStaticMarkup(
        createElement(Dock, {
          items: [{ href: "/", icon: Home, label: "" }],
        }),
      ),
    ).toThrow(TypeError);
    expect(() =>
      renderToStaticMarkup(
        createElement(Dock, {
          items: [{ href: "/", icon: Home, label: "" }],
        }),
      ),
    ).toThrow('received: ""');
  });

  it("throws on item with neither href nor onClick", () => {
    expect(() =>
      renderToStaticMarkup(
        createElement(Dock, {
          items: [{ icon: Home, label: "Home" }],
        }),
      ),
    ).toThrow(TypeError);
    expect(() =>
      renderToStaticMarkup(
        createElement(Dock, {
          items: [{ icon: Home, label: "Home" }],
        }),
      ),
    ).toThrow("must have href or onClick");
    expect(() =>
      renderToStaticMarkup(
        createElement(Dock, {
          items: [{ icon: Home, label: "Home" }],
        }),
      ),
    ).toThrow("received href: undefined, onClick: undefined");
  });

  it("does not throw for children-only Dock", () => {
    const dockMarkup = renderToStaticMarkup(
      createElement(
        Dock,
        null,
        createElement(DockIconButton, {
          href: "/",
          icon: Home,
          label: "Home",
        }),
      ),
    );

    expect(dockMarkup).toContain('href="/"');
    expect(dockMarkup).toContain("Home");
    expect(dockMarkup).toContain('data-slot="dock"');
  });

  it("renders extra data attributes on the icon control", () => {
    const dockMarkup = renderToStaticMarkup(
      createElement(
        Dock,
        null,
        createElement(DockIconButton, {
          "data-homepage-brand": true,
          "data-homepage-header-action": "open-planner",
          href: "/",
          icon: Home,
          label: "Stardew Valley Farm Planner",
        }),
      ),
    );

    expect(dockMarkup).toContain("data-homepage-brand");
    expect(dockMarkup).toContain('data-homepage-header-action="open-planner"');
    expect(dockMarkup).toMatch(/<a[^>]*href="\/"/);
  });
});
