import React from "react";
import { levelEraOptions } from "@client/features/game";

export const EraSelector = (props: { startEraKey: keyof typeof levelEraOptions; onSelect: (key: keyof typeof levelEraOptions) => void }) => {
  return (
    <div className="page__item era-selector">
      <label className="era-selector__label">Choose a starting era</label>
      <fieldset className="era-selector__buttons">
        {Object.entries(levelEraOptions).map(([value, label], key) => (
          <button
            key={key}
            className={`era-selector__button${props.startEraKey === value ? " op--selected" : ""}`}
            onClick={() => props.onSelect(value as keyof typeof levelEraOptions)}
          >
            <span>{label}</span>
          </button>
        ))}
      </fieldset>
    </div>
  );
};
