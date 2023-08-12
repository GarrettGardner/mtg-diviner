import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { twitchConnectionFacade } from "@client/features/twitch-connection";

export const TwitchConnectionCard = () => {
  const twitchConnection = useSelector(twitchConnectionFacade.selector);
  const dispatch = useDispatch();

  const handleTwitchDisconnect = () => {
    if (!window.confirm("Do you want to disconnect your Twitch account?")) {
      return;
    }
    dispatch(twitchConnectionFacade.action.DISCONNECT());
  };

  return twitchConnection.connected ? (
    <div className="twitch-connection-card page__item">
      <button className="twitch-connection-card__disconnect" onClick={handleTwitchDisconnect}>
        X
      </button>
      <div
        className="twitch-connection-card__avatar"
        style={{
          backgroundImage: "url(" + twitchConnection.avatar + ")",
        }}
      ></div>
      <div className="twitch-connection-card__info">
        <div className="twitch-connection-card__username">{twitchConnection.username}</div>
        <div className="twitch-connection-card__label">Twitch Connected</div>
      </div>
    </div>
  ) : (
    <></>
  );
};
