import { describe, expect, it } from "vitest";
import { getEditorModalCopy } from "../../src/i18n/editor-modal-copy";

describe("editor modal copy", () => {
  it.each([
    ["en", "View", "On", "Off", "/privacy", "Privacy Policy"],
    ["zh-CN", "视图", "开", "关", "/zh/privacy", "隐私政策"],
  ] as const)(
    "delivers %s modal titles, state pills, and legal links",
    (locale, viewTitle, onLabel, offLabel, privacyHref, privacyLabel) => {
      const copy = getEditorModalCopy(locale);

      expect(copy.modalTitles.view).toBe(viewTitle);
      expect(copy.stateLabel(true)).toBe(onLabel);
      expect(copy.stateLabel(false)).toBe(offLabel);
      expect(copy.settings.privacyPolicy).toEqual({
        href: privacyHref,
        label: privacyLabel,
      });
    },
  );

  it("delivers the approved Chinese View and Settings labels", () => {
    const copy = getEditorModalCopy("zh-CN");

    expect(copy.closeDialogLabel).toBe("关闭对话框");
    expect(copy.view.optionGroups).toContainEqual({
      heading: "覆盖层",
      options: expect.arrayContaining([
        expect.objectContaining({ label: "网格", title: "在地图上显示地块网格线" }),
      ]),
    });
    expect(copy.settings.freePlacementWarning).toBe(
      "自由放置会禁用地图放置规则，部分布局可能无法在游戏中实现。",
    );
    expect(copy.settings.termsOfService).toEqual({
      href: "/zh/terms",
      label: "服务条款",
    });
    expect(copy.view.mapObjects).toEqual({
      heading: "地图物件",
      option: {
        label: "显示资源块",
        title: "高亮选中资源块时的生成位置",
      },
    });
    expect(copy.settings.community).toEqual({
      heading: "社区",
      manageMods: {
        label: "管理模组",
        title: "添加和管理 Content Patcher 模组",
      },
    });
    expect(copy.view.optionGroups[1]?.options[2]).toEqual({
      label: "树木不可生长区",
      title: "显示树木无法生长的位置",
    });
  });

  it("delivers the English Map Objects and Community contracts", () => {
    const copy = getEditorModalCopy("en");

    expect(copy.view.mapObjects).toEqual({
      heading: "Map Objects",
      option: {
        label: "Show resource clumps",
        title: "Show spawn locations while a resource clump is selected",
      },
    });
    expect(copy.settings.community).toEqual({
      heading: "Community",
      manageMods: {
        label: "Manage Mods",
        title: "Add and manage Content Patcher mods",
      },
    });
  });

  it("fails fast with the unsupported runtime locale value", () => {
    expect(() => getEditorModalCopy("fr" as never)).toThrow(
      'Unsupported editor-modal locale. Received: "fr".',
    );
  });
});
