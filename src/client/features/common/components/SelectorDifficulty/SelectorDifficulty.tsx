import React from "react";
import { LEVEL_DIFFICULTY_KEY } from "@client/features/game";

export const SelectorDifficulty = (props: { difficultyKey: LEVEL_DIFFICULTY_KEY; onSelect: (key: LEVEL_DIFFICULTY_KEY) => void }) => {
  return (
    <div className="page__item selector-difficulty">
      <label className="selector-difficulty__label">Difficulty</label>
      <fieldset className="selector-difficulty__buttons">
        {Object.entries(LEVEL_DIFFICULTY_KEY).map(([value, difficultyKey], key) => (
          <button
            key={key}
            className={`selector-difficulty__button${props.difficultyKey === difficultyKey ? " op--selected" : ""}`}
            onClick={() => props.onSelect(difficultyKey)}
          >
            <span>{value}</span>
          </button>
        ))}
      </fieldset>
    </div>
  );
};
