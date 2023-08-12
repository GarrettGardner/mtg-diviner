export const MAX_CARDS = 24;

export enum GAME_POSITION {
  ONE = "one",
  TWO = "two",
  THREE = "three",
}

export enum POSITION_NONE {
  NONE = "none",
}

export enum CARD_STATUS {
  PENDING = "pending",
  ACTIVE = "active",
  SOLVED = "solved",
  EXPIRED = "expired",
}

export enum CARD_COLOR {
  COLORLESS = "C",
  WHITE = "W",
  BLUE = "U",
  BLACK = "B",
  RED = "R",
  GREEN = "G",
  MULTICOLORED = "M",
}

export interface ICard {
  color: CARD_COLOR;
  cost: string;
  id: string;
  image_art: string;
  image_full: string;
  name: string;
  position: GAME_POSITION | POSITION_NONE;
  rarity: string;
  set: string;
  solved?: number;
  solvers?: string[];
  status: CARD_STATUS;
  type: string;
}

export interface APIParams {
  maxYear?: number;
  minYear?: number;
  setType?: string;
}

interface ILevelEra {
  labelEra: string;
  apiParams: APIParams;
}

export const levelEras: ILevelEra[] = [
  {
    labelEra: "1993–1997",
    apiParams: {
      maxYear: 1997,
      setType: "core-expansion",
    },
  },
  {
    labelEra: "1998–2002",
    apiParams: {
      maxYear: 2002,
      minYear: 1998,
      setType: "core-expansion",
    },
  },
  {
    labelEra: "2003–2007",
    apiParams: {
      maxYear: 2007,
      minYear: 2003,
      setType: "core-expansion",
    },
  },
  {
    labelEra: "2008–2012",
    apiParams: {
      maxYear: 2012,
      minYear: 2008,
      setType: "core-expansion",
    },
  },
  {
    labelEra: "2013–2018",
    apiParams: {
      maxYear: 2018,
      minYear: 2013,
      setType: "core-expansion",
    },
  },
  {
    labelEra: "2019–Now",
    apiParams: {
      minYear: 2019,
      setType: "core-expansion",
    },
  },
];

const levelEraAll: ILevelEra = {
  labelEra: "All",
  apiParams: {},
};

export interface ILevelSetType {
  labelSetType: string;
  apiParams: APIParams;
}

const levelSetTypes: ILevelSetType[] = [
  {
    labelSetType: "Core/Expansion",
    apiParams: {
      setType: "core-expansion",
    },
  },
];

const levelSetTypeAll: ILevelSetType = {
  labelSetType: "All Cards",
  apiParams: {},
};

export interface ILevel extends ILevelEra, ILevelSetType {
  number: number;
  pointsRequired: number;
  pointsRequired2: number;
}

export const defaultLevel: ILevel = {
  number: 0,
  labelEra: "",
  labelSetType: "",
  pointsRequired: 0,
  pointsRequired2: 0,
  apiParams: {},
};

export const initialLevels: ILevel[] = [
  {
    ...defaultLevel,
    ...levelSetTypes[0],
    number: 1,
    pointsRequired: 6,
    pointsRequired2: 12,
  },
  {
    ...defaultLevel,
    ...levelSetTypes[0],
    number: 2,
    pointsRequired: 8,
    pointsRequired2: 16,
  },
  {
    ...defaultLevel,
    ...levelSetTypes[0],
    number: 3,
    pointsRequired: 12,
    pointsRequired2: 18,
  },
  {
    ...defaultLevel,
    ...levelSetTypes[0],
    number: 4,
    pointsRequired: 16,
    pointsRequired2: 24,
  },
  {
    ...defaultLevel,
    ...levelEraAll,
    ...levelSetTypes[0],
    number: 5,
    pointsRequired: 10,
    pointsRequired2: 16,
  },
  {
    ...defaultLevel,
    ...levelEraAll,
    ...levelSetTypes[0],
    number: 6,
    pointsRequired: 12,
    pointsRequired2: 18,
  },
  {
    ...defaultLevel,
    ...levelEraAll,
    ...levelSetTypes[0],
    number: 7,
    pointsRequired: 14,
    pointsRequired2: 20,
  },
  {
    ...defaultLevel,
    ...levelEraAll,
    ...levelSetTypes[0],
    number: 8,
    pointsRequired: 18,
    pointsRequired2: 24,
  },
  {
    ...defaultLevel,
    ...levelEraAll,
    ...levelSetTypeAll,
    number: 9,
    pointsRequired: 10,
    pointsRequired2: 16,
  },
  {
    ...defaultLevel,
    ...levelEraAll,
    ...levelSetTypeAll,
    number: 10,
    pointsRequired: 12,
    pointsRequired2: 18,
  },
  {
    ...defaultLevel,
    ...levelEraAll,
    ...levelSetTypeAll,
    number: 11,
    pointsRequired: 14,
    pointsRequired2: 20,
  },
  {
    ...defaultLevel,
    ...levelEraAll,
    ...levelSetTypeAll,
    number: 12,
    pointsRequired: 16,
    pointsRequired2: 24,
  },
];

export interface ILevelActive extends ILevel {
  pointsCurrent: number;
}

export interface ILeaderboardPlayer {
  username: string;
  points: number;
  added: number;
}

export enum COUNTDOWN_ACTION_TYPE {
  CARD_ACTIVATE = "cardActivate",
  CARD_EXPIRE = "cardExpire",
  LEVEL_END = "levelEnd",
}

export interface ICountdownAction {
  startTime: number;
  duration: number;
  timeout: number;
  actionType: COUNTDOWN_ACTION_TYPE;
  actionArgument?: GAME_POSITION | ICard["id"];
}

export enum GAME_STATUS {
  INACTIVE = "inactive",
  ACTIVE = "active",
  PAUSED = "paused",
  LOST = "lost",
}

export interface IGame {
  status: GAME_STATUS;
  cards: ICard[];
  levels: ILevel[];
  levelActive: number;
  pointsCurrent: number;
  leaderboard: ILeaderboardPlayer[];
  positions: {
    [GAME_POSITION.ONE]: boolean;
    [GAME_POSITION.TWO]: boolean;
    [GAME_POSITION.THREE]: boolean;
  };
  countdownActions: ICountdownAction[];
}

export const initialGame: IGame = {
  status: GAME_STATUS.INACTIVE,
  cards: [],
  levels: [],
  levelActive: 0,
  pointsCurrent: 0,
  leaderboard: [],
  positions: {
    one: false,
    two: false,
    three: false,
  },
  countdownActions: [],
};
