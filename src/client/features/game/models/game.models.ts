import { ILevel } from "@client/features/game";

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
    [GAME_POSITION.ONE]: false,
    [GAME_POSITION.TWO]: false,
    [GAME_POSITION.THREE]: false,
  },
  countdownActions: [],
};
