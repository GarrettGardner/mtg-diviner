import { ILevel, LEVEL_DIFFICULTY_KEY, defaultLevel } from "@client/features/game";

export const MAX_CARDS = 24;

export enum GAME_POSITION {
  NONE = "none",
  ONE = "one",
  TWO = "two",
  THREE = "three",
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
  date: string;
  id: string;
  image_art: string;
  image_full: string;
  in_booster: boolean;
  is_legend: boolean;
  is_planeswalker: boolean;
  name: string;
  position: GAME_POSITION;
  rarity: string;
  set: string;
  set_type: string;
  solved?: number;
  solvers: string[];
  status: CARD_STATUS;
  type: string;
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
  countdownActions: ICountdownAction[];
  cards: ICard[];
  difficulty?: LEVEL_DIFFICULTY_KEY;
  isAutoplay: boolean;
  leaderboard: ILeaderboardPlayer[];
  levelActive: ILevel;
  levelNumber: number;
  levelNumberNext: number;
  levelPool: ILevel[];
  pointsCurrent: number;
  positions: {
    [GAME_POSITION.ONE]: boolean;
    [GAME_POSITION.TWO]: boolean;
    [GAME_POSITION.THREE]: boolean;
  };
  status: GAME_STATUS;
}

export const initialGame: IGame = {
  countdownActions: [],
  cards: [],
  isAutoplay: false,
  leaderboard: [],
  levelActive: defaultLevel,
  levelNumber: 1,
  levelNumberNext: 0,
  levelPool: [],
  pointsCurrent: 0,
  positions: {
    [GAME_POSITION.ONE]: false,
    [GAME_POSITION.TWO]: false,
    [GAME_POSITION.THREE]: false,
  },
  status: GAME_STATUS.INACTIVE,
};
