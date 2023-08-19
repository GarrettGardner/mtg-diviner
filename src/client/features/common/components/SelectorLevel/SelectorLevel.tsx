import React from "react";
import { ILevel, LEVEL_IDS } from "@client/features/game";
import { LevelDetail } from "../LevelDetail/LevelDetail";

export const SelectorLevel = (props: { labelText: string; levelID: LEVEL_IDS; levels: ILevel[]; onSelect: (key: LEVEL_IDS) => void }) => {
  return (
    <div className="page__item selector-level">
      <label className="selector-level__label">{props.labelText}</label>
      <fieldset className="selector-level__buttons">
        {props.levels.map((level, key) => (
          <button key={key} className="selector-level__button" onClick={() => props.onSelect(level.id)}>
            <LevelDetail classes={`${props.levelID !== level.id ? " op--gray" : ""}`} level={level} />
          </button>
        ))}
      </fieldset>
    </div>
  );
};
