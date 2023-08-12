import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { appReducer } from "../features/app";
import { gameReducer } from "../features/game";
import { soundStageReducer } from "@client/features/sound-stage";
import { twitchConnectionMiddleware, twitchConnectionReducer } from "@client/features/twitch-connection";

export const store = configureStore({
  reducer: {
    app: appReducer,
    game: gameReducer,
    soundStage: soundStageReducer,
    twitchConnection: twitchConnectionReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([twitchConnectionMiddleware.connect]),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
