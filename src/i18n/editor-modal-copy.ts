import type { HomepageLocale } from "../homepage/homepage-locale";
import { isHomepageLocale } from "../homepage/homepage-locale";
import { getLocalizedPublicPath } from "./public-route-registry";

export type EditorModalOptionCopy = Readonly<{
  label: string;
  title: string;
}>;

export type EditorModalOptionGroupCopy = Readonly<{
  heading: string;
  options: readonly EditorModalOptionCopy[];
}>;

export type ViewModalCopy = Readonly<{
  catalogPosition: Readonly<{
    bottomPanel: string;
    description: string;
    heading: string;
    leftPanel: string;
  }>;
  mapObjects: Readonly<{
    heading: string;
    option: EditorModalOptionCopy;
  }>;
  npcPaths: EditorModalOptionCopy;
  optionGroups: readonly EditorModalOptionGroupCopy[];
  unavailableWeather: Readonly<{
    heading: string;
    label: string;
    statusLabel: string;
    title: string;
  }>;
}>;

export type EditorModalLegalLinkCopy = Readonly<{
  href: string;
  label: string;
}>;

export type SettingsModalCopy = Readonly<{
  community: Readonly<{
    heading: string;
    manageMods: EditorModalOptionCopy;
  }>;
  freePlacement: EditorModalOptionCopy;
  freePlacementWarning: string;
  legalHeading: string;
  optionGroups: readonly EditorModalOptionGroupCopy[];
  placementHeading: string;
  privacyPolicy: EditorModalLegalLinkCopy;
  termsOfService: EditorModalLegalLinkCopy;
  warningActions: Readonly<{
    cancel: string;
    confirm: string;
  }>;
}>;

export type EditorModalCopy = Readonly<{
  closeDialogLabel: string;
  modalTitles: Readonly<{
    save: string;
    settings: string;
    view: string;
  }>;
  settings: SettingsModalCopy;
  stateLabel: (isEnabled: boolean) => string;
  view: ViewModalCopy;
}>;

const editorModalCopyByLocale = {
  en: {
    closeDialogLabel: "Close dialog",
    modalTitles: {
      save: "Save",
      settings: "Settings",
      view: "View",
    },
    stateLabel: (isEnabled: boolean) => isEnabled ? "On" : "Off",
    view: {
      optionGroups: [
        {
          heading: "Overlays",
          options: [
            { label: "Grid", title: "Show tile grid lines on the map" },
            { label: "Sprinkler Radius", title: "Highlight tiles watered by each sprinkler" },
            { label: "Scarecrow Radius", title: "Highlight tiles protected from crows" },
            { label: "Bee House Range", title: "Highlight flower range for honey production" },
            { label: "Junimo Hut Range", title: "Highlight harvest area for Junimo Huts" },
          ],
        },
        {
          heading: "Map Overlays",
          options: [
            { label: "Blocked (Buildings)", title: "Show where buildings cannot be placed" },
            { label: "Blocked (Crops)", title: "Show where crops cannot be planted" },
            { label: "Blocked (Trees)", title: "Show where trees cannot grow" },
          ],
        },
        {
          heading: "Appearance",
          options: [
            { label: "Night Mode", title: "Preview your farm at night with light sources" },
          ],
        },
      ],
      npcPaths: { label: "NPC Paths", title: "Show tiles NPCs walk through" },
      mapObjects: {
        heading: "Map Objects",
        option: {
          label: "Show resource clumps",
          title: "Show spawn locations while a resource clump is selected",
        },
      },
      unavailableWeather: {
        heading: "Unavailable",
        label: "Weather",
        statusLabel: "Unavailable",
        title: "Simulate rain, snow, and other weather effects",
      },
      catalogPosition: {
        bottomPanel: "Bottom panel",
        description: "Choose where the item catalog appears in this browser.",
        heading: "Catalog Position",
        leftPanel: "Left panel",
      },
    },
    settings: {
      community: {
        heading: "Community",
        manageMods: { label: "Manage Mods", title: "Add and manage Content Patcher mods" },
      },
      optionGroups: [
        {
          heading: "Mobile",
          options: [
            { label: "Joystick", title: "Show directional pad for precise item placement on touch devices" },
            { label: "Left-hand Mode", title: "Move controls to the left side of the screen" },
          ],
        },
        {
          heading: "Notifications",
          options: [
            { label: "Toast Notifications", title: "Show brief notifications for tool changes, undo/redo, and actions" },
          ],
        },
        {
          heading: "Interface",
          options: [
            { label: "Game-Styled Cursors", title: "Use the pixel-art game-styled cursors instead of your OS cursors" },
          ],
        },
      ],
      freePlacement: {
        label: "Free Placement",
        title: "Disable placement rules, place items anywhere on the map",
      },
      freePlacementWarning: "Free placement disables map placement rules. Some layouts may not be achievable in-game.",
      legalHeading: "Legal",
      placementHeading: "Placement",
      privacyPolicy: {
        href: getLocalizedPublicPath("en", "/privacy"),
        label: "Privacy Policy",
      },
      termsOfService: {
        href: getLocalizedPublicPath("en", "/terms"),
        label: "Terms of Service",
      },
      warningActions: { cancel: "Cancel", confirm: "Enable Free Placement" },
    },
  },
  "zh-CN": {
    closeDialogLabel: "关闭对话框",
    modalTitles: {
      save: "保存",
      settings: "设置",
      view: "视图",
    },
    stateLabel: (isEnabled: boolean) => isEnabled ? "开" : "关",
    view: {
      optionGroups: [
        {
          heading: "覆盖层",
          options: [
            { label: "网格", title: "在地图上显示地块网格线" },
            { label: "洒水器范围", title: "高亮每个洒水器浇灌的地块" },
            { label: "稻草人范围", title: "高亮免受乌鸦侵扰的地块" },
            { label: "蜂房范围", title: "高亮用于蜂蜜生产的花朵范围" },
            { label: "祝尼魔小屋范围", title: "高亮祝尼魔小屋的收获范围" },
          ],
        },
        {
          heading: "地图覆盖层",
          options: [
            { label: "建筑不可放置区", title: "显示无法放置建筑的位置" },
            { label: "作物不可种植区", title: "显示无法种植作物的位置" },
            { label: "树木不可生长区", title: "显示树木无法生长的位置" },
          ],
        },
        {
          heading: "外观",
          options: [
            { label: "夜间模式", title: "预览带有光源的夜间农场" },
          ],
        },
      ],
      npcPaths: { label: "NPC 路径", title: "显示 NPC 行走的地块" },
      mapObjects: {
        heading: "地图物件",
        option: {
          label: "显示资源块",
          title: "高亮选中资源块时的生成位置",
        },
      },
      unavailableWeather: {
        heading: "不可用",
        label: "天气",
        statusLabel: "不可用",
        title: "模拟雨、雪等天气效果",
      },
      catalogPosition: {
        bottomPanel: "底部面板",
        description: "选择物品目录在浏览器中的显示位置。",
        heading: "物品目录位置",
        leftPanel: "左侧面板",
      },
    },
    settings: {
      community: {
        heading: "社区",
        manageMods: { label: "管理模组", title: "添加和管理 Content Patcher 模组" },
      },
      optionGroups: [
        {
          heading: "移动端",
          options: [
            { label: "摇杆", title: "在触控设备上显示方向键，便于精确放置物品" },
            { label: "左手模式", title: "将控件移至屏幕左侧" },
          ],
        },
        {
          heading: "通知",
          options: [
            { label: "浮动通知", title: "显示工具切换、撤销/重做和操作的简短通知" },
          ],
        },
        {
          heading: "界面",
          options: [
            { label: "游戏风格光标", title: "使用像素风格的游戏光标，而不是操作系统光标" },
          ],
        },
      ],
      freePlacement: { label: "自由放置", title: "禁用放置规则，可在地图任意位置放置物品" },
      freePlacementWarning: "自由放置会禁用地图放置规则，部分布局可能无法在游戏中实现。",
      legalHeading: "法律",
      placementHeading: "放置",
      privacyPolicy: {
        href: getLocalizedPublicPath("zh-CN", "/privacy"),
        label: "隐私政策",
      },
      termsOfService: {
        href: getLocalizedPublicPath("zh-CN", "/terms"),
        label: "服务条款",
      },
      warningActions: { cancel: "取消", confirm: "启用自由放置" },
    },
  },
} as const satisfies Readonly<Record<HomepageLocale, EditorModalCopy>>;

export function getEditorModalCopy(locale: HomepageLocale): EditorModalCopy {
  if (!isHomepageLocale(locale)) {
    throw new Error(`Unsupported editor-modal locale. Received: ${JSON.stringify(locale)}.`);
  }

  return editorModalCopyByLocale[locale];
}
