export enum LEVEL_DIFFICULTY_KEY {
  EASY = "Easy",
  MEDIUM = "Medium",
  HARD = "Hard",
  IMPOSSIBLE = "Impossible",
}

export interface ILevelDifficulty {
  pointsPass: number;
  pointsSkip: number;
}

export const levelModifierDifficulty: { [key in LEVEL_DIFFICULTY_KEY]: ILevelDifficulty } = {
  [LEVEL_DIFFICULTY_KEY.EASY]: {
    pointsPass: 8,
    pointsSkip: 16,
  },
  [LEVEL_DIFFICULTY_KEY.MEDIUM]: {
    pointsPass: 12,
    pointsSkip: 18,
  },
  [LEVEL_DIFFICULTY_KEY.HARD]: {
    pointsPass: 14,
    pointsSkip: 20,
  },
  [LEVEL_DIFFICULTY_KEY.IMPOSSIBLE]: {
    pointsPass: 18,
    pointsSkip: 24,
  },
};

export enum LEVEL_PARAM_KEYS {
  IN_BOOSTER = "inBooster",
  IS_LATEST_EXPANSION = "isLatestExpansion",
  IS_LEGEND = "isLegend",
  IS_PLANESWALKER = "isPlaneswalker",
  MAX_DATE = "maxDate",
  MIN_DATE = "minDate",
  SET = "set",
  SET_TYPE = "setType",
}

export type ILevelParams = {
  [key in LEVEL_PARAM_KEYS]?: string;
};

export interface ILevelModifiers {
  labelMain: string;
  labelSub: string;
  maxNumber?: number;
  minNumber?: number;
  params: ILevelParams;
}

export enum LEVEL_IDS {
  DEFAULT = "default",
  ALPHA = "alpha",
  LATEST = "latest",
  PLANESWALKERS = "planeswalkers",
  EXPANSION_BOOSTER_93_96 = "expansion-booster-93-96",
  EXPANSION_BOOSTER_97_00 = "expansion-booster-97-00",
  EXPANSION_BOOSTER_01_04 = "expansion-booster-01-04",
  EXPANSION_BOOSTER_05_08 = "expansion-booster-05-08",
  EXPANSION_BOOSTER_09_12 = "expansion-booster-09-12",
  EXPANSION_BOOSTER_13_16 = "expansion-booster-13-16",
  EXPANSION_BOOSTER_17_20 = "expansion-booster-17-20",
  EXPANSION_BOOSTER_21_NOW = "expansion-booster-21-now",
  EXPANSION_BOOSTER_ALL = "expansion-booster-all",
  LEGENDARY_CREATURES = "legendary-creatures",
  CORE_SETS = "core-sets",
  STARTER_SETS = "starter-sets",
  DRAFT_INNOVATIONS = "draft-innovations",
  NOT_BOOSTERS = "not-boosters",
  MASTERS_SETS = "masters-sets",
  ALCHEMY = "alchemy",
  TOKENS = "tokens",
  COMMANDER = "commander",
  FUNNY = "funny",
  PROMOS = "promos",
  EVERYTHING = "everything",
}

export interface ILevel extends ILevelDifficulty, ILevelModifiers {
  icon: string;
  id: LEVEL_IDS;
  isStarter?: boolean;
}

export const defaultLevel: ILevel = {
  ...levelModifierDifficulty[LEVEL_DIFFICULTY_KEY.EASY],
  icon: "default",
  id: LEVEL_IDS.DEFAULT,
  labelMain: "Everything",
  labelSub: "Default Level",
  params: {},
};

export const initialLevelPool: ILevel[] = [
  {
    id: LEVEL_IDS.LATEST,
    isStarter: true,
    labelMain: "Latest Set",
    labelSub: "Expansion",
    maxNumber: 3,
    params: {
      [LEVEL_PARAM_KEYS.IS_LATEST_EXPANSION]: "true",
    },
  },
  {
    icon: "alpha",
    id: LEVEL_IDS.ALPHA,
    isStarter: true,
    labelMain: "Alpha",
    labelSub: "Set",
    maxNumber: 2,
    params: {
      [LEVEL_PARAM_KEYS.SET]: "lea",
    },
  },
  {
    icon: "planeswalkers",
    id: LEVEL_IDS.PLANESWALKERS,
    isStarter: true,
    labelMain: "Planeswalkers",
    labelSub: "Card Type",
    maxNumber: 3,
    params: {
      [LEVEL_PARAM_KEYS.IN_BOOSTER]: "true",
      [LEVEL_PARAM_KEYS.IS_PLANESWALKER]: "true",
      [LEVEL_PARAM_KEYS.SET_TYPE]: "expansion",
    },
  },
  {
    icon: "text-93-96",
    id: LEVEL_IDS.EXPANSION_BOOSTER_93_96,
    labelMain: "Boosters",
    labelSub: "1993-1996",
    minNumber: 2,
    maxNumber: 8,
    params: {
      [LEVEL_PARAM_KEYS.IN_BOOSTER]: "true",
      [LEVEL_PARAM_KEYS.MAX_DATE]: "1996-12-31",
      [LEVEL_PARAM_KEYS.SET_TYPE]: "expansion",
    },
  },
  {
    icon: "text-97-00",
    id: LEVEL_IDS.EXPANSION_BOOSTER_97_00,
    labelMain: "Boosters",
    labelSub: "1997-2000",
    minNumber: 3,
    maxNumber: 8,
    params: {
      [LEVEL_PARAM_KEYS.IN_BOOSTER]: "true",
      [LEVEL_PARAM_KEYS.MAX_DATE]: "2000-12-31",
      [LEVEL_PARAM_KEYS.MIN_DATE]: "1997-01-01",
      [LEVEL_PARAM_KEYS.SET_TYPE]: "expansion",
    },
  },
  {
    icon: "text-01-04",
    id: LEVEL_IDS.EXPANSION_BOOSTER_01_04,
    labelMain: "Boosters",
    labelSub: "2001-2004",
    minNumber: 3,
    maxNumber: 8,
    params: {
      [LEVEL_PARAM_KEYS.IN_BOOSTER]: "true",
      [LEVEL_PARAM_KEYS.MAX_DATE]: "2004-12-31",
      [LEVEL_PARAM_KEYS.MIN_DATE]: "2000-01-01",
      [LEVEL_PARAM_KEYS.SET_TYPE]: "expansion",
    },
  },
  {
    icon: "text-05-08",
    id: LEVEL_IDS.EXPANSION_BOOSTER_05_08,
    labelMain: "Boosters",
    labelSub: "2005-2008",
    minNumber: 3,
    maxNumber: 8,
    params: {
      [LEVEL_PARAM_KEYS.IN_BOOSTER]: "true",
      [LEVEL_PARAM_KEYS.MAX_DATE]: "2008-12-31",
      [LEVEL_PARAM_KEYS.MIN_DATE]: "2005-01-01",
      [LEVEL_PARAM_KEYS.SET_TYPE]: "expansion",
    },
  },
  {
    icon: "text-09-12",
    id: LEVEL_IDS.EXPANSION_BOOSTER_09_12,
    labelMain: "Boosters",
    labelSub: "2009-2012",
    minNumber: 3,
    maxNumber: 8,
    params: {
      [LEVEL_PARAM_KEYS.IN_BOOSTER]: "true",
      [LEVEL_PARAM_KEYS.MAX_DATE]: "2012-12-31",
      [LEVEL_PARAM_KEYS.MIN_DATE]: "2009-01-01",
      [LEVEL_PARAM_KEYS.SET_TYPE]: "expansion",
    },
  },
  {
    icon: "text-13-16",
    id: LEVEL_IDS.EXPANSION_BOOSTER_13_16,
    labelMain: "Boosters",
    labelSub: "2013-2016",
    minNumber: 3,
    maxNumber: 8,
    params: {
      [LEVEL_PARAM_KEYS.IN_BOOSTER]: "true",
      [LEVEL_PARAM_KEYS.MAX_DATE]: "2016-12-31",
      [LEVEL_PARAM_KEYS.MIN_DATE]: "2013-01-01",
      [LEVEL_PARAM_KEYS.SET_TYPE]: "expansion",
    },
  },
  {
    icon: "text-17-20",
    id: LEVEL_IDS.EXPANSION_BOOSTER_17_20,
    labelMain: "Boosters",
    labelSub: "2017-2020",
    minNumber: 3,
    maxNumber: 8,
    params: {
      [LEVEL_PARAM_KEYS.IN_BOOSTER]: "true",
      [LEVEL_PARAM_KEYS.MAX_DATE]: "2020-12-31",
      [LEVEL_PARAM_KEYS.MIN_DATE]: "2017-01-01",
      [LEVEL_PARAM_KEYS.SET_TYPE]: "expansion",
    },
  },
  {
    icon: "text-21-23",
    id: LEVEL_IDS.EXPANSION_BOOSTER_21_NOW,
    labelMain: "Boosters",
    labelSub: "2021-Now",
    minNumber: 2,
    maxNumber: 8,
    params: {
      [LEVEL_PARAM_KEYS.IN_BOOSTER]: "true",
      [LEVEL_PARAM_KEYS.MIN_DATE]: "2021-01-01",
      [LEVEL_PARAM_KEYS.SET_TYPE]: "expansion",
    },
  },
  {
    icon: "text-all",
    id: LEVEL_IDS.EXPANSION_BOOSTER_ALL,
    labelMain: "Boosters",
    labelSub: "All",
    minNumber: 10,
    params: {
      [LEVEL_PARAM_KEYS.IN_BOOSTER]: "true",
      [LEVEL_PARAM_KEYS.SET_TYPE]: "expansion",
    },
  },
  {
    icon: "legends",
    id: LEVEL_IDS.LEGENDARY_CREATURES,
    labelMain: "Legends",
    labelSub: "Creatures",
    minNumber: 6,
    maxNumber: 10,
    params: {
      [LEVEL_PARAM_KEYS.IS_PLANESWALKER]: "false",
      [LEVEL_PARAM_KEYS.IS_LEGEND]: "true",
    },
  },
  {
    icon: "core",
    id: LEVEL_IDS.CORE_SETS,
    labelMain: "Core Sets",
    labelSub: "All",
    minNumber: 6,
    maxNumber: 10,
    params: {
      [LEVEL_PARAM_KEYS.SET_TYPE]: "core",
    },
  },
  {
    icon: "starter",
    id: LEVEL_IDS.STARTER_SETS,
    labelMain: "Starter Sets",
    labelSub: "All",
    minNumber: 8,
    maxNumber: 12,
    params: {
      [LEVEL_PARAM_KEYS.SET_TYPE]: "starter",
    },
  },
  {
    id: LEVEL_IDS.DRAFT_INNOVATIONS,
    labelMain: "Special Drafts",
    labelSub: "Draft Innovations",
    minNumber: 10,
    maxNumber: 16,
    params: {
      [LEVEL_PARAM_KEYS.SET_TYPE]: "draft_innovation",
    },
  },
  {
    icon: "not-boosters",
    id: LEVEL_IDS.NOT_BOOSTERS,
    labelMain: "Not in Boosters",
    labelSub: "All",
    minNumber: 10,
    maxNumber: 16,
    params: {
      [LEVEL_PARAM_KEYS.IN_BOOSTER]: "false",
    },
  },
  {
    icon: "masters",
    id: LEVEL_IDS.MASTERS_SETS,
    labelMain: "Master's Sets",
    labelSub: "All",
    minNumber: 10,
    maxNumber: 16,
    params: {
      [LEVEL_PARAM_KEYS.SET_TYPE]: "masters",
    },
  },
  {
    icon: "alchemy",
    id: LEVEL_IDS.ALCHEMY,
    labelMain: "Alchemy",
    labelSub: "Magic Arena",
    minNumber: 12,
    maxNumber: 16,
    params: {
      [LEVEL_PARAM_KEYS.SET_TYPE]: "alchemy",
    },
  },
  {
    icon: "tokens",
    id: LEVEL_IDS.TOKENS,
    labelMain: "Tokens Only",
    labelSub: "All",
    minNumber: 10,
    maxNumber: 18,
    params: {
      [LEVEL_PARAM_KEYS.SET_TYPE]: "token",
    },
  },
  {
    icon: "commander",
    id: LEVEL_IDS.COMMANDER,
    labelMain: "Commander",
    labelSub: "All",
    minNumber: 6,
    maxNumber: 12,
    params: {
      [LEVEL_PARAM_KEYS.SET_TYPE]: "commander",
    },
  },
  {
    icon: "funny",
    id: LEVEL_IDS.FUNNY,
    labelMain: "Funny Cards",
    labelSub: "All",
    minNumber: 16,
    params: {
      [LEVEL_PARAM_KEYS.SET_TYPE]: "funny",
    },
  },
  {
    icon: "promos",
    id: LEVEL_IDS.PROMOS,
    labelMain: "Promos",
    labelSub: "All",
    minNumber: 14,
    params: {
      [LEVEL_PARAM_KEYS.SET_TYPE]: "promo",
    },
  },
  {
    icon: "everything",
    id: LEVEL_IDS.EVERYTHING,
    labelMain: "Everything",
    labelSub: "Literally",
    minNumber: 12,
    params: {},
  },
].map((level) => ({
  ...defaultLevel,
  ...level,
}));
