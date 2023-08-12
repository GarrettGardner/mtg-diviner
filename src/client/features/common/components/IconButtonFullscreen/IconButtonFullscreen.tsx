import React, { useEffect, useState } from "react";
import { IconButton } from "@client/features/common";

export const IconButtonFullscreen = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullScreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);

    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const handleFullScreen = () => {
    if (isFullScreen) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  };

  return (
    <IconButton onClick={handleFullScreen} classes="icon-button--fullscreen">
      {!isFullScreen ? `Expand` : `Exit`}
    </IconButton>
  );
};
