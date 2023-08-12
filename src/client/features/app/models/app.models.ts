export enum APP_STATUS {
  ENTERING = "entering",
  LOADING = "loading",
  ACTIVE = "active",
  EXITING = "exiting",
  ERROR = "error",
}

export enum APP_PAGE {
  NONE = "none",
  STARTUP = "startup",
  GAME_ROUND = "game-round",
  RESULTS = "results",
}

export interface IApp {
  debugMode: false;
  error: false;
  lock: boolean;
  page: APP_PAGE;
  status: APP_STATUS;
}

export const initialApp: IApp = {
  debugMode: false,
  error: false,
  lock: false,
  page: APP_PAGE.STARTUP,
  status: APP_STATUS.ACTIVE,
};
