import type { PlannerChromeLocale } from "../homepage/homepage-locale";

export type PlacementAnimationCopy = Readonly<{
  animalCapacity: (maxCount: number) => string;
  addAnimal: string;
  animal: string;
  clockOff: string;
  defaultOption: string;
  fireplaceLit: string;
  fishPopulation: string;
  fishSpecies: string;
  hat: string;
  junimos: string;
  millLoaded: string;
  millOutput: string;
  millProduct: string;
  machineOutput: string;
  machineState: string;
  newAnimalSpecies: string;
  noneOption: string;
  openOptions: string;
  optionsError: string;
  optionsLoading: string;
  pet: string;
  pondProduce: string;
  populationRange: (min: number, max: number) => string;
  removeAnimal: string;
  selectedAnimal: (animalName: string, index: number) => string;
  shirt: string;
  tankFish: string;
  pants: string;
  horse: string;
  unavailableChoice: (choiceId: string) => string;
}>;

const placementAnimationCopyByLocale: Readonly<
  Record<PlannerChromeLocale, PlacementAnimationCopy>
> = {
  en: {
    animalCapacity: (maxCount) => `Up to ${String(maxCount)} animals`,
    addAnimal: "Add animal",
    animal: "Farm animals",
    clockOff: "Pause Golden Clock animation",
    defaultOption: "Default",
    fireplaceLit: "Fireplace lit",
    fishPopulation: "Fish population",
    fishSpecies: "Fish species",
    hat: "Hat",
    junimos: "Show Junimos",
    machineOutput: "Output item",
    machineState: "Machine state",
    millLoaded: "Mill input loaded",
    millOutput: "Show mill output",
    millProduct: "Mill product",
    newAnimalSpecies: "New animal species",
    noneOption: "None",
    openOptions: "Animation options",
    optionsError: "Animation options could not be loaded.",
    optionsLoading: "Loading animation options…",
    pet: "Pet",
    pondProduce: "Pond produce",
    populationRange: (min, max) => `Enter a whole number from ${String(min)} to ${String(max)}.`,
    removeAnimal: "Remove animal",
    selectedAnimal: (animalName, index) => `${animalName} ${String(index)}`,
    shirt: "Shirt",
    tankFish: "Tank fish",
    pants: "Pants",
    horse: "Show horse",
    unavailableChoice: (choiceId) => `Unavailable (${choiceId})`,
  },
  zh: {
    animalCapacity: (maxCount) => `最多 ${String(maxCount)} 只动物`,
    addAnimal: "添加动物",
    animal: "农场动物",
    clockOff: "暂停金钟动画",
    defaultOption: "默认",
    fireplaceLit: "点燃壁炉",
    fishPopulation: "鱼的数量",
    fishSpecies: "鱼种",
    hat: "帽子",
    junimos: "显示祝尼魔",
    machineOutput: "产出物品",
    machineState: "机器状态",
    millLoaded: "磨坊已装入原料",
    millOutput: "显示磨坊产出",
    millProduct: "磨坊产物",
    newAnimalSpecies: "新动物种类",
    noneOption: "无",
    openOptions: "动态效果设置",
    optionsError: "无法加载动态效果设置。",
    optionsLoading: "正在加载动态效果设置…",
    pet: "宠物",
    pondProduce: "鱼塘产出",
    populationRange: (min, max) => `请输入 ${String(min)} 到 ${String(max)} 之间的整数。`,
    removeAnimal: "移除动物",
    selectedAnimal: (animalName, index) => `${animalName} ${String(index)}`,
    shirt: "上衣",
    tankFish: "鱼缸鱼类",
    pants: "裤子",
    horse: "显示马匹",
    unavailableChoice: (choiceId) => `不可用（${choiceId}）`,
  },
  ja: {
    animalCapacity: (maxCount) => `動物は最大${String(maxCount)}匹です`,
    addAnimal: "動物を追加",
    animal: "牧場の動物",
    clockOff: "ゴールデンクロックのアニメーションを停止",
    defaultOption: "デフォルト",
    fireplaceLit: "暖炉に火をつける",
    fishPopulation: "魚の数",
    fishSpecies: "魚の種類",
    hat: "帽子",
    junimos: "ジュニモを表示",
    machineOutput: "生産物",
    machineState: "機械の状態",
    millLoaded: "風車に原料を投入",
    millOutput: "風車の生産物を表示",
    millProduct: "風車の生産物",
    newAnimalSpecies: "追加する動物の種類",
    noneOption: "なし",
    openOptions: "アニメーション設定",
    optionsError: "アニメーション設定を読み込めませんでした。",
    optionsLoading: "アニメーション設定を読み込み中…",
    pet: "ペット",
    pondProduce: "魚の生産物",
    populationRange: (min, max) => `${String(min)}から${String(max)}までの整数を入力してください。`,
    removeAnimal: "動物を削除",
    selectedAnimal: (animalName, index) => `${animalName} ${String(index)}`,
    shirt: "シャツ",
    tankFish: "水槽の魚",
    pants: "ズボン",
    horse: "馬を表示",
    unavailableChoice: (choiceId) => `選択不可（${choiceId}）`,
  },
  ru: {
    animalCapacity: (maxCount) => `Не более ${String(maxCount)} животных`,
    addAnimal: "Добавить животное",
    animal: "Животные фермы",
    clockOff: "Приостановить анимацию золотых часов",
    defaultOption: "По умолчанию",
    fireplaceLit: "Зажечь камин",
    fishPopulation: "Количество рыб",
    fishSpecies: "Вид рыбы",
    hat: "Шляпа",
    junimos: "Показать джунимо",
    machineOutput: "Предмет на выходе",
    machineState: "Состояние машины",
    millLoaded: "В мельницу загружено сырьё",
    millOutput: "Показать продукцию мельницы",
    millProduct: "Продукт мельницы",
    newAnimalSpecies: "Вид нового животного",
    noneOption: "Нет",
    openOptions: "Настройки анимации",
    optionsError: "Не удалось загрузить настройки анимации.",
    optionsLoading: "Загрузка настроек анимации…",
    pet: "Питомец",
    pondProduce: "Продукт пруда",
    populationRange: (min, max) => `Введите целое число от ${String(min)} до ${String(max)}.`,
    removeAnimal: "Удалить животное",
    selectedAnimal: (animalName, index) => `${animalName} ${String(index)}`,
    shirt: "Рубашка",
    tankFish: "Рыбы в аквариуме",
    pants: "Брюки",
    horse: "Показать лошадь",
    unavailableChoice: (choiceId) => `Недоступно (${choiceId})`,
  },
};

export function readPlacementAnimationCopy(
  locale: PlannerChromeLocale,
): PlacementAnimationCopy {
  return placementAnimationCopyByLocale[locale];
}
