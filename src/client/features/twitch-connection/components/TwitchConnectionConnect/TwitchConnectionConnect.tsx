import React from "react";
import { useAppSelector } from "@client/redux";
import { TWITCH_CLIENT_ID, PUBLIC_URL } from "@client/utils";
import { twitchConnectionFacade } from "@client/features/twitch-connection";

export const TwitchConnectionConnect = () => {
  const twitchConnection = useAppSelector(twitchConnectionFacade.selector);
  const uri = encodeURIComponent(PUBLIC_URL);
  const twitchAuthorizeURL = `https://id.twitch.tv/oauth2/authorize?client_id=${TWITCH_CLIENT_ID}&redirect_uri=${uri}&response_type=token&scope=user%3Aread%3Aemail`;

  return !twitchConnection.connected ? (
    <a className="twitch-connection-connect" href={twitchAuthorizeURL}>
      <span>Connect Twitch</span>
    </a>
  ) : (
    <></>
  );
};
