import React from "react";
import { Card, GuessInput, IconButton, Leaderboard } from "@client/features/common";
import { ICard, gameFacade } from "@client/features/game";
import { Page } from "@client/features/page";
import { TwitchConnectionCard } from "@client/features/twitch-connection";
import { useAppDispatch, useAppSelector } from "@client/redux";

export const PageLevel = () => {
  const game = useAppSelector(gameFacade.selector);
  const dispatch = useAppDispatch();

  const crystalFillOffset = 100 - Math.min(Math.floor((game.pointsCurrent / game.levels[game.levelActive].pointsPass) * 100), 100);

  const additionalPoints = game.pointsCurrent - game.levels[game.levelActive].pointsPass;
  const pointsDifference = game.levels[game.levelActive].pointsSkip - game.levels[game.levelActive].pointsPass;

  const crystalFillOffset2 = additionalPoints <= 0 ? 100 : 100 - Math.min(Math.floor((additionalPoints / pointsDifference) * 100), 100);

  const handlePause = () => {
    dispatch(gameFacade.thunk.gamePause());
  };

  return (
    <Page classes={`page--level op--game-status-${game.status}`}>
      <div className="cards">
        <div className="cardbg op--position-one page__item"></div>
        <div className="cardbg op--position-two page__item"></div>
        <div className="cardbg op--position-three page__item"></div>
        {game.cards.map((card: ICard) => (
          <Card key={card.id} card={card} />
        ))}
      </div>
      <div className="crystal page__item">
        <div className="crystal__fill__wrap">
          <div className="crystal__fill op--1" style={{ transform: "translateY(" + crystalFillOffset + "%)" }}>
            <div className="crystal__fill__wave op--1"></div>
            <div className="crystal__fill__wave op--2"></div>
            {[...Array(10)].map((x, i) => (
              <div key={i} className={`crystal__fill__sparkle op--${i + 1}`}></div>
            ))}
          </div>
          <div
            className="crystal__fill op--2"
            style={{
              transform: "translateY(" + crystalFillOffset2 + "%)",
            }}
          >
            <div className="crystal__fill__wave op--1"></div>
            <div className="crystal__fill__wave op--2"></div>
          </div>
          <svg width="0%" height="0%">
            <defs>
              <clipPath id="crystalFillPath">
                <path
                  d="M84.4,382.7l-13.2,3.5l-3.3-3.4c-39.7-41.7-61.5-96.4-61.5-154c0-59.7,23.3-115.9,65.5-158.1C114.1,28.5,170.3,5.2,230,5.2
                      s115.9,23.3,158.1,65.5c42.2,42.2,65.5,98.4,65.5,158.1c0,57.1-21.5,111.4-60.6,153l-3.3,3.5l-9.8-2.6l-116.3,67.1
                      c0,0-2.3,0.3-2.5,0.4l-9.1,1.3v-40.8l-22-22l-22,22v43.4L84.4,382.7z"
                />
              </clipPath>
            </defs>
          </svg>
          <div className="crystal__level">
            <div className="crystal__level__number">
              <span>Level {game.levels[game.levelActive].number}</span>
            </div>
            <div className="crystal__level__labels">
              {Object.entries(game.levels[game.levelActive].labels).map(([type, label], key) => (
                <div key={key} className="crystal__level__label">
                  <div className="crystal__level__label__type">{type}</div>
                  <div className="crystal__level__label__value">{label}</div>
                </div>
              ))}
            </div>
            <div className="crystal__cards">
              {game.cards.map((card, key) => (
                <div key={key} className={`crystal__card op--${card.status} op--position-${card.position}`}></div>
              ))}
            </div>
            <div className="crystal__level__points">
              <div className="crystal__level__point__total">
                {game.pointsCurrent}/
                {game.pointsCurrent < game.levels[game.levelActive].pointsPass
                  ? game.levels[game.levelActive].pointsPass
                  : game.levels[game.levelActive].pointsSkip}
              </div>
              <div className="crystal__level__point__label">
                {game.pointsCurrent < game.levels[game.levelActive].pointsPass ? "Points To Pass" : "Points To Skip"}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Leaderboard layout="small" players={game.leaderboard} />
      <GuessInput />
      <TwitchConnectionCard />
      <IconButton classes="icon-button--pause page__item" onClick={handlePause}>
        Pause
      </IconButton>
    </Page>
  );
};
