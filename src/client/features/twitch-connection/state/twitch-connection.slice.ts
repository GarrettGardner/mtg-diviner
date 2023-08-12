import axios from "axios";
import { createSlice } from "@reduxjs/toolkit";
import { client as tmi, Client as TmiType } from "tmi.js";
import { AppThunk, RootState } from "@client/redux";
import { TWITCH_CLIENT_ID, debugMessage } from "@client/utils";
import { appFacade } from "@client/features/app";
import { gameFacade } from "@client/features/game";
import { initialTwitchConnection } from "@client/features/twitch-connection";

const twitchConnectionSlice = createSlice({
  name: "TWITCH_CONNECTION",
  initialState: initialTwitchConnection,
  reducers: {
    CONNECT_LOAD: (state) => {
      state.loading = true;
    },
    CONNECT_WEBSOCKET: (state, action) => {
      state.avatar = action.payload.avatar;
      state.connected = true;
      state.username = action.payload.username;
    },
    CONNECT_COMPLETE: (state, action) => {
      state.loading = false;
    },
    DISCONNECT: (state) => {
      state.avatar = undefined;
      state.connected = false;
      state.username = undefined;
      state.loading = false;
    },
  },
});

export let twitchChatClient: TmiType | undefined;

export const twitchConnectionMiddleware = {
  //TODO: Properly type each parameter
  connect: (store: any) => (next: any) => (action: any) => {
    const { dispatch } = store;
    const { type } = action;

    switch (type) {
      case "TWITCH_CONNECTION/CONNECT_WEBSOCKET":
        const username = action.payload.username;
        const avatar = action.payload.avatar;

        twitchChatClient = new tmi({
          options: {
            debug: false,
          },
          connection: {
            secure: true,
            reconnect: true,
          },
          channels: [username],
        });

        twitchChatClient.connect();

        twitchChatClient.on("connected", () => {
          debugMessage(`Websocket connection to Twitch chat (${username}) opened.`);
          dispatch(twitchConnectionFacade.action.CONNECT_COMPLETE({ username, avatar }));
        });

        twitchChatClient.on("disconnected", () => {
          debugMessage(`Websocket connection to Twitch chat (${username}) closed.`);
        });

        twitchChatClient.on("message", (channel, tags, message, self) => {
          const username = tags?.username || "Chatter";
          const chatMessage = String(message).trim().toLowerCase();
          if (username && chatMessage) {
            dispatch(twitchConnectionFacade.thunk.guessChat(username, chatMessage));
          }
        });

        twitchChatClient.on("timeout", (error) => {
          dispatch(appFacade.thunk.handleError(`Twitch Chat Connection Timeout Error: ${error}`));
        });
        break;
      case "TWITCH_CONNECTION/DISCONNECT":
        if (twitchChatClient) {
          twitchChatClient.disconnect();
          twitchChatClient = undefined;
        }
        break;
    }

    return next(action);
  },
};

const twitchConnectionThunks = {
  connectStart:
    (twitchAccessToken: string): AppThunk =>
    async (dispatch, getState) => {
      dispatch(twitchConnectionFacade.action.CONNECT_LOAD());

      const response = await axios.get("https://api.twitch.tv/helix/users", {
        headers: {
          Authorization: "Bearer " + twitchAccessToken,
          "Client-ID": TWITCH_CLIENT_ID,
        },
      });

      if (response?.status !== 200) {
        dispatch(appFacade.thunk.handleError(`Twitch Connection Error: ${response?.statusText}`));
        return;
      }

      const username = response?.data?.data?.[0]?.login;
      const avatar = response?.data?.data?.[0]?.profile_image_url;

      if (!username || !avatar) {
        dispatch(appFacade.thunk.handleError(`Twitch Response Error: ${response?.statusText}`));
        return;
      }

      dispatch(twitchConnectionFacade.action.CONNECT_WEBSOCKET({ username, avatar }));
    },

  guessChat:
    (username: string, guess: string): AppThunk =>
    (dispatch, getState) => {
      dispatch(gameFacade.thunk.guessProcess(username, guess));
    },
};

export const twitchConnectionFacade = {
  action: twitchConnectionSlice.actions,
  selector: (state: RootState) => state.twitchConnection,
  thunk: twitchConnectionThunks,
};

export const twitchConnectionReducer = twitchConnectionSlice.reducer;
