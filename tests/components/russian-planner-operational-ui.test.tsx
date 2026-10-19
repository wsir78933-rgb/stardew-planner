import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { CatalogItem } from "../../src/catalog";
import {
  AmbienceConfigPanel,
  SettingsConfigPanel,
  ViewConfigPanel,
} from "../../src/components/editor-config-panels";
import { EditorMenuBar } from "../../src/components/editor-menu-bar";
import { EditorToolbar } from "../../src/components/editor-toolbar";
import { FarmSummaryPanel } from "../../src/components/farm-summary-panel";
import { GameSaveImportControl } from "../../src/components/game-save-import-panel";
import {
  CatalogItemGrid,
  CatalogPanelContent,
  ItemCatalogPanel,
} from "../../src/components/item-catalog-panel";
import {
  formatLocalProjectUpdatedAt,
  LocalProjectPanel,
  readLibraryChromeCopy,
} from "../../src/components/local-project-panel";
import { readVisibleCurrentProjectMapInstanceName } from "../../src/components/planner-workspace";
import { PlannerHomepage } from "../../src/components/planner-homepage";
import { ProjectMapInstancePanel } from "../../src/components/project-map-instance-panel";
import { PlannerStartupStatus } from "../../src/components/planner-startup-status";
import { ReactPlannerHost } from "../../src/components/react-planner-host";
import { createInitialEditorBehaviorOptions } from "../../src/editor/editor-behavior-options";
import { createInitialEditorDisplayOptions } from "../../src/editor/editor-display-options";
import { createInitialPlannerAmbienceOptions } from "../../src/editor/planner-ambience-options";
import type { HomepageLocale } from "../../src/homepage/homepage-locale";
import { getEditorModalCopy } from "../../src/i18n/editor-modal-copy";
import { getRussianCatalogItemDisplayName } from "../../src/i18n/planner-russian-display-names";
import { getSaveModalCopy } from "../../src/i18n/save-modal-copy";
import type { PlannerMap } from "../../src/maps/map-catalog";
import { createEmptyPlacementSnapshot } from "../../src/placement/placement-snapshot";
import type { ReferenceProjectMap } from "../../src/reference-runtime/local-project-api";
import type { ReferenceProjectSummary } from "../../src/reference-runtime/reference-project-repository";

const coopCatalogItem: CatalogItem = {
  id: "building:Coop",
  name: "Coop",
  category: "building",
  tileSize: { width: 6, height: 3 },
  textureLocalPath: "/game-assets/1.6.15/buildings/Coop.png",
  sprite: { kind: "source-rect", x: 16, y: 32, width: 96, height: 48 },
  allowedTools: ["cursor"],
};

const forestProjectSummary: ReferenceProjectSummary = {
  id: "project-forest",
  title: "Forest Farm",
  created_at: "2026-07-26T00:00:00.000Z",
  updated_at: "2026-07-26T01:00:00.000Z",
  mapCount: 2,
  activeMapThumbnailDataUrl: "data:image/webp;base64,UklGRg4AAABXRUJQVlA4IAEAAAAAAA==",
};

function ignoreLocalProjectAction(): Promise<void> {
  return Promise.resolve();
}

describe("Russian planner operational UI", () => {
  it("renders Russian catalog categories, search, loading, and item actions", () => {
    const catalogMarkup = renderToStaticMarkup(
      createElement(ItemCatalogPanel, {
        catalogPresentationChoicesByItemId: new Map(),
        category: "buildings",
        locale: "ru",
        panelPosition: "bottom",
        searchQuery: "keg",
        selectedCatalogItemId: null,
        onCatalogItemSelect: () => undefined,
        onCategoryChange: () => undefined,
        onSearchQueryChange: () => undefined,
      }),
    );
    const coopDisplayName = getRussianCatalogItemDisplayName(coopCatalogItem.id);
    if (coopDisplayName === coopCatalogItem.name) {
      throw new Error(
        `Russian catalog name for ${JSON.stringify(coopCatalogItem.id)} is still ${JSON.stringify(coopCatalogItem.name)}.`,
      );
    }
    const itemMarkup = renderToStaticMarkup(
      createElement(CatalogItemGrid, {
        catalogItems: [coopCatalogItem],
        catalogPresentationChoicesByItemId: new Map(),
        locale: "ru",
        onCatalogItemSelect: () => undefined,
        selectedCatalogItemId: null,
      }),
    );
    const errorMarkup = renderToStaticMarkup(
      createElement(CatalogPanelContent, {
        catalogItems: null,
        catalogPanelLoadState: {
          category: "crops",
          kind: "error",
          message: "Catalog category crops failed at /data/Crops.json.",
          scope: "category",
        },
        catalogPresentationChoicesByItemId: new Map(),
        category: "crops",
        locale: "ru",
        onCatalogItemSelect: () => undefined,
        onRetry: () => undefined,
        selectedCatalogItemId: null,
        viewMode: "grid",
      }),
    );

    expect(catalogMarkup).toContain('aria-label="Каталог предметов"');
    expect(catalogMarkup).toContain('aria-label="Искать среди всех предметов"');
    expect(catalogMarkup).toContain('placeholder="Искать среди всех предметов"');
    expect(catalogMarkup).toContain('aria-label="Очистить поиск"');
    expect(catalogMarkup).toContain('aria-label="Постройки"');
    expect(catalogMarkup).toContain('aria-label="Культуры"');
    expect(catalogMarkup).toContain('aria-label="Деревья"');
    expect(catalogMarkup).toContain('aria-label="Оборудование"');
    expect(catalogMarkup).toContain(">Результаты поиска</h2>");
    expect(catalogMarkup).toContain("Загрузка предметов…");
    expect(catalogMarkup).not.toContain('aria-label="Buildings"');
    expect(catalogMarkup).not.toContain('aria-label="建筑"');
    expect(catalogMarkup).not.toContain('placeholder="Search all items"');
    expect(catalogMarkup).not.toContain('placeholder="搜索全部物品"');
    expect(catalogMarkup).not.toContain(">Search results</h2>");
    expect(catalogMarkup).not.toContain(">搜索结果</h2>");
    expect(catalogMarkup).not.toContain("Loading items…");
    expect(catalogMarkup).not.toContain("正在加载物品…");
    expect(itemMarkup).toContain(
      `aria-label="Выбрать ${coopDisplayName}, 6 × 3 клеток"`,
    );
    expect(itemMarkup).toContain(`>${coopDisplayName}</span>`);
    expect(itemMarkup).not.toContain("Select Coop");
    expect(itemMarkup).not.toContain(">Coop</span>");
    expect(itemMarkup).not.toContain("选择Coop");
    expect(errorMarkup).toContain('role="alert"');
    expect(errorMarkup).toContain(
      "Не удалось загрузить предметы. Catalog category crops failed at /data/Crops.json.",
    );
    expect(errorMarkup).toContain(">Повторить</button>");
    expect(errorMarkup).not.toContain("Items could not be loaded.");
    expect(errorMarkup).not.toContain("物品加载失败。");
    expect(errorMarkup).not.toContain(">Retry</button>");
    expect(errorMarkup).not.toContain(">重试</button>");
  });

  it("renders the Russian toolbar, menu, settings, seasons, and view ranges", () => {
    const toolbarMarkup = renderToStaticMarkup(
      createElement(EditorToolbar, {
        canRedo: false,
        canUndo: false,
        locale: "ru",
        onRedo: () => undefined,
        onToolChange: () => undefined,
        onUndo: () => undefined,
        onWheelZoomToggle: () => undefined,
        tool: "cursor",
        wheelZoomEnabled: false,
      }),
    );
    const menuMarkup = renderToStaticMarkup(
      createElement(EditorMenuBar, {
        activeModalId: null,
        locale: "ru",
        mapDisplayName: "Стандартная ферма",
        onCycleSeason: () => undefined,
        onOpenModal: () => undefined,
        season: "spring",
      }),
    );
    const settingsMarkup = renderToStaticMarkup(
      createElement(SettingsConfigPanel, {
        behaviorOptions: createInitialEditorBehaviorOptions(),
        copy: getEditorModalCopy("ru").settings,
        locale: "ru",
        onBehaviorChange: () => undefined,
      }),
    );
    const viewMarkup = renderToStaticMarkup(
      createElement(ViewConfigPanel, {
        behaviorOptions: createInitialEditorBehaviorOptions(),
        displayOptions: createInitialEditorDisplayOptions(),
        locale: "ru",
        onBehaviorChange: () => undefined,
        onDisplayToggle: () => undefined,
        onPanelPositionChange: () => undefined,
        panelPosition: "left",
        selectedMapId: "standard",
      }),
    );
    const ambienceMarkup = renderToStaticMarkup(
      createElement(AmbienceConfigPanel, {
        ambienceOptions: createInitialPlannerAmbienceOptions(),
        locale: "ru",
        nightMode: false,
        onAmbienceChange: () => undefined,
        onNightModeToggle: () => undefined,
        onSeasonChange: () => undefined,
        season: "spring",
      }),
    );

    expect(toolbarMarkup).toContain('aria-label="Инструменты редактора"');
    expect(toolbarMarkup).toContain('aria-label="Выбор"');
    expect(toolbarMarkup).toContain('aria-label="Несколько"');
    expect(toolbarMarkup).toContain('aria-label="Заливка"');
    expect(toolbarMarkup).toContain('aria-label="Стирание"');
    expect(toolbarMarkup).toContain('aria-label="Масштаб"');
    expect(toolbarMarkup).toContain('aria-label="Отменить"');
    expect(toolbarMarkup).toContain('aria-label="Повторить"');
    expect(toolbarMarkup).toContain('title="Отменить (Ctrl+Z)"');
    expect(toolbarMarkup).not.toContain('aria-label="Select"');
    expect(toolbarMarkup).not.toContain('aria-label="选择"');
    expect(toolbarMarkup).not.toContain('aria-label="Editor tools"');
    expect(menuMarkup).toContain('aria-label="Меню"');
    expect(menuMarkup).toContain('aria-label="Библиотека"');
    expect(menuMarkup).toContain('aria-label="Настройки фермы"');
    expect(menuMarkup).toContain('aria-label="Настройки"');
    expect(menuMarkup).toContain('aria-label="Вид"');
    expect(menuMarkup).toContain('aria-label="Атмосфера"');
    expect(menuMarkup).toContain('aria-label="Карта"');
    expect(menuMarkup).toContain('aria-label="Текущая карта: Стандартная ферма"');
    expect(menuMarkup).not.toContain('aria-label="Library"');
    expect(menuMarkup).not.toContain('aria-label="本地项目"');
    expect(menuMarkup).not.toContain('aria-label="Farm Settings"');
    expect(menuMarkup).not.toContain('aria-label="农场设置"');
    expect(settingsMarkup).toContain("Свободное размещение");
    expect(settingsMarkup).toContain("Всплывающие уведомления");
    expect(settingsMarkup).toContain("Показать джойстик");
    expect(settingsMarkup).toContain("Режим левой руки");
    expect(settingsMarkup).toContain('href="/privacy"');
    expect(settingsMarkup).toContain("Политика конфиденциальности");
    expect(settingsMarkup).toContain('href="/terms"');
    expect(settingsMarkup).not.toContain('href="/ru/privacy"');
    expect(settingsMarkup).not.toContain("Free placement");
    expect(settingsMarkup).not.toContain("自由放置");
    expect(viewMarkup).toContain("Разбрызгиватель");
    expect(viewMarkup).toContain("Пугало");
    expect(viewMarkup).toContain("Сетка");
    expect(viewMarkup).toContain("Слева");
    expect(viewMarkup).toContain("Снизу");
    expect(viewMarkup).not.toContain("Sprinkler");
    expect(viewMarkup).not.toContain("洒水器");
    expect(ambienceMarkup).toContain('aria-label="Весна"');
    expect(ambienceMarkup).toContain('aria-label="Лето"');
    expect(ambienceMarkup).toContain('aria-label="Осень"');
    expect(ambienceMarkup).toContain('aria-label="Зима"');
    expect(ambienceMarkup).toContain("Ночной режим");
    expect(ambienceMarkup).toContain("Ясно");
    expect(ambienceMarkup).toContain("Дождь");
    expect(ambienceMarkup).not.toContain('aria-label="Spring"');
    expect(ambienceMarkup).not.toContain('aria-label="春季"');
    expect(ambienceMarkup).not.toContain(">Clear<");
  });

  it("renders Russian project library, save import, export, and farm summary", () => {
    const russianSaveCopy = getSaveModalCopy("ru");
    const updatedAt = "2026-07-26T01:00:00.000Z";
    const libraryMarkup = renderToStaticMarkup(
      createElement(LocalProjectPanel, {
        copy: russianSaveCopy.localProjects,
        currentProjectId: null,
        currentProjectName: null,
        deleteCopy: russianSaveCopy.deleteProject,
        onCreateProject: ignoreLocalProjectAction,
        onDeleteProject: ignoreLocalProjectAction,
        onDuplicateProject: ignoreLocalProjectAction,
        onExportProject: () => "{}",
        onImportProject: ignoreLocalProjectAction,
        onOpenProject: ignoreLocalProjectAction,
        onRenameProject: ignoreLocalProjectAction,
        projects: [forestProjectSummary],
        storageErrorMessage: null,
        storageStatus: "ready",
      }),
    );
    const emptyLibraryMarkup = renderToStaticMarkup(
      createElement(LocalProjectPanel, {
        copy: russianSaveCopy.localProjects,
        currentProjectId: null,
        currentProjectName: null,
        deleteCopy: russianSaveCopy.deleteProject,
        onCreateProject: ignoreLocalProjectAction,
        onDeleteProject: ignoreLocalProjectAction,
        onDuplicateProject: ignoreLocalProjectAction,
        onExportProject: () => "{}",
        onImportProject: ignoreLocalProjectAction,
        onOpenProject: ignoreLocalProjectAction,
        onRenameProject: ignoreLocalProjectAction,
        projects: [],
        storageErrorMessage: null,
        storageStatus: "ready",
      }),
    );
    const gameSaveMarkup = renderToStaticMarkup(
      createElement(GameSaveImportControl, {
        copy: russianSaveCopy.gameSave,
        onImportGameSave: () => undefined,
      }),
    );
    const farmSummaryMarkup = renderToStaticMarkup(
      createElement(FarmSummaryPanel, {
        catalogItems: [],
        copy: {
          detail: russianSaveCopy.farmSummaryDetail,
          preview: russianSaveCopy.farmSummaryPreview,
        },
        mapContext: {
          baseMapId: "standard",
          displayName: "Standard Farm",
          season: "spring",
        },
        placementSnapshot: createEmptyPlacementSnapshot(),
      }),
    );
    const russianUpdatedAt = formatLocalProjectUpdatedAt(updatedAt, "ru");
    const libraryChromeCopy = readLibraryChromeCopy("ru");

    expect(libraryMarkup).toContain('placeholder="Искать планы"');
    expect(libraryMarkup).toContain('aria-label="Искать планы"');
    expect(libraryMarkup).toContain("Импорт JSON");
    expect(libraryMarkup).toContain('aria-label="Скачать изображение: Forest Farm"');
    expect(libraryMarkup).toContain('aria-label="Другие действия"');
    expect(libraryMarkup).toContain("2 карты");
    expect(libraryMarkup).toContain('alt="Превью карты «Forest Farm»"');
    expect(libraryMarkup).not.toContain('aria-label="Download image: Forest Farm"');
    expect(libraryMarkup).not.toContain('aria-label="More actions"');
    expect(libraryMarkup).not.toContain("Import JSON");
    expect(libraryMarkup).toContain(russianUpdatedAt);
    expect(russianUpdatedAt).toMatch(/июл/i);
    expect(russianUpdatedAt).not.toBe(formatLocalProjectUpdatedAt(updatedAt, "en"));
    expect(russianUpdatedAt).not.toBe(formatLocalProjectUpdatedAt(updatedAt, "zh-CN"));
    expect(russianUpdatedAt).not.toMatch(/Jul/);
    expect(libraryMarkup).not.toContain('placeholder="Search plans"');
    expect(libraryMarkup).not.toContain('placeholder="搜索方案"');
    expect(libraryMarkup).not.toContain("2 maps");
    expect(libraryMarkup).not.toContain("2 张地图");
    expect(emptyLibraryMarkup).toContain(
      "Локальных проектов пока нет. Сохранение создаёт проект «Проект без названия» и сохраняет текущую карту.",
    );
    expect(emptyLibraryMarkup).toContain(libraryChromeCopy.importGameSave);
    expect(emptyLibraryMarkup).toContain('aria-label="Группы проектов"');
    expect(emptyLibraryMarkup).not.toContain("No local projects yet");
    expect(emptyLibraryMarkup).not.toContain("还没有本地项目");
    expect(gameSaveMarkup).toContain('aria-label="Импорт сохранения"');
    expect(gameSaveMarkup).toContain("Выбрать файл сохранения");
    expect(gameSaveMarkup).not.toContain("Choose save file");
    expect(gameSaveMarkup).not.toContain("选择存档文件");
    expect(farmSummaryMarkup).toContain('aria-label="Сводка фермы"');
    expect(farmSummaryMarkup).toContain("Сезон: Весна");
    expect(farmSummaryMarkup).toContain("0 предметов размещено");
    expect(farmSummaryMarkup).toContain("Подробная сводка");
    expect(farmSummaryMarkup).not.toContain("Season:");
    expect(farmSummaryMarkup).not.toContain("季节:");
    expect(farmSummaryMarkup).not.toContain("Spring");
    expect(() => formatLocalProjectUpdatedAt("   ", "ru")).toThrow(
      'Cannot format local project updated_at value "   "',
    );
    expect(() => readLibraryChromeCopy("fr" as HomepageLocale)).toThrow(
      'dateTimeLocale is "fr"',
    );
  });

  it("gives the Russian homepage planner locale ru instead of an English editor", () => {
    const homepageMarkup = renderToStaticMarkup(
      createElement(PlannerHomepage, { locale: "ru" }),
    );
    const plannerHostMarkup = renderToStaticMarkup(
      createElement(ReactPlannerHost, { locale: "ru" }),
    );

    expect(homepageMarkup.match(/<h1(?:\s|>)/g)).toHaveLength(1);
    expect(homepageMarkup).toContain("Планировщик фермы ");
    expect(homepageMarkup).toContain(
      '<em data-homepage-hero-emphasis="true">Stardew Valley</em>',
    );
    expect(homepageMarkup).toContain(
      "Бесплатный онлайн-инструмент для планировки фермы",
    );
    expect(homepageMarkup).toContain(
      "Пиксельная карта Стандартной фермы с центральным участком земли, домом, теплицей и двумя прудами",
    );
    expect(homepageMarkup).toMatch(
      /<a[^>]*data-homepage-language-option[^>]*href="\/"[^>]*>English<\/a>[\s\S]*<a[^>]*data-homepage-language-option[^>]*href="\/zh"[^>]*>中文<\/a>[\s\S]*<a[^>]*data-homepage-language-option[^>]*href="\/ja"[^>]*>日本語<\/a>[\s\S]*<a[^>]*data-homepage-language-option[^>]*href="\/ru"[^>]*>Русский<\/a>/,
    );
    expect(homepageMarkup.match(/data-homepage-language-option/g)).toHaveLength(4);
    expect(homepageMarkup).toMatch(/<a[^>]*href="#planner"[^>]*>Начать планирование<\/a>/);
    expect(homepageMarkup).not.toContain("开始规划");
    expect(homepageMarkup).not.toContain("Start planning");
    expect(plannerHostMarkup).toContain("Загрузка планировщика…");
    expect(plannerHostMarkup).not.toContain("Loading planner…");
    expect(() =>
      renderToStaticMarkup(
        createElement(PlannerHomepage, { locale: "fr" as HomepageLocale }),
      ),
    ).toThrow('Unsupported homepage locale. Received: "fr".');
    expect(() =>
      renderToStaticMarkup(
        createElement(EditorMenuBar, {
          activeModalId: null,
          locale: "fr" as never,
          mapDisplayName: "Стандартная ферма",
          onCycleSeason: () => undefined,
          onOpenModal: () => undefined,
          season: "spring",
        }),
      ),
    ).toThrow('received "fr"');
    const startupErrorMarkup = renderToStaticMarkup(
      createElement(PlannerStartupStatus, {
        locale: "ru",
        state: {
          kind: "error",
          message: "Building metadata failed.",
          onRetry: () => undefined,
        },
      }),
    );
    expect(startupErrorMarkup).toContain('role="alert"');
    expect(startupErrorMarkup).toContain("Building metadata failed.");
    expect(startupErrorMarkup).toContain(">Повторить</button>");
    expect(startupErrorMarkup).not.toContain(">Retry</button>");
    expect(() =>
      renderToStaticMarkup(
        createElement(PlannerStartupStatus, {
          locale: "fr" as HomepageLocale,
          state: {
            kind: "error",
            message: "Building metadata failed.",
            onRetry: () => undefined,
          },
        }),
      ),
    ).toThrow('Planner startup locale must be "en", "zh-CN", or "ru"; received "fr".');
    expect(() =>
      renderToStaticMarkup(
        createElement(EditorToolbar, {
          canRedo: false,
          canUndo: false,
          locale: "fr" as never,
          onRedo: () => undefined,
          onToolChange: () => undefined,
          onUndo: () => undefined,
          onWheelZoomToggle: () => undefined,
          tool: "cursor",
          wheelZoomEnabled: false,
        }),
      ),
    ).toThrow('received "fr"');
  });

  it("shows stored default project map labels in Russian and keeps custom labels", () => {
    const storedFarmhouse = createStoredProjectMap(
      "map-farmhouse",
      "FarmHouse.tmx",
      "Farmhouse",
    );
    const storedCustomFarmhouse = createStoredProjectMap(
      "map-custom-farmhouse",
      "FarmHouse.tmx",
      "Мой дом",
    );
    const storedCopiedFarmhouse = createStoredProjectMap(
      "map-copied-farmhouse",
      "FarmHouse.tmx",
      "Farmhouse Copy",
    );
    const storedStandardFarm = createStoredProjectMap(
      "map-standard",
      "Farm.tmx",
      "Standard Farm",
    );
    const storedProjectMaps = [
      storedFarmhouse,
      storedCustomFarmhouse,
      storedCopiedFarmhouse,
      storedStandardFarm,
    ];
    const storedProjectMapsBeforeRender = JSON.stringify(storedProjectMaps);
    const russianFarmhouseLabel = readVisibleCurrentProjectMapInstanceName(
      { sourceMap: storedFarmhouse },
      "ru",
    );
    const customFarmhouseLabel = readVisibleCurrentProjectMapInstanceName(
      { sourceMap: storedCustomFarmhouse },
      "ru",
    );
    const copiedFarmhouseLabel = readVisibleCurrentProjectMapInstanceName(
      { sourceMap: storedCopiedFarmhouse },
      "ru",
    );
    const russianStandardFarmLabel = readVisibleCurrentProjectMapInstanceName(
      { sourceMap: storedStandardFarm },
      "ru",
    );
    const englishFarmhouseLabel = readVisibleCurrentProjectMapInstanceName(
      { sourceMap: storedFarmhouse },
      "en",
    );
    const chineseFarmhouseLabel = readVisibleCurrentProjectMapInstanceName(
      { sourceMap: storedFarmhouse },
      "zh",
    );
    const projectMapListMarkup = renderToStaticMarkup(
      createElement(ProjectMapInstancePanel, {
        locale: "ru",
        activeMapInstanceId: storedFarmhouse.id,
        mapInstances: storedProjectMaps,
        mapChoices: [standardPlannerMapChoice],
        projectChoices: [],
        onAddMap: ignoreProjectMapInstanceAction,
        onCopyMapInstance: ignoreProjectMapInstanceAction,
        onDeleteMapInstance: ignoreProjectMapInstanceAction,
        onDuplicateMapInstance: ignoreProjectMapInstanceAction,
        onMoveMapInstance: ignoreProjectMapInstanceAction,
        onOpenMapInstance: ignoreProjectMapInstanceAction,
        onRenameMapInstance: ignoreProjectMapInstanceAction,
      }),
    );

    expect(readVisibleCurrentProjectMapInstanceName(null, "ru")).toBeNull();
    expect(russianFarmhouseLabel).toBe("Дом");
    expect(customFarmhouseLabel).toBe("Мой дом");
    expect(copiedFarmhouseLabel).toBe("Farmhouse Copy");
    expect(russianStandardFarmLabel).toBe("Стандартная ферма");
    expect(englishFarmhouseLabel).toBe("Farmhouse");
    expect(chineseFarmhouseLabel).toBe("Farmhouse");
    expect(renderLibraryCurrentMapStatus(russianFarmhouseLabel, "ru")).toContain(
      "Текущая карта: <strong>Дом</strong> (1 карта)",
    );
    expect(renderLibraryCurrentMapStatus(customFarmhouseLabel, "ru")).toContain(
      "Текущая карта: <strong>Мой дом</strong> (1 карта)",
    );
    expect(renderLibraryCurrentMapStatus(copiedFarmhouseLabel, "ru")).toContain(
      "Текущая карта: <strong>Farmhouse Copy</strong> (1 карта)",
    );
    expect(renderLibraryCurrentMapStatus(englishFarmhouseLabel, "en")).toContain(
      "Current map: <strong>Farmhouse</strong> (1 maps)",
    );
    expect(renderLibraryCurrentMapStatus(chineseFarmhouseLabel, "zh-CN")).toContain(
      "当前地图: <strong>Farmhouse</strong> (1 张地图)",
    );
    expect(renderLibraryCurrentMapStatus(null, "ru")).not.toContain("Текущая карта:");
    expect(projectMapListMarkup).toContain("<strong>Дом</strong><span>FarmHouse.tmx</span>");
    expect(projectMapListMarkup).toContain("<strong>Мой дом</strong><span>FarmHouse.tmx</span>");
    expect(projectMapListMarkup).toContain(
      "<strong>Farmhouse Copy</strong><span>FarmHouse.tmx</span>",
    );
    expect(projectMapListMarkup).toContain(
      "<strong>Стандартная ферма</strong><span>Farm.tmx</span>",
    );
    expect(projectMapListMarkup).not.toContain("<strong>Farmhouse</strong>");
    expect(JSON.stringify(storedProjectMaps)).toBe(storedProjectMapsBeforeRender);
    expect(() =>
      readVisibleCurrentProjectMapInstanceName(
        { sourceMap: { mapFile: "not-a-map.tmx", label: "Farmhouse" } },
        "ru",
      ),
    ).toThrow('received "not-a-map.tmx"');
    expect(() =>
      readVisibleCurrentProjectMapInstanceName(
        { sourceMap: storedFarmhouse },
        "fr" as "ru",
      ),
    ).toThrow('received "fr"');
    expect(
      readVisibleCurrentProjectMapInstanceName(
        { sourceMap: { mapFile: "not-a-map.tmx", label: "Farmhouse" } },
        "en",
      ),
    ).toBe("Farmhouse");
  });
});

const standardPlannerMapChoice: PlannerMap = {
  id: "standard",
  displayName: "Standard Farm",
  category: "farm",
  mapFile: "Farm.tmx",
  previewOutputPath: "maps/previews/Farm.png",
};

function ignoreProjectMapInstanceAction(): void {}

function createStoredProjectMap(
  id: string,
  mapFile: string,
  label: string,
): ReferenceProjectMap {
  return {
    id,
    mapFile,
    label,
    season: "spring",
    state: {},
    decor: { wallpapers: {}, floors: {} },
    renovations: [],
    thumbnail: "",
  };
}

function renderLibraryCurrentMapStatus(
  currentProjectMapInstanceName: string | null,
  locale: HomepageLocale,
): string {
  const saveCopy = getSaveModalCopy(locale);
  return renderToStaticMarkup(
    createElement(LocalProjectPanel, {
      copy: saveCopy.localProjects,
      currentProjectId: "project-farmhouse",
      currentProjectMapInstanceCount: 1,
      currentProjectMapInstanceName,
      currentProjectName: saveCopy.localProjects.defaultProjectName,
      deleteCopy: saveCopy.deleteProject,
      onCreateProject: ignoreLocalProjectAction,
      onDeleteProject: ignoreLocalProjectAction,
      onDuplicateProject: ignoreLocalProjectAction,
      onExportProject: () => "{}",
      onImportProject: ignoreLocalProjectAction,
      onOpenProject: ignoreLocalProjectAction,
      onRenameProject: ignoreLocalProjectAction,
      projects: [],
      storageErrorMessage: null,
      storageStatus: "ready",
    }),
  );
}
