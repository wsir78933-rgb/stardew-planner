import type { HomepageLocale } from "../homepage/homepage-locale";

function formatRussianCountedNoun(
  count: number,
  one: string,
  few: string,
  many: string,
): string {
  const absoluteCount = Math.abs(count);
  const lastTwoDigits = absoluteCount % 100;
  const lastDigit = absoluteCount % 10;
  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return `${String(count)} ${many}`;
  }
  if (lastDigit === 1) {
    return `${String(count)} ${one}`;
  }
  if (lastDigit >= 2 && lastDigit <= 4) {
    return `${String(count)} ${few}`;
  }
  return `${String(count)} ${many}`;
}

const russianSeasonNames: Readonly<Record<FarmSummarySeason, string>> = {
  fall: "Осень",
  spring: "Весна",
  summer: "Лето",
  winter: "Зима",
}

const saveModalLocales = ["en", "zh-CN", "ja", "ru"] as const;

type SaveModalLocale = (typeof saveModalLocales)[number];

function readSaveModalLocale(locale: HomepageLocale): SaveModalLocale {
  const localeValue: string = locale;
  for (const saveModalLocale of saveModalLocales) {
    if (localeValue === saveModalLocale) {
      return saveModalLocale;
    }
  }

  throw new Error(
    `Unsupported save-modal locale. Received: ${JSON.stringify(localeValue)}.`,
  );
}

export type SaveModalBranch = "farm-summary" | "game-save" | "projects" | "tools";
export type FarmSummarySeason = "fall" | "spring" | "summer" | "winter";

export type SaveToolsCopy = Readonly<{
  branchLoadFailure: (branch: SaveModalBranch, rawError: string) => string;
  farmSummary: string;
  gameSave: string;
  label: string;
  loadingBranch: (branch: SaveModalBranch) => string;
  localProjects: string;
  myPlans: string;
  planGroupLabel: string;
  retryBranch: (branch: SaveModalBranch) => string;
  tools: string;
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
  deviceTools: string;
  deletedProject: string;
  downloadedImage: (projectName: string) => string;
  downloadImage: (projectName?: string) => string;
  duplicate: string;
  duplicatedProject: string;
  emptyState: string;
  emptyFolder: string;
  exportedProject: (projectName: string) => string;
  exportJson: string;
  folderCreated: string;
  folderGroupLabel: string;
  folderMoved: (folderName: string) => string;
  folderName: string;
  importedProject: (filename: string) => string;
  importJson: string;
  localProjects: string;
  myPlansFolder: string;
  mapPreviewAlt: (projectName: string) => string;
  noDownloadablePreview: string;
  noMapPreview: string;
  noSearchResults: string;
  newProject: string;
  newProjectName: string;
  newFolder: string;
  newFolderName: string;
  createFolder: string;
  cancelCreateFolder: string;
  moveToFolder: string;
  none: string;
  open: string;
  openedProject: (projectName: string) => string;
  openingBrowserStorage: string;
  projectMapCount: (count: number) => string;
  rename: string;
  renamedProject: string;
  saveToDevice: string;
  savedLocalProjects: string;
  savedToBrowser: string;
  searchProjects: string;
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

function readJapaneseSeasonName(season: FarmSummarySeason): string {
  if (season === "spring") return "春";
  if (season === "summer") return "夏";
  if (season === "fall") return "秋";
  if (season === "winter") return "冬";
  const unsupportedSeason: never = season;
  throw new TypeError(
    `Unsupported farm summary season. Received: ${JSON.stringify(unsupportedSeason)}.`,
  );
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
      myPlans: "My Plans",
      planGroupLabel: "Plans",
      retryBranch: (branch: SaveModalBranch) => `Retry ${getEnglishBranchLabel(branch)}`,
      tools: "Tools",
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
      deviceTools: "Device tools",
      deletedProject: "Deleted the local project.",
      downloadedImage: (projectName: string) =>
        `Downloaded preview image for ${projectName}.`,
      downloadImage: (projectName?: string) =>
        projectName ? `Download image: ${projectName}` : "Download image",
      duplicate: "Duplicate",
      duplicatedProject: "Duplicated the local project.",
      emptyState: "No local projects yet. Saving creates an Untitled Project and saves the current map.",
      emptyFolder: "This folder is empty.",
      exportedProject: (projectName: string) => `Exported ${projectName}.`,
      exportJson: "Export JSON",
      folderCreated: "Created a folder.",
      folderGroupLabel: "Folders",
      folderMoved: (folderName: string) => `Moved the plan to ${folderName}.`,
      folderName: "Folder name",
      importedProject: (filename: string) => `Imported ${filename}.`,
      importJson: "Import JSON",
      localProjects: "Local projects",
      myPlansFolder: "My Plans",
      mapPreviewAlt: (projectName: string) => `Map preview for ${projectName}`,
      noDownloadablePreview: "No downloadable preview for this project",
      noMapPreview: "No saved map preview",
      noSearchResults: "No local projects match your search.",
      newProject: "New plan",
      newProjectName: "New plan name",
      newFolder: "+ New folder",
      newFolderName: "New folder name",
      createFolder: "Create folder",
      cancelCreateFolder: "Cancel",
      moveToFolder: "Move to folder",
      none: "None",
      open: "Open",
      openedProject: (projectName: string) => `Opened ${projectName}.`,
      openingBrowserStorage: "Opening browser storage…",
      projectMapCount: (count: number) =>
        `${String(count)} ${count === 1 ? "map" : "maps"}`,
      rename: "Rename",
      renamedProject: "Renamed the local project.",
      saveToDevice: "Save to this device",
      savedLocalProjects: "Saved local projects",
      savedToBrowser: "Saved to this browser.",
      searchProjects: "Search plans",
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
      myPlans: "我的方案",
      planGroupLabel: "方案",
      retryBranch: (branch: SaveModalBranch) => `重试加载${getChineseBranchLabel(branch)}`,
      tools: "工具",
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
      deviceTools: "设备工具",
      deletedProject: "已删除本地项目。",
      downloadedImage: (projectName: string) =>
        `已下载“${projectName}”的预览图片。`,
      downloadImage: (projectName?: string) =>
        projectName ? `下载图片：${projectName}` : "下载图片",
      duplicate: "创建副本",
      duplicatedProject: "已复制本地项目。",
      emptyState: "还没有本地项目。保存时会创建“未命名项目”，并保存当前地图。",
      emptyFolder: "此文件夹中还没有方案。",
      exportedProject: (projectName: string) => `已导出“${projectName}”。`,
      exportJson: "导出 JSON",
      folderCreated: "已创建文件夹。",
      folderGroupLabel: "文件夹",
      folderMoved: (folderName: string) => `已将方案移至“${folderName}”。`,
      folderName: "文件夹名称",
      importedProject: (filename: string) => `已导入“${filename}”。`,
      importJson: "导入 JSON",
      localProjects: "本地项目",
      myPlansFolder: "我的方案",
      mapPreviewAlt: (projectName: string) => `“${projectName}”的地图预览`,
      noDownloadablePreview: "该项目暂无可下载预览",
      noMapPreview: "暂无已保存的地图预览",
      noSearchResults: "没有匹配的本地项目。",
      newProject: "新建方案",
      newProjectName: "新方案名称",
      newFolder: "+ 新建文件夹",
      newFolderName: "新文件夹名称",
      createFolder: "创建文件夹",
      cancelCreateFolder: "取消",
      moveToFolder: "移动到文件夹",
      none: "无",
      open: "打开",
      openedProject: (projectName: string) => `已打开“${projectName}”。`,
      openingBrowserStorage: "正在打开浏览器存储…",
      projectMapCount: (count: number) => `${String(count)} 张地图`,
      rename: "重命名",
      renamedProject: "已重命名本地项目。",
      saveToDevice: "保存到此设备",
      savedLocalProjects: "已保存的本地项目",
      savedToBrowser: "已保存到此浏览器。",
      searchProjects: "搜索方案",
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
  ja: {
    saveTools: {
      branchLoadFailure: (branch: SaveModalBranch, rawError: string) =>
        `保存ツールの分岐 ${JSON.stringify(branch)} を読み込めません：${rawError}`,
      farmSummary: "牧場の概要",
      gameSave: "ゲームセーブをインポート",
      label: "保存ツール",
      loadingBranch: (branch: SaveModalBranch) => `「${getJapaneseBranchLabel(branch)}」を読み込んでいます…`,
      localProjects: "ローカルプロジェクト",
      myPlans: "マイプラン",
      planGroupLabel: "プラン",
      retryBranch: (branch: SaveModalBranch) => `「${getJapaneseBranchLabel(branch)}」を再読み込み`,
      tools: "ツール",
    },
    localProjects: {
      actionFailure: (rawError: string) => `ローカルプロジェクトの操作に失敗しました：${rawError}`,
      applyName: "名前を適用",
      cancelRename: "名前の変更をキャンセル",
      createdProject: "ローカルプロジェクトを作成しました。",
      current: "現在",
      currentMap: "現在のマップ",
      currentMapCount: (count: number) => `${String(count)}枚の地図`,
      currentProject: "現在のプロジェクト",
      dateTimeLocale: "ja",
      defaultProjectName: "無題のプロジェクト",
      delete: "削除",
      deviceTools: "端末ツール",
      deletedProject: "ローカルプロジェクトを削除しました。",
      downloadedImage: (projectName: string) =>
        `「${projectName}」のプレビュー画像をダウンロードしました。`,
      downloadImage: (projectName?: string) =>
        projectName ? `画像をダウンロード：${projectName}` : "画像をダウンロード",
      duplicate: "複製",
      duplicatedProject: "ローカルプロジェクトを複製しました。",
      emptyState: "ローカルプロジェクトはまだありません。保存すると「無題のプロジェクト」が作られ、現在のマップが保存されます。",
      emptyFolder: "このフォルダにはまだプランがありません。",
      exportedProject: (projectName: string) => `「${projectName}」をエクスポートしました。`,
      exportJson: "JSONをエクスポート",
      folderCreated: "フォルダを作成しました。",
      folderGroupLabel: "フォルダ",
      folderMoved: (folderName: string) => `プランを「${folderName}」へ移動しました。`,
      folderName: "フォルダ名",
      importedProject: (filename: string) => `「${filename}」をインポートしました。`,
      importJson: "JSONをインポート",
      localProjects: "ローカルプロジェクト",
      myPlansFolder: "マイプラン",
      mapPreviewAlt: (projectName: string) => `「${projectName}」のマッププレビュー`,
      noDownloadablePreview: "このプロジェクトにはダウンロードできるプレビューがありません",
      noMapPreview: "保存済みのマッププレビューはありません",
      noSearchResults: "一致するローカルプロジェクトはありません。",
      newProject: "新しいプラン",
      newProjectName: "新しいプランの名前",
      newFolder: "+ 新しいフォルダ",
      newFolderName: "新しいフォルダの名前",
      createFolder: "フォルダを作成",
      cancelCreateFolder: "キャンセル",
      moveToFolder: "フォルダへ移動",
      none: "なし",
      open: "開く",
      openedProject: (projectName: string) => `「${projectName}」を開きました。`,
      openingBrowserStorage: "ブラウザの保存領域を開いています…",
      projectMapCount: (count: number) => `${String(count)}枚の地図`,
      rename: "名前を変更",
      renamedProject: "ローカルプロジェクトの名前を変更しました。",
      saveToDevice: "この端末に保存",
      savedLocalProjects: "保存済みのローカルプロジェクト",
      savedToBrowser: "このブラウザに保存しました。",
      searchProjects: "プランを検索",
      storedInBrowser: "このブラウザに保存されています。",
    },
    deleteProject: {
      confirm: "プロジェクトを削除",
      descriptionPrefix: "このブラウザから「",
      descriptionSuffix: "」を削除しますか？この操作は元に戻せません。",
      dismiss: "プロジェクトを残す",
      title: "ローカルプロジェクトを削除しますか？",
    },
    imageExport: {
      exportFailure: (rawError: string) => `スクリーンショットをエクスポートできませんでした：${rawError}`,
      exportLabel: "エクスポート",
      screenshot: "スクリーンショット",
      screenshotHighQuality: "スクリーンショット（高画質）",
      screenshotHighQualityTitle: "2倍解像度、より高い画質",
      screenshotTitle: "1倍解像度、ファイルサイズは小さめ",
    },
    thumbnail: {
      saveFailure: (rawError: string) => `サムネイルを保存できませんでした：${rawError}`,
      saveLabel: "サムネイルを保存",
      saved: "サムネイルをこのブラウザに保存しました。",
      title: "サムネイル",
    },
    gameSave: {
      ariaLabel: "ゲームセーブをインポート",
      chooseFile: "セーブファイルを選択",
      close: "閉じる",
      description: "スターデューバレーのセーブファイルを選ぶと、このプランナーで牧場をプレビューできます。",
      experimentalNotice: "ゲームセーブのインポートは実験的機能です。未対応のアイテムはマップに配置されません。",
      importFailure: (rawError: string) => `ゲームセーブをインポートできませんでした：${rawError}`,
      importing: (filename: string) => `「${filename}」をインポートしています…`,
      localOnlyNotice: "インポートしたマップは、この端末に保存するまでこのブラウザ内だけにあります。",
      resultCloseLabel: "ゲームセーブのインポート結果を閉じる",
      resultImportedAll: "認識できたマップ配置はすべてインポートしました。",
      resultTitle: (farmName: string) => `「${farmName}牧場」`,
      tooltip: "スターデューバレーのセーブファイルをインポートして、牧場のレイアウトを表示します",
      unmappedItems: (count: number) => `${String(count)}件のアイテムを対応付けできませんでした（Mod由来の可能性があります）。`,
    },
    gameSaveResultLoader: {
      loadFailure: (rawError: string) => `インポートしたゲームセーブの結果を読み込めませんでした：${rawError}`,
      loading: "インポートしたゲームセーブの結果を読み込んでいます…",
      retry: "結果の読み込みを再試行",
    },
    farmSummaryPreview: {
      ariaLabel: "牧場の概要",
      itemsPlaced: (count: number) => `${String(count)}個のアイテムを配置済み`,
      map: "マップ",
      season: readJapaneseSeasonName,
      seasonLabel: "季節",
      viewDetails: "詳細な概要を見る",
    },
    farmSummaryDetail: {
      closeLabel: "牧場の概要を閉じる",
      empty: "まだアイテムは配置されていません。",
      exportCsv: "CSVをエクスポート",
      exportFailure: (rawError: string) => `牧場の概要をエクスポートできませんでした：${rawError}`,
      itemsPlaced: (count: number) => `${String(count)}個のアイテムを配置済み`,
      map: "マップ",
      season: readJapaneseSeasonName,
      seasonLabel: "季節",
      title: "牧場の概要",
    },
  },
  ru: {
    saveTools: {
      branchLoadFailure: (branch: SaveModalBranch, rawError: string) =>
        `Не удалось загрузить ветку инструментов сохранения ${JSON.stringify(branch)}: ${rawError}`,
      farmSummary: "Сводка фермы",
      gameSave: "Импорт сохранения",
      label: "Инструменты сохранения",
      loadingBranch: (branch: SaveModalBranch) => `Загрузка: ${getRussianBranchLabel(branch)}…`,
      localProjects: "Локальные проекты",
      myPlans: "Мои планы",
      planGroupLabel: "Планы",
      retryBranch: (branch: SaveModalBranch) => `Повторить: ${getRussianBranchLabel(branch)}`,
      tools: "Инструменты",
    },
    localProjects: {
      actionFailure: (rawError: string) => `Не удалось выполнить действие с локальным проектом: ${rawError}`,
      applyName: "Применить имя",
      cancelRename: "Отменить переименование",
      createdProject: "Локальный проект создан.",
      current: "Текущий",
      currentMap: "Текущая карта",
      currentMapCount: (count: number) => formatRussianCountedNoun(count, "карта", "карты", "карт"),
      currentProject: "Текущий проект",
      dateTimeLocale: "ru",
      defaultProjectName: "Проект без названия",
      delete: "Удалить",
      deviceTools: "Инструменты устройства",
      deletedProject: "Локальный проект удалён.",
      downloadedImage: (projectName: string) =>
        `Скачано превью «${projectName}».`,
      downloadImage: (projectName?: string) =>
        projectName ? `Скачать изображение: ${projectName}` : "Скачать изображение",
      duplicate: "Дублировать",
      duplicatedProject: "Локальный проект дублирован.",
      emptyState: "Локальных проектов пока нет. Сохранение создаёт проект «Проект без названия» и сохраняет текущую карту.",
      emptyFolder: "Эта папка пуста.",
      exportedProject: (projectName: string) => `Проект «${projectName}» экспортирован.`,
      exportJson: "Экспорт JSON",
      folderCreated: "Папка создана.",
      folderGroupLabel: "Папки",
      folderMoved: (folderName: string) => `План перемещён в папку «${folderName}».`,
      folderName: "Имя папки",
      importedProject: (filename: string) => `Импорт «${filename}» выполнен.`,
      importJson: "Импорт JSON",
      localProjects: "Локальные проекты",
      myPlansFolder: "Мои планы",
      mapPreviewAlt: (projectName: string) => `Превью карты «${projectName}»`,
      noDownloadablePreview: "У этого проекта нет превью для скачивания",
      noMapPreview: "Нет сохранённого превью карты",
      noSearchResults: "Нет локальных проектов по этому запросу.",
      newProject: "Новый план",
      newProjectName: "Название нового плана",
      newFolder: "+ Новая папка",
      newFolderName: "Название новой папки",
      createFolder: "Создать папку",
      cancelCreateFolder: "Отмена",
      moveToFolder: "Переместить в папку",
      none: "Нет",
      open: "Открыть",
      openedProject: (projectName: string) => `Проект «${projectName}» открыт.`,
      openingBrowserStorage: "Открывается хранилище браузера…",
      projectMapCount: (count: number) => formatRussianCountedNoun(count, "карта", "карты", "карт"),
      rename: "Переименовать",
      renamedProject: "Локальный проект переименован.",
      saveToDevice: "Сохранить на этом устройстве",
      savedLocalProjects: "Сохранённые локальные проекты",
      savedToBrowser: "Сохранено в этом браузере.",
      searchProjects: "Искать планы",
      storedInBrowser: "Хранится в этом браузере.",
    },
    deleteProject: {
      confirm: "Удалить проект",
      descriptionPrefix: "Удалить «",
      descriptionSuffix: "» из этого браузера? Это нельзя отменить.",
      dismiss: "Оставить проект",
      title: "Удалить локальный проект?",
    },
    imageExport: {
      exportFailure: (rawError: string) => `Не удалось экспортировать скриншот: ${rawError}`,
      exportLabel: "Экспорт",
      screenshot: "Скриншот",
      screenshotHighQuality: "Скриншот (HQ)",
      screenshotHighQualityTitle: "Разрешение 2×, выше качество",
      screenshotTitle: "Разрешение 1×, компактный файл",
    },
    thumbnail: {
      saveFailure: (rawError: string) => `Не удалось сохранить миниатюру: ${rawError}`,
      saveLabel: "Сохранить миниатюру",
      saved: "Миниатюра сохранена в этом браузере.",
      title: "Миниатюра",
    },
    gameSave: {
      ariaLabel: "Импорт сохранения",
      chooseFile: "Выбрать файл сохранения",
      close: "Закрыть",
      description: "Выберите файл сохранения Stardew Valley, чтобы посмотреть ферму в этом планировщике.",
      experimentalNotice: "Импорт сохранений экспериментальный. Неподдерживаемые предметы на карту не ставятся.",
      importFailure: (rawError: string) => `Не удалось импортировать сохранение: ${rawError}`,
      importing: (filename: string) => `Импорт ${filename}…`,
      localOnlyNotice: "Импортированная карта есть только в этом браузере, пока вы не сохраните её на этом устройстве.",
      resultCloseLabel: "Закрыть результат импорта сохранения",
      resultImportedAll: "Все распознанные объекты на карте импортированы.",
      resultTitle: (farmName: string) => `«Ферма ${farmName}»`,
      tooltip: "Импортируйте файл сохранения Stardew Valley, чтобы увидеть планировку фермы",
      unmappedItems: (count: number) =>
        `${formatRussianCountedNoun(count, "предмет", "предмета", "предметов")} не удалось сопоставить (вероятно, из модов).`,
    },
    gameSaveResultLoader: {
      loadFailure: (rawError: string) => `Не удалось загрузить результат импорта сохранения: ${rawError}`,
      loading: "Загрузка результата импорта сохранения…",
      retry: "Повторить загрузку результата",
    },
    farmSummaryPreview: {
      ariaLabel: "Сводка фермы",
      itemsPlaced: (count: number) =>
        formatRussianCountedNoun(count, "предмет размещён", "предмета размещены", "предметов размещено"),
      map: "Карта",
      season: createSeasonFormatter(russianSeasonNames),
      seasonLabel: "Сезон",
      viewDetails: "Подробная сводка",
    },
    farmSummaryDetail: {
      closeLabel: "Закрыть сводку фермы",
      empty: "Пока ничего не размещено.",
      exportCsv: "Экспорт CSV",
      exportFailure: (rawError: string) => `Не удалось экспортировать сводку фермы: ${rawError}`,
      itemsPlaced: (count: number) =>
        formatRussianCountedNoun(count, "предмет размещён", "предмета размещены", "предметов размещено"),
      map: "Карта",
      season: createSeasonFormatter(russianSeasonNames),
      seasonLabel: "Сезон",
      title: "Сводка фермы",
    },
  },

} as const satisfies Readonly<Record<SaveModalLocale, SaveModalCopy>>;

export function getSaveModalCopy(locale: HomepageLocale): SaveModalCopy {
  const saveModalLocale = readSaveModalLocale(locale);
  return saveModalCopyByLocale[saveModalLocale];
}

function getEnglishBranchLabel(branch: SaveModalBranch): string {
  if (branch === "projects") return "Local projects";
  if (branch === "game-save") return "Import Game Save";
  if (branch === "farm-summary") return "Farm Summary";
  if (branch === "tools") return "Tools";
  throw new Error(`Unsupported save-modal branch ${JSON.stringify(branch)}.`);
}

function getChineseBranchLabel(branch: SaveModalBranch): string {
  if (branch === "projects") return "本地项目";
  if (branch === "game-save") return "导入游戏存档";
  if (branch === "farm-summary") return "农场摘要";
  if (branch === "tools") return "工具";
  throw new Error(`Unsupported save-modal branch ${JSON.stringify(branch)}.`);
}

function getJapaneseBranchLabel(branch: SaveModalBranch): string {
  if (branch === "projects") return "ローカルプロジェクト";
  if (branch === "game-save") return "ゲームセーブのインポート";
  if (branch === "farm-summary") return "牧場の概要";
  if (branch === "tools") return "ツール";
  throw new Error(`Unsupported save-modal branch ${JSON.stringify(branch)}.`);
}

function getRussianBranchLabel(branch: SaveModalBranch): string {
  if (branch === "projects") return "Локальные проекты";
  if (branch === "game-save") return "Импорт сохранения";
  if (branch === "farm-summary") return "Сводка фермы";
  if (branch === "tools") return "Инструменты";
  throw new Error(`Unsupported save-modal branch ${JSON.stringify(branch)}.`);
}
