import React, { useState, useEffect, useMemo } from "react";
import { ISoundStageSound, soundStageFacade } from "@client/features/sound-stage";
import { useAppSelector } from "@client/redux";

export const SoundStage = () => {
  const soundStage = useAppSelector(soundStageFacade.selector);
  const [currentUpdated, setCurrentUpdated] = useState(0);

  const currentSounds = useMemo(
    () =>
      soundStage.sounds.map((sound) => {
        return {
          ...sound,
          audio: new Audio(sound.url),
        };
      }),
    [],
  );

  useEffect(() => {
    const soundIndex = currentSounds.findIndex((currentSound: ISoundStageSound) => currentSound.name === soundStage.sound);
    if (soundStage.updated > currentUpdated && soundIndex > -1 && currentSounds[soundIndex]) {
      if (!soundStage.muted) {
        currentSounds[soundIndex].audio.play();
      }
      setCurrentUpdated(soundStage.updated);
    }
  });

  return <></>;
};
