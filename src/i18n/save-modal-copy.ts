import type { HomepageLocale } from "../homepage/homepage-locale";
import { isHomepageLocale } from "../homepage/homepage-locale";

export type SaveModalBranch = "farm-summary" | "game-save" | "projects";
export type FarmSummarySeason = "fall" | "spring" | "summer" | "winter";

export type SaveToolsCopy = Readonly<{
  branchLoadFailure: (branch: SaveModalBranch, rawError: string) => string;
  farmSummary: string;
  gameSave: string;
  label: string;
  loadingBranch: (branch: SaveModalBranch) => string;
  localProjects: string;
  retryBranch: (branch: SaveModalBranch) => string;
}>;

export type LocalProjectsCopy = Readonly<{
  actionFailure: (rawError: string) => string;
  applyName: string;
  cancelRename: string;
  createdProject: string;
  current: string;
  currentMap: string;
  currentMapCount: (count: number) => string;
  currentProject: string;
  dateTimeLocale: HomepageLocale;
  defaultProjectName: string;
  delete: string;
  deletedProject: string;
  duplicate: string;
  duplicatedProject: string;
  emptyState: string;
  exportedProject: (projectName: string) => string;
  exportJson: string;
  importedProject: (filename: string) => string;
  importJson: string;
  localProjects: string;
  newProject: string;
  newProjectName: string;
  none: string;
  open: string;
  openedProject: (projectName: string) => string;
  openingBrowserStorage: string;
  rename: string;
  renamedProject: string;
  saveToDevice: string;
  savedLocalProjects: string;
  savedToBrowser: string;
  storedInBrowser: string;
}>;

export type LocalProjectDeleteCopy = Readonly<{
  confirm: string;
  descriptionPrefix: string;
  descriptionSuffix: string;
  dismiss: string;
  title: string;
}>;

export type ImageExportCopy = Readonly<{
  exportFailure: (rawError: string) => string;
  exportLabel: string;
  screenshot: string;
  screenshotHighQuality: string;
  screenshotHighQualityTitle: string;
  screenshotTitle: string;
}>;

export type ThumbnailCopy = Readonly<{
  saveFailure: (rawError: string) => string;
  saveLabel: string;
  saved: string;
  title: string;
}>;

export type GameSaveCopy = Readonly<{
  ariaLabel: string;
  chooseFile: string;
  close: string;
  description: string;
  experimentalNotice: string;
  importFailure: (rawError: string) => string;
  importing: (filename: string) => string;
  localOnlyNotice: string;
  resultCloseLabel: string;
  resultImportedAll: string;
  resultTitle: (farmName: string) => string;
  tooltip: string;
  unmappedItems: (count: number) => string;
}>;

export type GameSaveResultLoaderCopy = Readonly<{
  loadFailure: (rawError: string) => string;
  loading: string;
  retry: string;
}>;

export type FarmSummaryPreviewCopy = Readonly<{
  ariaLabel: string;
  itemsPlaced: (count: number) => string;
  map: string;
  season: (season: FarmSummarySeason) => string;
  seasonLabel: string;
  viewDetails: string;
}>;

export type FarmSummaryDetailCopy = Readonly<{
  closeLabel: string;
  empty: string;
  exportCsv: string;
  exportFailure: (rawError: string) => string;
  itemsPlaced: (count: number) => string;
  map: string;
  season: (season: FarmSummarySeason) => string;
  seasonLabel: string;
  title: string;
}>;

export type SaveModalCopy = Readonly<{
  deleteProject: LocalProjectDeleteCopy;
  farmSummaryDetail: FarmSummaryDetailCopy;
  farmSummaryPreview: FarmSummaryPreviewCopy;
  gameSave: GameSaveCopy;
  gameSaveResultLoader: GameSaveResultLoaderCopy;
  imageExport: ImageExportCopy;
  localProjects: LocalProjectsCopy;
  saveTools: SaveToolsCopy;
  thumbnail: ThumbnailCopy;
}>;

const englishSeasonNames: Readonly<Record<FarmSummarySeason, string>> = {
  fall: "Fall",
  spring: "Spring",
  summer: "Summer",
  winter: "Winter",
};

const chineseSeasonNames: Readonly<Record<FarmSummarySeason, string>> = {
  fall: "秋季",
  spring: "春季",
  summer: "夏季",
  winter: "冬季",
};

function createSeasonFormatter(
  seasonNames: Readonly<Record<FarmSummarySeason, string>>,
): (season: FarmSummarySeason) => string {
  return (season) => seasonNames[season];
}

const saveModalCopyByLocale = {
  en: {
    saveTools: {
      branchLoadFailure: (branch: SaveModalBranch, rawError: string) =>
        `Cannot load save tool branch ${JSON.stringify(branch)}: ${rawError}`,
      farmSummary: "Farm Summary",
      gameSave: "Import Game Save",
      label: "Save tools",
      loadingBranch: (branch: SaveModalBranch) => `Loading ${getEnglishBranchLabel(branch)}…`,
      localProjects: "Local projects",
      retryBranch: (branch: SaveModalBranch) => `Retry ${getEnglishBranchLabel(branch)}`,
    },
    localProjects: {
      actionFailure: (rawError: string) => `Local project action failed: ${rawError}`,
      applyName: "Apply name",
      cancelRename: "Cancel rename",
      createdProject: "Created a local project.",
      current: "Current",
      currentMap: "Current map",
      currentMapCount: (count: number) => `${String(count)} maps`,
      currentProject: "Current project",
      dateTimeLocale: "en",
      defaultProjectName: "Untitled Project",
      delete: "Delete",
      deletedProject: "Deleted the local project.",
      duplicate: "Duplicate",
      duplicatedProject: "Duplicated the local project.",
      emptyState: "No local projects yet. Saving creates an Untitled Project and saves the current map.",
      exportedProject: (projectName: string) => `Exported ${projectName}.`,
      exportJson: "Export JSON",
      importedProject: (filename: string) => `Imported ${filename}.`,
      importJson: "Import JSON",
      localProjects: "Local projects",
      newProject: "New project",
      newProjectName: "New project name",
      none: "None",
      open: "Open",
      openedProject: (projectName: string) => `Opened ${projectName}.`,
      openingBrowserStorage: "Opening browser storage…",
      rename: "Rename",
      renamedProject: "Renamed the local project.",
      saveToDevice: "Save to this device",
      savedLocalProjects: "Saved local projects",
      savedToBrowser: "Saved to this browser.",
      storedInBrowser: "Stored in this browser.",
    },
    deleteProject: {
      confirm: "Delete project",
      descriptionPrefix: "Delete ",
      descriptionSuffix: " from this browser? This cannot be undone.",
      dismiss: "Keep project",
      title: "Delete local project?",
    },
    imageExport: {
      exportFailure: (rawError: string) => `Screenshot export failed: ${rawError}`,
      exportLabel: "Export",
      screenshot: "Screenshot",
      screenshotHighQuality: "Screenshot (HQ)",
      screenshotHighQualityTitle: "2x resolution, higher quality",
      screenshotTitle: "1x resolution, compact file size",
    },
    thumbnail: {
      saveFailure: (rawError: string) => `Thumbnail save failed: ${rawError}`,
      saveLabel: "Save thumbnail",
      saved: "Thumbnail saved to this browser.",
      title: "Thumbnail",
    },
    gameSave: {
      ariaLabel: "Import Game Save",
      chooseFile: "Choose save file",
      close: "Close",
      description: "Choose a Stardew Valley save file to preview the farm in this planner.",
      experimentalNotice: "Game save import is experimental. Unsupported items are not placed on the map.",
      importFailure: (rawError: string) => `Game save import failed: ${rawError}`,
      importing: (filename: string) => `Importing ${filename}…`,
      localOnlyNotice: "The imported map is only in this browser until you save it to this device.",
      resultCloseLabel: "Close game save import result",
      resultImportedAll: "All recognized map placements were imported.",
      resultTitle: (farmName: string) => `\"${farmName} Farm\"`,
      tooltip: "Import a Stardew Valley save file to view your farm layout",
      unmappedItems: (count: number) => `${String(count)} items couldn't be mapped (likely from mods).`,
    },
    gameSaveResultLoader: {
      loadFailure: (rawError: string) => `Cannot load imported game-save result: ${rawError}`,
      loading: "Loading imported game-save result…",
      retry: "Retry result loading",
    },
    farmSummaryPreview: {
      ariaLabel: "Farm Summary",
      itemsPlaced: (count: number) => `${String(count)} items placed`,
      map: "Map",
      season: createSeasonFormatter(englishSeasonNames),
      seasonLabel: "Season",
      viewDetails: "View detailed summary",
    },
    farmSummaryDetail: {
      closeLabel: "Close Farm Summary",
      empty: "No items have been placed yet.",
      exportCsv: "Export CSV",
      exportFailure: (rawError: string) => `Farm summary export failed: ${rawError}`,
      itemsPlaced: (count: number) => `${String(count)} items placed`,
      map: "Map",
      season: createSeasonFormatter(englishSeasonNames),
      seasonLabel: "Season",
      title: "Farm Summary",
    },
  },
  "zh-CN": {
    saveTools: {
      branchLoadFailure: (branch: SaveModalBranch, rawError: string) =>
        `无法加载保存工具分支 ${JSON.stringify(branch)}：${rawError}`,
      farmSummary: "农场摘要",
      gameSave: "导入游戏存档",
      label: "保存工具",
      loadingBranch: (branch: SaveModalBranch) => `正在加载${getChineseBranchLabel(branch)}…`,
      localProjects: "本地项目",
      retryBranch: (branch: SaveModalBranch) => `重试加载${getChineseBranchLabel(branch)}`,
    },
    localProjects: {
      actionFailure: (rawError: string) => `本地项目操作失败：${rawError}`,
      applyName: "应用名称",
      cancelRename: "取消重命名",
      createdProject: "已创建本地项目。",
      current: "当前",
      currentMap: "当前地图",
      currentMapCount: (count: number) => `${String(count)} 张地图`,
      currentProject: "当前项目",
      dateTimeLocale: "zh-CN",
      defaultProjectName: "未命名项目",
      delete: "删除",
      deletedProject: "已删除本地项目。",
      duplicate: "创建副本",
      duplicatedProject: "已复制本地项目。",
      emptyState: "还没有本地项目。保存时会创建“未命名项目”，并保存当前地图。",
      exportedProject: (projectName: string) => `已导出“${projectName}”。`,
      exportJson: "导出 JSON",
      importedProject: (filename: string) => `已导入“${filename}”。`,
      importJson: "导入 JSON",
      localProjects: "本地项目",
      newProject: "新建项目",
      newProjectName: "新项目名称",
      none: "无",
      open: "打开",
      openedProject: (projectName: string) => `已打开“${projectName}”。`,
      openingBrowserStorage: "正在打开浏览器存储…",
      rename: "重命名",
      renamedProject: "已重命名本地项目。",
      saveToDevice: "保存到此设备",
      savedLocalProjects: "已保存的本地项目",
      savedToBrowser: "已保存到此浏览器。",
      storedInBrowser: "保存在此浏览器中。",
    },
    deleteProject: {
      confirm: "删除项目",
      descriptionPrefix: "要从此浏览器删除“",
      descriptionSuffix: "”吗？此操作无法撤销。",
      dismiss: "保留项目",
      title: "删除本地项目？",
    },
    imageExport: {
      exportFailure: (rawError: string) => `截图导出失败：${rawError}`,
      exportLabel: "导出",
      screenshot: "截图",
      screenshotHighQuality: "截图（高清）",
      screenshotHighQualityTitle: "2 倍分辨率，画质更高",
      screenshotTitle: "1 倍分辨率，文件较小",
    },
    thumbnail: {
      saveFailure: (rawError: string) => `缩略图保存失败：${rawError}`,
      saveLabel: "保存缩略图",
      saved: "缩略图已保存到此浏览器。",
      title: "缩略图",
    },
    gameSave: {
      ariaLabel: "导入游戏存档",
      chooseFile: "选择存档文件",
      close: "关闭",
      description: "选择《星露谷物语》存档文件，在规划器中预览农场。",
      experimentalNotice: "游戏存档导入仍处于实验阶段，不支持的物品不会放置到地图上。",
      importFailure: (rawError: string) => `游戏存档导入失败：${rawError}`,
      importing: (filename: string) => `正在导入 ${filename}…`,
      localOnlyNotice: "导入的地图只保存在此浏览器中，保存到此设备后才会持久保存。",
      resultCloseLabel: "关闭游戏存档导入结果",
      resultImportedAll: "已导入所有可识别的地图放置内容。",
      resultTitle: (farmName: string) => `“${farmName}农场”`,
      tooltip: "导入《星露谷物语》存档文件以查看农场布局",
      unmappedItems: (count: number) => `${String(count)} 个物品无法匹配（可能来自模组）。`,
    },
    gameSaveResultLoader: {
      loadFailure: (rawError: string) => `无法加载游戏存档导入结果：${rawError}`,
      loading: "正在加载游戏存档导入结果…",
      retry: "重试加载结果",
    },
    farmSummaryPreview: {
      ariaLabel: "农场摘要",
      itemsPlaced: (count: number) => `${String(count)} 个物品已放置`,
      map: "地图",
      season: createSeasonFormatter(chineseSeasonNames),
      seasonLabel: "季节",
      viewDetails: "查看详细摘要",
    },
    farmSummaryDetail: {
      closeLabel: "关闭农场摘要",
      empty: "尚未放置任何物品。",
      exportCsv: "导出 CSV",
      exportFailure: (rawError: string) => `农场摘要导出失败：${rawError}`,
      itemsPlaced: (count: number) => `${String(count)} 个物品已放置`,
      map: "地图",
      season: createSeasonFormatter(chineseSeasonNames),
      seasonLabel: "季节",
      title: "农场摘要",
    },
  },
} as const satisfies Readonly<Record<HomepageLocale, SaveModalCopy>>;

export function getSaveModalCopy(locale: HomepageLocale): SaveModalCopy {
  if (!isHomepageLocale(locale)) {
    throw new Error(`Unsupported save-modal locale. Received: ${JSON.stringify(locale)}.`);
  }

  return saveModalCopyByLocale[locale];
}

function getEnglishBranchLabel(branch: SaveModalBranch): string {
  if (branch === "projects") return "Local projects";
  if (branch === "game-save") return "Import Game Save";
  return "Farm Summary";
}

function getChineseBranchLabel(branch: SaveModalBranch): string {
  if (branch === "projects") return "本地项目";
  if (branch === "game-save") return "导入游戏存档";
  return "农场摘要";
}
