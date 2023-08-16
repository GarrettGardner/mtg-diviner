import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@client/redux";
import { APP_STATUS, appFacade } from "@client/features/app";
import { Button, EraSelector } from "@client/features/common";
import { LEVEL_MODIFIER_KEYS, levelEraOptions, gameFacade } from "@client/features/game";
import { Page } from "@client/features/page";
import { TwitchConnectionCard, TwitchConnectionConnect, twitchConnectionFacade } from "@client/features/twitch-connection";

export const PageStartup = () => {
  const app = useAppSelector(appFacade.selector);
  const twitchConnection = useAppSelector(twitchConnectionFacade.selector);
  const dispatch = useAppDispatch();
  const [startEra, setStartEra] = useState<keyof typeof levelEraOptions>(LEVEL_MODIFIER_KEYS.ERA_2019_NOW);

  const handleGameStart = () => {
    if (app.status === APP_STATUS.ACTIVE) {
      dispatch(gameFacade.thunk.gameStart(startEra));
    }
  };

  return (
    <Page classes="page--startup">
      <div className="page--startup__content">
        <p className="page__header page__item">How to Play!</p>
        <ul className="page--startup__rules">
          <li className="page__item">Earn points by guessing the Magic card name from the hints that appear!</li>
          <li className="page__item">Fill the crystal ball with points to get to the next level!</li>
          <li className="page__item">
            Connect your Twitch Account to play along with your chat <strong>OR</strong> play it solo!
          </li>
        </ul>
        <EraSelector startEraKey={startEra} onSelect={setStartEra} />
        <p>
          <Button classes="page__item" onClick={handleGameStart}>
            Play{!twitchConnection.connected ? " Solo" : ""}
          </Button>
        </p>
      </div>
      <div className="page--startup__twitch-connection page__item">
        {twitchConnection.loading ? (
          <div className="icon--loading">&nbsp;</div>
        ) : twitchConnection.connected ? (
          <TwitchConnectionCard />
        ) : (
          <TwitchConnectionConnect />
        )}
      </div>
      <p className="page--startup__policy page__item">
        MTG Diviner is unofficial Fan Content permitted under the Fan Content Policy. Not approved/endorsed by Wizards. Portions of the materials used are
        property of Wizards of the Coast. ©Wizards of the Coast LLC.
      </p>
    </Page>
  );
};
