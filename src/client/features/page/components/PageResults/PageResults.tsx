import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@client/redux";
import { APP_PAGE, APP_STATUS, appFacade } from "@client/features/app";
import { Button, Leaderboard, LevelDetail, SelectorLevel } from "@client/features/common";
import { CARD_STATUS, GAME_STATUS, ILevel, LEVEL_IDS, defaultLevel, gameFacade, initialLevelPool } from "@client/features/game";
import { Page, messages } from "@client/features/page";
import { soundStageFacade } from "@client/features/sound-stage";

export const PageResults = () => {
  const dispatch = useAppDispatch();
  const app = useAppSelector(appFacade.selector);
  const game = useAppSelector(gameFacade.selector);

  const [expandedCard, setExpandedCard] = useState(-1);
  const [levelPoolChoices, setLevelPoolChoices] = useState<ILevel[]>([]);
  const [levelID, setLevelID] = useState(LEVEL_IDS.DEFAULT);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (game.status === GAME_STATUS.INACTIVE) {
      setMessage(messages.win[Math.floor(Math.random() * messages.win.length)]);
      dispatch(soundStageFacade.action.PLAY_SOUND("round-won"));
    } else if (game.status === GAME_STATUS.LOST) {
      setMessage(messages.loss[Math.floor(Math.random() * messages.loss.length)]);
      dispatch(soundStageFacade.action.PLAY_SOUND("round-lost"));
    }

    let levelPool = game.levelPool
      .filter((level) => (!level.minNumber || game.levelNumberNext >= level.minNumber) && (!level.maxNumber || game.levelNumberNext <= level.maxNumber))
      .slice(0, 3);
    levelPool = levelPool.length ? levelPool : [defaultLevel];
    setLevelPoolChoices(levelPool);
    setLevelID(levelPool?.[1].id || levelPool[0].id);
  }, []);

  const expandCard = (key: number) => {
    if (key === expandedCard) {
      setExpandedCard(-1);
    } else {
      setExpandedCard(key);
    }
  };

  const handleGameNextLevel = () => {
    if (app.status === APP_STATUS.ACTIVE) {
      dispatch(appFacade.thunk.transitionOutPage(() => dispatch(gameFacade.thunk.levelInitialize(levelID))));
    }
  };

  const handleGameRestart = () => {
    if (app.status === APP_STATUS.ACTIVE) {
      dispatch(appFacade.thunk.transitionPage(APP_PAGE.STARTUP));
    }
  };

  return (
    <Page classes="page--results">
      <div className="page--results__content">
        <p className="page--results__level page__item">
          <span>Level {game.levelNumber}</span>
        </p>
        <p className="page--results__difficulty page__item">{game.difficulty}</p>
        <h2 className="page__header page__item">
          {game.status === GAME_STATUS.INACTIVE && "Completed"}
          {game.status === GAME_STATUS.LOST && "Defeated"}
        </h2>
        {message && <p className="page__subheader page__item">{message}</p>}
        <div className="page--results__level-active page__item">
          <LevelDetail classes={"op--large"} level={game.levelActive} />
        </div>
      </div>
      <div className="page--results__bottom page__item">
        {game.status === GAME_STATUS.INACTIVE && (
          <>
            <SelectorLevel labelText={`Next: Level ${game.levelNumberNext}`} levelID={levelID} levels={levelPoolChoices} onSelect={setLevelID} />
            <p>
              <Button onClick={handleGameNextLevel}>Next Level</Button>
            </p>
          </>
        )}
        {game.status === GAME_STATUS.LOST && (
          <p>
            <Button onClick={handleGameRestart}>Try again?</Button>
          </p>
        )}
      </div>
      <Leaderboard layout="large" players={game.leaderboard} />
      <div className="page--results__cards page__item">
        {game.cards.map((card, key) => (
          <div key={key} className={`card-recap${key === expandedCard ? " op--expanded" : ""}`} onClick={() => expandCard(key)}>
            <div className="card-recap__img">
              <img src={card.image_full} alt="" role="presentation" />
            </div>
            <div className="card-recap__status">
              <div className={`card-recap__status__text op--${card.status}`}>
                {card.status === CARD_STATUS.EXPIRED && <p className="missed">Missed!</p>}
                {card.status === CARD_STATUS.SOLVED && (
                  <>
                    <p className="points">+1 Point</p>
                    {card.solvers.map((solver, key) => (
                      <p key={key} className="solver">
                        {solver}
                      </p>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Page>
  );
};
