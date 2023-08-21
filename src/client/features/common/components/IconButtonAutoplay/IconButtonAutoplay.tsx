import React from "react";
import { useAppDispatch, useAppSelector } from "@client/redux";
import { IconButton } from "@client/features/common";
import { gameFacade } from "@client/features/game";

export const IconButtonAutoplay = () => {
  const dispatch = useAppDispatch();
  const game = useAppSelector(gameFacade.selector);

  const handleAutoplay = () => {
    dispatch(gameFacade.action.AUTOPLAY_TOGGLE({ isAutoplay: !game.isAutoplay }));
  };

  return (
    <IconButton onClick={handleAutoplay} classes={`icon-button--autoplay${game.isAutoplay ? " op--enabled" : ""}`}>
      Auto
    </IconButton>
  );
};
