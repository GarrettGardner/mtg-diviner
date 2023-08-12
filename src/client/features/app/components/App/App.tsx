import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@client/redux";
import { GAME_STATUS, GameEngine, gameFacade } from "@client/features/game";
import { TwitchConnection } from "@client/features/twitch-connection";
import { PageError, PageLevel, PageResults, PageStartup } from "@client/features/page";
import { SoundStage } from "@client/features/sound-stage";
import { IconButtonMute, IconButtonFullscreen, PausedOverlay } from "@client/features/common";
import { APP_PAGE, APP_STATUS, appFacade } from "@client/features/app";
import { VERSION } from "@client/utils";

export const App = () => {
  const app = useAppSelector(appFacade.selector);
  const game = useAppSelector(gameFacade.selector);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const resizeWindow = () => {
      document.getElementById("app")!.style.transform = `scale(${Math.min(window.innerWidth / 1920, window.innerHeight / 1080)})`;
    };
    resizeWindow();
    window.addEventListener("resize", resizeWindow);

    return () => {
      window.removeEventListener("resize", resizeWindow);
    };
  }, []);

  useEffect(() => {
    const updateDebugMode = () => {
      const debugMode = !!window.debugMode;
      if (app.debugMode !== debugMode) {
        dispatch(appFacade.action.UPDATE_DEBUG_MODE(debugMode));
      }
    };

    window.addEventListener("click", updateDebugMode);

    return () => {
      window.removeEventListener("click", updateDebugMode);
    };
  }, [app.debugMode]);

  return (
    <>
      <div id="app" className="app">
        <main className={`app__main op--status-${app.status}`}>
          {app.status === APP_STATUS.ERROR ? (
            <PageError />
          ) : (
            <>
              {app.page === APP_PAGE.STARTUP && <PageStartup />}
              {app.page === APP_PAGE.GAME_ROUND && <PageLevel />}
              {app.page === APP_PAGE.RESULTS && <PageResults />}
              <IconButtonMute />
              <IconButtonFullscreen />
            </>
          )}
        </main>
        <footer className="app__footer">
          <div className="app__credits">
            <p>
              Created by Garrett Gardner. Thanks to{" "}
              <a href="https://scryfall.com/" target="_blank">
                Scryfall
              </a>{" "}
              and{" "}
              <a href="https://github.com/andrewgioia" target="_blank">
                Andrew Gioia
              </a>
            </p>
          </div>
          <div className="app__version">v{VERSION}</div>
        </footer>
        <GameEngine />
        <SoundStage />
        <TwitchConnection />
      </div>
      {game.status === GAME_STATUS.PAUSED && <PausedOverlay />}
    </>
  );
};
