import React, { useEffect } from "react";
import { useAppDispatch } from "@client/redux";
import { twitchConnectionFacade } from "@client/features/twitch-connection";

export const TwitchConnection = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const parsedHash = new URLSearchParams(window.location.hash.slice(1));
    const twitchAccessToken = parsedHash.get("access_token");

    if (twitchAccessToken) {
      dispatch(twitchConnectionFacade.thunk.connectStart(twitchAccessToken));
      window.location.hash = "";
    }
  }, []);

  return <></>;
};
