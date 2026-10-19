import { describe, expect, it } from "vitest";
import type { HomepageLocale } from "../../src/homepage/homepage-locale";
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

  it("provides Japanese view and settings labels that link to the existing English legal pages", () => {
    const copy = getEditorModalCopy("ja" as HomepageLocale);
    const englishCopy = getEditorModalCopy("en");

    expect(collectCopyKeyPaths(copy)).toEqual(collectCopyKeyPaths(englishCopy));
    expect(copy.closeDialogLabel).toBe("ダイアログを閉じる");
    expect(copy.modalTitles).toEqual({
      save: "保存",
      settings: "設定",
      view: "表示",
    });
    expect(copy.stateLabel(true)).toBe("オン");
    expect(copy.stateLabel(false)).toBe("オフ");
    expect(copy.view.optionGroups[0]?.options.map((option) => option.label)).toEqual([
      "グリッド",
      "スプリンクラーの範囲",
      "カカシの範囲",
      "ハチの巣箱の範囲",
      "ジュニモ小屋の範囲",
    ]);
    expect(copy.view.optionGroups[1]?.options[2]).toEqual({
      label: "木が育たない場所",
      title: "木が育たない場所を表示します",
    });
    expect(copy.view.npcPaths).toEqual({
      label: "NPCの経路",
      title: "NPCが歩くタイルを表示します",
    });
    expect(copy.view.mapObjects).toEqual({
      heading: "マップ上のオブジェクト",
      option: {
        label: "資源の塊を表示",
        title: "資源の塊を選んでいるあいだ、出現位置を表示します",
      },
    });
    expect(copy.view.unavailableWeather.statusLabel).toBe("利用不可");
    expect(copy.view.catalogPosition).toEqual({
      bottomPanel: "下パネル",
      description: "このブラウザでアイテムカタログを表示する位置を選びます。",
      heading: "カタログの位置",
      leftPanel: "左パネル",
    });
    expect(copy.settings.community.manageMods.title).toContain("Content Patcher");
    expect(copy.settings.freePlacement.label).toBe("自由配置");
    expect(copy.settings.freePlacementWarning).toContain("ゲーム内で再現できない");
    expect(copy.settings.privacyPolicy).toEqual({
      href: "/privacy",
      label: "プライバシーポリシー",
    });
    expect(copy.settings.termsOfService).toEqual({
      href: "/terms",
      label: "利用規約",
    });
    expect(copy.settings.privacyPolicy.href).toBe(englishCopy.settings.privacyPolicy.href);
    expect(copy.settings.termsOfService.href).toBe(englishCopy.settings.termsOfService.href);
    expect(copy.settings.warningActions).toEqual({
      cancel: "キャンセル",
      confirm: "自由配置を有効にする",
    });
  });
});

function collectCopyKeyPaths(value: unknown, prefix = ""): string[] {
  if (typeof value !== "object" || value === null) {
    return [];
  }

  const keyPaths: string[] = [];
  for (const key of Object.keys(value).sort()) {
    const keyPath = prefix.length === 0 ? key : `${prefix}.${key}`;
    keyPaths.push(keyPath);
    const child = (value as Record<string, unknown>)[key];
    if (typeof child === "object" && child !== null) {
      keyPaths.push(...collectCopyKeyPaths(child, keyPath));
    }
  }
  return keyPaths;
}
