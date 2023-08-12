import React, { useEffect } from "react";
import { useAppDispatch } from "@client/redux";
import { gameFacade } from "@client/features/game";

export const GameEngine = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const visibilitychangeEventListener = () => {
      dispatch(gameFacade.thunk.gamePause());
    };

    window.addEventListener("visibilitychange", visibilitychangeEventListener);

    return () => {
      window.removeEventListener("visibilitychange", visibilitychangeEventListener);
    };
  }, []);

  return <></>;
};
