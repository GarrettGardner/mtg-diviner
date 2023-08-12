import React from "react";
import { useAppDispatch, useAppSelector } from "@client/redux";
import { IGuessInputFormElement } from "@client/features/common";
import { gameFacade } from "@client/features/game";
import { twitchConnectionFacade } from "@client/features/twitch-connection";

export const GuessInput = () => {
  const twitchConnection = useAppSelector(twitchConnectionFacade.selector);
  const dispatch = useAppDispatch();

  const handleSubmit = (e: React.FormEvent<IGuessInputFormElement>) => {
    e.preventDefault();

    let username = twitchConnection.username || "Browser";
    dispatch(gameFacade.thunk.guessProcess(username, e.currentTarget.guess.value));

    e.currentTarget.guess.value = "";
  };

  return (
    <div className="guess-input page__item">
      <form onSubmit={handleSubmit}>
        <input className="guess-input__text" name="guess" type="text" placeholder="Guess here..." />
        <button className="guess-input__button">
          <span>Guess</span>
        </button>
      </form>
    </div>
  );
};
