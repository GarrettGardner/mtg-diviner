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

  const handleDebugMode = () => {
    if (app.debugMode || app.page === APP_PAGE.STARTUP) {
      dispatch(appFacade.action.UPDATE_DEBUG_MODE(!app.debugMode));
      window.debugMode = !app.debugMode;
    }
  };

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
          <button className={`app__debugmode ${app.debugMode ? " op--on" : ""}`} onClick={handleDebugMode}>
            Debug Mode: {app.debugMode ? "On" : "Off"}
          </button>
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
