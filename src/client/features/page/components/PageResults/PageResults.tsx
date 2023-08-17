import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@client/redux";
import { APP_PAGE, APP_STATUS, appFacade } from "@client/features/app";
import { Button, Leaderboard } from "@client/features/common";
import { CARD_STATUS, GAME_STATUS, gameFacade } from "@client/features/game";
import { Page, messages } from "@client/features/page";
import { soundStageFacade } from "@client/features/sound-stage";

export const PageResults = () => {
  const dispatch = useAppDispatch();
  const app = useAppSelector(appFacade.selector);
  const game = useAppSelector(gameFacade.selector);
  const [message, setMessage] = useState("");
  const [expandedCard, setExpandedCard] = useState(-1);

  useEffect(() => {
    if (game.status === GAME_STATUS.INACTIVE) {
      setMessage(messages.win[Math.floor(Math.random() * messages.win.length)]);
      dispatch(soundStageFacade.action.PLAY_SOUND("round-won"));
    } else if (game.status === GAME_STATUS.LOST) {
      setMessage(messages.loss[Math.floor(Math.random() * messages.loss.length)]);
      dispatch(soundStageFacade.action.PLAY_SOUND("round-lost"));
    }
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
      dispatch(appFacade.thunk.transitionOutPage(() => dispatch(gameFacade.thunk.levelInit())));
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
          <span>Level {game.levels[game.levelActive].number}</span>
        </p>
        <h2 className="page__header page__item">
          {game.status === GAME_STATUS.INACTIVE && "Completed"}
          {game.status === GAME_STATUS.LOST && "Defeated"}
        </h2>
        {message && <p className="page__subheader page__item">{message}</p>}
        <p>
          {game.status === GAME_STATUS.INACTIVE && (
            <Button classes="page__item" onClick={handleGameNextLevel}>
              Next Level
            </Button>
          )}
          {game.status === GAME_STATUS.LOST && (
            <Button classes="page__item" onClick={handleGameRestart}>
              Try again?
            </Button>
          )}
        </p>
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
