import React from "react";
import { useAppDispatch } from "@client/redux";
import { Button } from "@client/features/common";
import { gameFacade } from "@client/features/game";

export const PausedOverlay = () => {
  const dispatch = useAppDispatch();

  const handleResume = () => {
    dispatch(gameFacade.thunk.gameResume());
  };

  return (
    <div className="paused-overlay">
      <h2 className="paused-overlay__header">Game paused</h2>
      <Button onClick={handleResume} classes="actions__button">
        Resume
      </Button>
    </div>
  );
};
