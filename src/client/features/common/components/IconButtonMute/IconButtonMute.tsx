import React from "react";
import { useAppDispatch, useAppSelector } from "@client/redux";
import { IconButton } from "@client/features/common";
import { soundStageFacade } from "@client/features/sound-stage";

export const IconButtonMute = () => {
  const dispatch = useAppDispatch();
  const soundStage = useAppSelector(soundStageFacade.selector);

  const handleMute = () => {
    dispatch(soundStageFacade.action.TOGGLE_MUTE(!soundStage.muted));
  };

  return (
    <IconButton onClick={handleMute} classes={`icon-button--mute${soundStage.muted ? " op--muted" : ""}`}>
      {soundStage.muted ? `Unmute` : `Mute`}
    </IconButton>
  );
};
