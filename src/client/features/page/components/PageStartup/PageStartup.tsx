import React, { useEffect, useState } from "react";
import { useTimeout } from "@client/hooks";
import { useAppDispatch, useAppSelector } from "@client/redux";
import { APP_STATUS, appFacade } from "@client/features/app";
import { Button, SelectorDifficulty, SelectorLevel } from "@client/features/common";
import { defaultLevel, gameFacade, initialLevelPool, LEVEL_DIFFICULTY_KEY, LEVEL_IDS } from "@client/features/game";
import { Page } from "@client/features/page";
import { TwitchConnectionCard, TwitchConnectionConnect, twitchConnectionFacade } from "@client/features/twitch-connection";

export const PageStartup = () => {
  const app = useAppSelector(appFacade.selector);
  const game = useAppSelector(gameFacade.selector);
  const dispatch = useAppDispatch();
  const twitchConnection = useAppSelector(twitchConnectionFacade.selector);

  const [levelID, setLevelID] = useState(LEVEL_IDS.DEFAULT);
  const [difficultyKey, setDifficultyKey] = useState(LEVEL_DIFFICULTY_KEY.MEDIUM);

  const handleGameStart = () => {
    if (app.status === APP_STATUS.ACTIVE) {
      dispatch(gameFacade.thunk.gameStart(difficultyKey, levelID));
    }
  };

  const levels = [...initialLevelPool].filter((level) => level.isStarter) || [defaultLevel];

  useEffect(() => {
    setLevelID(levels?.[1].id || levels?.[0].id || defaultLevel.id);
  }, []);

  useTimeout(() => handleGameStart(), 5000, game.isAutoplay);

  return (
    <Page classes="page--startup">
      <div className="page--startup__box page__item">
        <p className="page--startup__box__header">How to Play!</p>
        <ul>
          <li>Earn points by guessing the Magic card name from the hints that appear!</li>
          <li>Fill the crystal ball with points to get to the next level!</li>
          <li>
            Connect your Twitch Account to play along with your chat <strong>OR</strong> play it solo!
          </li>
        </ul>
      </div>
      <div className="page--startup__content">
        <SelectorDifficulty difficultyKey={difficultyKey} onSelect={setDifficultyKey} />
        <SelectorLevel labelText={"Start level"} levelID={levelID} levels={levels} onSelect={setLevelID} />
      </div>
      <div className="page--startup__button page__item">
        <Button onClick={handleGameStart} countdown={game.isAutoplay}>
          {`Play${!twitchConnection.connected ? " Solo" : ""}`}
        </Button>
      </div>
      <div className="page--startup__box op--right page__item">
        <p className="page--startup__box__header">Play tips!</p>
        <ul>
          <li>For planeswalkers and legends, just guess the first name!</li>
          <li>Difficulty increases the points needed to beat each level, adjust for party size!</li>
          <li>Levels are randomly generated, choose from the list after each round!</li>
        </ul>
      </div>
      <p className="page--startup__policy page__item">
        MTG Diviner is unofficial Fan Content permitted under the Fan Content Policy. Not approved/endorsed by Wizards. Portions of the materials used are
        property of Wizards of the Coast. &copy;Wizards of the Coast LLC.
      </p>
      <div className="page--startup__twitch-connection page__item">
        {twitchConnection.loading ? (
          <div className="icon--loading">&nbsp;</div>
        ) : twitchConnection.connected ? (
          <TwitchConnectionCard />
        ) : (
          <TwitchConnectionConnect />
        )}
      </div>
    </Page>
  );
};
